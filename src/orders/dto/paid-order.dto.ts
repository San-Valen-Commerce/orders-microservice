import { IsInt, IsString, IsUrl } from 'class-validator';

export class PaidOrderDto {
  @IsString()
  stripePaymentId!: string;

  @IsInt()
  orderId!: number;

  @IsString()
  @IsUrl()
  receiptUrl!: string;
}
