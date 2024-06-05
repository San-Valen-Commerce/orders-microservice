import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { envs, NATS_SERVICE } from 'src/config';

export const natsProvider = {
  provide: NATS_SERVICE,
  useFactory: () =>
    ClientProxyFactory.create({
      transport: Transport.NATS,
      options: {
        servers: envs.NATS_SERVERS,
      },
    }),
};
