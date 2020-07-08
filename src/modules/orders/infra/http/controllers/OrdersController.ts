import { Request, Response } from 'express';

import { container } from 'tsyringe';

import { classToClass } from 'class-transformer';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import UpdateOrderService from '@modules/orders/services/UpdateOrderService';
import ShowOrderService from '@modules/orders/services/ShowOrderService';
import DeleteOrderService from '@modules/orders/services/DeleteOrderService';
import ListOrdersService from '@modules/orders/services/ListOrdersService';

export default class OrdersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const page = request.query.page ? Number(request.query.page) : 1;
    const product = request.query.product
      ? String(request.query.product)
      : undefined;

    const listOrdersService = container.resolve(ListOrdersService);

    const orders = await listOrdersService.execute({
      page,
      product,
    });

    return response.json(classToClass(orders));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const order_id = request.params.id;

    const showOrderService = container.resolve(ShowOrderService);

    const order = await showOrderService.execute({
      order_id,
    });

    return response.json(classToClass(order));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { recipient_id, courier_id, product, start_date } = request.body;

    const createOrder = container.resolve(CreateOrderService);

    const order = await createOrder.execute({
      recipient_id,
      courier_id,
      product,
      start_date,
    });

    return response.json(classToClass(order));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const order_id = request.params.id;
    const { recipient_id, courier_id, product, start_date } = request.body;

    const updateOrder = container.resolve(UpdateOrderService);

    const order = await updateOrder.execute({
      order_id,
      recipient_id,
      courier_id,
      product,
      start_date,
    });

    return response.json(classToClass(order));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const order_id = request.params.id;

    const deleteOrderService = container.resolve(DeleteOrderService);

    await deleteOrderService.execute({ order_id });

    return response.status(204).json({});
  }
}
