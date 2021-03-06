import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICouriersRepository from '@modules/couriers/repositories/ICouriersRepository';
import IRecipientsRepository from '@modules/recipients/repositories/IRecipientsRepository';

import Order from '../infra/typeorm/entities/Order';

interface IRequest {
  order_id: string;
}

@injectable()
class DeliveryOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('CouriersRepository')
    private couriersRepository: ICouriersRepository,

    @inject('RecipientsRepository')
    private recipientsRepository: IRecipientsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ order_id }: IRequest): Promise<Order> {
    const order = await this.ordersRepository.findById(order_id);
    if (!order) throw new AppError('Order not found.');

    order.end_date = new Date();
    order.status = 'delivered';

    await this.cacheProvider.invalidatePrefix(`order-${order.id}-show`);

    return this.ordersRepository.save(order);
  }
}

export default DeliveryOrderService;
