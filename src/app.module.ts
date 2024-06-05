import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { NatsModule } from './transports/nats/nats.module';

@Module({
  imports: [OrdersModule, DrizzleModule, NatsModule],
})
export class AppModule {}
