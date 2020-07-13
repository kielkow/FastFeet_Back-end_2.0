import { Request, Response } from 'express';

import { container } from 'tsyringe';

import { classToClass } from 'class-transformer';

import ListOrdersByCourierService from '@modules/orders/services/ListOrdersByCourierService';

export default class OrdersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const page = request.query.page ? Number(request.query.page) : 1;
    const courier_id = request.params.id;

    const listOrdersByCourierService = container.resolve(
      ListOrdersByCourierService,
    );

    const orders = await listOrdersByCourierService.execute({
      page,
      courier_id,
    });

    return response.json(classToClass(orders));
  }
}
