import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IOrdersRepository from '../repositories/IOrdersRepository';

interface IRequest {
  order_id: string;
}

@injectable()
class DeleteOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ order_id }: IRequest): Promise<void | undefined> {
    await this.ordersRepository.delete(order_id);

    await this.cacheProvider.invalidatePrefix('orders-list');
  }
}

export default DeleteOrderService;
