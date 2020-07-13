import { Request, Response } from 'express';

import { container } from 'tsyringe';

import { classToClass } from 'class-transformer';

import DeliveryOrderService from '@modules/orders/services/DeliveryOrderService';

export default class OrdersStatusController {
  public async update(request: Request, response: Response): Promise<Response> {
    const order_id = request.params.id;

    const deliveryOrder = container.resolve(DeliveryOrderService);

    const order = await deliveryOrder.execute({
      order_id,
    });

    return response.json(classToClass(order));
  }
}
