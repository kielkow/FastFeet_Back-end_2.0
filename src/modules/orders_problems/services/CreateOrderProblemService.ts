import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IOrdersProblemsRepository from '@modules/orders_problems/repositories/IOrdersProblemsRepository';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import OrderProblem from '../infra/typeorm/entities/OrderProblem';

interface IRequest {
  order_id: string;
  description: string;
}

@injectable()
class CreateOrderProblemService {
  constructor(
    @inject('OrdersProblemsRepository')
    private ordersProblemsRepository: IOrdersProblemsRepository,

    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    order_id,
    description,
  }: IRequest): Promise<OrderProblem> {
    const order = await this.ordersRepository.findById(order_id);
    if (!order) throw new AppError('Order not found.');

    const order_problem = await this.ordersProblemsRepository.create({
      order,
      description,
    });

    await this.cacheProvider.invalidatePrefix('orders_problems-list');
    await this.cacheProvider.invalidatePrefix(`order_problem-${order.id}-show`);

    return order_problem;
  }
}

export default CreateOrderProblemService;
