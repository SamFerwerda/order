import { Controller, Get, Param, Render } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('view')
export class ConsumerController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':uuid')
  @Render('consumer')
  getOrders(@Param('uuid') uuid: string) {
    const orders = this.orderService.getOrders(uuid);
    const exists = this.orderService.sessionExists(uuid);

    return {
      uuid,
      orders,
      exists,
      hasOrders: orders.length > 0,
    };
  }

  @Get(':uuid/api/orders')
  getOrdersJson(@Param('uuid') uuid: string) {
    const orders = this.orderService.getOrders(uuid);
    const exists = this.orderService.sessionExists(uuid);

    return {
      orders,
      exists,
      hasOrders: orders.length > 0,
    };
  }
}
