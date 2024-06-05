import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { NatsModule } from 'src/transports/nats/nats.module';

@Module({
  imports: [DrizzleModule, NatsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
