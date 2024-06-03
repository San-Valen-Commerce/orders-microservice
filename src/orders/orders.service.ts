import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { IMetadata } from 'src/common';
import { count, eq } from 'drizzle-orm';
import { Orderentity } from './entities/order.entity';
import { RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusDto, OrderPaginationDto } from './dto';
import { Status } from 'src/drizzle/schema/order';

@Injectable()
export class OrdersService {
  constructor(private drizzle: DrizzleService) {}

  async create(createOrderDto: CreateOrderDto) {
    const result = await this.drizzle.db
      .insert(this.drizzle.schema.order)
      .values(createOrderDto)
      .returning();

    if (result.length) {
      return result[0];
    }

    return result;
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

    const data: Orderentity[] = await this.drizzle.db
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
}
