import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { IMetadata } from 'src/common';
import { count, eq } from 'drizzle-orm';
import { OrderEntity } from './entities/order.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  ChangeOrderStatusDto,
  OrderPaginationDto,
  PaidOrderDto,
  UpdateOrderDto,
  CreateOrderDto,
} from './dto';
import { Status, STATUS_ENUM } from 'src/drizzle/schema/order';
import { NATS_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';
import { OrderWithProducts } from './interfaces/order-with-products.interface';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger('OrdersService');

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private drizzle: DrizzleService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const validateProducts = createOrderDto.items.map((item) => ({
      id: item.productId,
      quantity: item.quantity,
    }));

    const products =
      await this.validateProductsExistenceAndStock(validateProducts);

    try {
      const { totalAmount, totalItems } = createOrderDto.items.reduce(
        (acc, orderItem) => {
          const product = products.find(
            (product) => product.id === orderItem.productId,
          );

          if (product) {
            const amount = acc.totalAmount + product.price * orderItem.quantity;
            const items = acc.totalItems + orderItem.quantity;
            return { totalAmount: amount, totalItems: items };
          }

          return acc;
        },
        { totalAmount: 0, totalItems: 0 },
      );

      // Crear order y asociar orderItems en una transacción
      const orderWithItems = await this.drizzle.db.transaction(async (tx) => {
        const order = (
          await tx
            .insert(this.drizzle.schema.order)
            .values({
              totalAmount,
              totalItems,
            })
            .returning()
        )[0];

        const ordersToInsert = createOrderDto.items
          .filter((orderItem) =>
            products.some((product) => product.id === orderItem.productId),
          )
          .map((orderItem) => {
            const product = products.find(
              (product) => product.id === orderItem.productId,
            );

            return {
              productId: product.id as number,
              quantity: orderItem.quantity,
              price: product.price as number,
              orderId: order.id,
            };
          });

        const orderItems = await tx
          .insert(this.drizzle.schema.orderItem)
          .values(ordersToInsert)
          .returning();

        return {
          ...order,
          orderItems: orderItems.map((orderItem) => ({
            ...orderItem,
            productName: products.find(
              (product) => product.id === orderItem.productId,
            ).title,
          })),
        };
      });

      return orderWithItems;
    } catch (error: any) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const { limit, page, status } = orderPaginationDto;
    const totalOrders = await this.getTotalOrders(status);
    const lastPage = Math.ceil(totalOrders / limit);

    const metadata: IMetadata = {
      total: totalOrders,
      page,
      lastPage,
    };

    const data: OrderEntity[] = await this.drizzle.db
      .select()
      .from(this.drizzle.schema.order)
      .where(status ? eq(this.drizzle.schema.order.status, status) : undefined)
      .limit(limit)
      .offset((page - 1) * limit);

    return {
      data,
      metadata,
    };
  }

  async findOne(id: number) {
    const result = await this.drizzle.db
      .select()
      .from(this.drizzle.schema.order)
      .where(eq(this.drizzle.schema.order.id, id));

    if (result.length === 0) {
      throw new RpcException({
        message: `Order #${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const order = result[0];

    const orderItems = await this.drizzle.db
      .select()
      .from(this.drizzle.schema.orderItem)
      .where(eq(this.drizzle.schema.orderItem.orderId, id));

    const validateProducts = orderItems.map((orderItem) => ({
      id: orderItem.productId,
      quantity: orderItem.quantity,
    }));

    const products = await this.validateProductsExistence(validateProducts);

    return {
      ...order,
      orderItems: orderItems.map((orderItem) => ({
        ...orderItem,
        productName: products.find(
          (product) => product.id === orderItem.productId,
        ).title as string,
      })),
    };
  }

  async updateOneOrder(id: number, updateOrderDto: UpdateOrderDto) {
    const result = await this.drizzle.db
      .update(this.drizzle.schema.order)
      .set(updateOrderDto)
      .where(eq(this.drizzle.schema.order.id, id))
      .returning();

    if (result.length === 0) {
      throw new RpcException({
        message: `Order #${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return result[0];
  }

  async updateStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;

    const result = await this.drizzle.db
      .select()
      .from(this.drizzle.schema.order)
      .where(eq(this.drizzle.schema.order.id, id));

    if (result.length === 0) {
      throw new RpcException({
        message: `Order #${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    if (result[0].status === status) {
      return result[0];
    }

    const updateResult = await this.drizzle.db
      .update(this.drizzle.schema.order)
      .set({ status })
      .where(eq(this.drizzle.schema.order.id, id))
      .returning();

    return updateResult[0];
  }

  async getTotalOrders(status?: Status) {
    return (
      await this.drizzle.db
        .select({ count: count() })
        .from(this.drizzle.schema.order)
        .where(
          status ? eq(this.drizzle.schema.order.status, status) : undefined,
        )
    )[0].count;
  }

  async validateProductsExistence(
    validateProducts: { id: number; quantity: number }[],
  ) {
    try {
      const products: any[] = await firstValueFrom(
        this.client.send(
          { cmd: 'validate_products_existence' },
          validateProducts,
        ),
      );

      return products;
    } catch (error: any) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async validateProductsExistenceAndStock(
    validateProducts: { id: number; quantity: number }[],
  ) {
    try {
      const products: any[] = await firstValueFrom(
        this.client.send(
          { cmd: 'validate_products_existence_and_stock' },
          validateProducts,
        ),
      );

      return products;
    } catch (error: any) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async createPaymentSession(order: OrderWithProducts) {
    const paymentSession = await firstValueFrom(
      this.client.send('create.payment.session', {
        orderId: order.id,
        currency: 'usd',
        items: order.orderItems.map((orderItem) => ({
          name: orderItem.productName,
          price: orderItem.price,
          quantity: orderItem.quantity,
        })),
      }),
    );

    return paymentSession;
  }

  async markOrderAsPaid(paidOrderDto: PaidOrderDto) {
    this.logger.log('Marking order as paid...');
    this.logger.log(paidOrderDto);

    try {
      await this.drizzle.db.transaction(async (tx) => {
        await tx.insert(this.drizzle.schema.orderReceipt).values({
          orderId: paidOrderDto.orderId,
          receiptUrl: paidOrderDto.receiptUrl,
        });

        await this.updateOneOrder(paidOrderDto.orderId, {
          stripeChargeId: paidOrderDto.stripePaymentId,
          status: STATUS_ENUM.PAID,
          paid: true,
          paidAt: new Date(),
        });
      });
    } catch (error: any) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
