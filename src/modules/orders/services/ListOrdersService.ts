import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IOrdersRepository from '../repositories/IOrdersRepository';

import Order from '../infra/typeorm/entities/Order';

interface IRequest {
  page: number;
  product?: string;
}

@injectable()
class ListOrdersService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ page = 1, product }: IRequest): Promise<Order[]> {
    const cacheKey = 'orders-list';

    let orders = await this.cacheProvider.recover<Order[]>(cacheKey);

    if (!orders) {
      orders = await this.ordersRepository.find(page, product);

      if (!orders) {
        throw new AppError('Orders not found.');
      }
    }

    return orders;
  }
}

export default ListOrdersService;
