import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Render,
  Res,
  Req,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { OrderService } from './order.service';

@Controller('provider')
export class ProviderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Render('provider')
  createSession(@Req() req: Request) {
    const uuid = this.orderService.createSession();
    const protocol = req.protocol;
    const host = req.get('host');
    const consumerLink = `${protocol}://${host}/view/${uuid}`;

    return {
      uuid,
      consumerLink,
      orders: [],
      hasOrders: false,
    };
  }

  @Get(':uuid')
  @Render('provider')
  getSession(@Param('uuid') uuid: string, @Req() req: Request) {
    const exists = this.orderService.sessionExists(uuid);
    const orders = this.orderService.getOrders(uuid);
    const protocol = req.protocol;
    const host = req.get('host');
    const consumerLink = `${protocol}://${host}/view/${uuid}`;

    return {
      uuid,
      consumerLink,
      orders,
      hasOrders: orders.length > 0,
      exists,
    };
  }

  @Post(':uuid/orders')
  addOrder(
    @Param('uuid') uuid: string,
    @Body('description') description: string,
    @Res() res: Response,
  ) {
    this.orderService.addOrder(uuid, description);
    res.redirect(`/provider/${uuid}`);
  }

  @Post(':uuid/orders/:orderId/complete')
  completeOrder(
    @Param('uuid') uuid: string,
    @Param('orderId') orderId: string,
    @Res() res: Response,
  ) {
    this.orderService.completeOrder(uuid, orderId);
    res.redirect(`/provider/${uuid}`);
  }
}
