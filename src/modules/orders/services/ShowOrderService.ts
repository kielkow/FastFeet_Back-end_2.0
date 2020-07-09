import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import AppError from '@shared/errors/AppError';
import IOrdersRepository from '../repositories/IOrdersRepository';

import Order from '../infra/typeorm/entities/Order';

interface IRequest {
  order_id: string;
}

@injectable()
class ShowOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ order_id }: IRequest): Promise<Order> {
    const cacheKey = `order-${order_id}-show`;

    const orderCached = await this.cacheProvider.recover<Order>(cacheKey);

    if (!orderCached) {
      const order = await this.ordersRepository.findById(order_id);

      if (!order) {
        throw new AppError('Orders not found.');
      }

      return order;
    }

    return orderCached;
  }
}

export default ShowOrderService;
