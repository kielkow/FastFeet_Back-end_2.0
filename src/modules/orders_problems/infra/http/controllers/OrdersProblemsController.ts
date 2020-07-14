import { Request, Response } from 'express';

import { container } from 'tsyringe';

import { classToClass } from 'class-transformer';

import CreateOrderProblemService from '@modules/orders_problems/services/CreateOrderProblemService';
import ListOrdersProblemsService from '@modules/orders_problems/services/ListOrdersProblemsService';
import ShowOrderProblemService from '@modules/orders_problems/services/ShowOrderProblemService';

export default class OrdersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const page = request.query.page ? Number(request.query.page) : 1;

    const listOrdersProblems = container.resolve(ListOrdersProblemsService);

    const orders = await listOrdersProblems.execute({ page });

    return response.json(classToClass(orders));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const order_problem_id = request.params.id;

    const showOrderProblemService = container.resolve(ShowOrderProblemService);

    const order = await showOrderProblemService.execute({
      order_problem_id,
    });

    return response.json(classToClass(order));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { order_id, description } = request.body;

    const createOrderProblem = container.resolve(CreateOrderProblemService);

    const order = await createOrderProblem.execute({
      order_id,
      description,
    });

    return response.json(classToClass(order));
  }
}
