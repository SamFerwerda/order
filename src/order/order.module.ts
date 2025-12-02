import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { ConsumerController } from './consumer.controller';
import { ProviderController } from './provider.controller';

@Module({
  controllers: [ConsumerController, ProviderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
