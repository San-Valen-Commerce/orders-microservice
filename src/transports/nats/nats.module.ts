import { Module } from '@nestjs/common';
import { natsProvider } from './nats.provider';

@Module({
  providers: [natsProvider],
  exports: [natsProvider],
})
export class NatsModule {}
