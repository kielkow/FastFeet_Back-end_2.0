import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IOrdersProblemsRepository from '../repositories/IOrdersProblemsRepository';

import OrderProblem from '../infra/typeorm/entities/OrderProblem';

interface IRequest {
  page: number;
}

@injectable()
class ListOrdersProblemsService {
  constructor(
    @inject('OrdersProblemsRepository')
    private ordersProblemsRepository: IOrdersProblemsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ page = 1 }: IRequest): Promise<OrderProblem[]> {
    const cacheKey = 'orders_problems-list';

    let orders_problems = await this.cacheProvider.recover<OrderProblem[]>(
      cacheKey,
    );

    if (!orders_problems) {
      orders_problems = await this.ordersProblemsRepository.find(page);

      if (!orders_problems) {
        throw new AppError('Orders problems not found.');
      }
    }

    return orders_problems;
  }
}

export default ListOrdersProblemsService;
