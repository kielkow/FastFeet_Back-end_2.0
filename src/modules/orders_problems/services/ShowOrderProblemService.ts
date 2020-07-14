import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IOrdersProblemsRepository from '../repositories/IOrdersProblemsRepository';

import OrderProblem from '../infra/typeorm/entities/OrderProblem';

interface IRequest {
  order_problem_id: string;
}

@injectable()
class ShowOrderProblemService {
  constructor(
    @inject('OrdersProblemsRepository')
    private ordersProblemsRepository: IOrdersProblemsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ order_problem_id }: IRequest): Promise<OrderProblem> {
    const cacheKey = `order_problem-${order_problem_id}-show`;

    const order_problem_cached = await this.cacheProvider.recover<OrderProblem>(
      cacheKey,
    );

    if (!order_problem_cached) {
      const order_problem = await this.ordersProblemsRepository.findById(
        order_problem_id,
      );

      if (!order_problem) {
        throw new AppError('Order problem not found.');
      }

      return order_problem;
    }

    return order_problem_cached;
  }
}

export default ShowOrderProblemService;
