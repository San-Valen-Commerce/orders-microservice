import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { DrizzleModule } from './drizzle/drizzle.module';

@Module({
  imports: [OrdersModule, DrizzleModule],
})
export class AppModule {}
