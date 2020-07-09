import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import Order from '../infra/typeorm/entities/Order';

interface IRequest {
  recipient_id: string;
  courier_id: string;
  product: string;
  start_date: Date;
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    recipient_id,
    courier_id,
    product,
    start_date,
  }: IRequest): Promise<Order> {
    const checkCourierexists = await this.ordersRepository.findByCourierId(
      courier_id,
    );
    if (!checkCourierexists) throw new AppError('Courier not found.');

    const checkRecipientexists = await this.ordersRepository.findByCourierId(
      recipient_id,
    );
    if (!checkRecipientexists) throw new AppError('Recipient not found.');

    const order = await this.ordersRepository.create({
      recipient_id,
      courier_id,
      product,
      start_date,
    });

    await this.cacheProvider.invalidatePrefix('orders-list');

    return order;
  }
}

export default CreateOrderService;
