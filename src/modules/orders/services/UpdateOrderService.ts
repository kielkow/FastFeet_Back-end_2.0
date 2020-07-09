import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICouriersRepository from '@modules/couriers/repositories/ICouriersRepository';
import IRecipientsRepository from '@modules/recipients/repositories/IRecipientsRepository';

import Order from '../infra/typeorm/entities/Order';

interface IRequest {
  order_id: string;
  recipient_id: string;
  courier_id: string;
  product: string;
  start_date: Date;
}

@injectable()
class UpdateOrderService {
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

  public async execute({
    order_id,
    recipient_id,
    courier_id,
    product,
    start_date,
  }: IRequest): Promise<Order> {
    const order = await this.ordersRepository.findById(order_id);
    if (!order) throw new AppError('Order not found.');

    const courier = await this.couriersRepository.findById(courier_id);
    if (!courier) throw new AppError('Courier not found.');

    const recipient = await this.recipientsRepository.findById(recipient_id);
    if (!recipient) throw new AppError('Recipient not found.');

    order.recipient = recipient;
    order.courier = courier;
    order.product = product;
    order.start_date = start_date;

    await this.cacheProvider.invalidatePrefix(`order-${order.id}-show`);

    return this.ordersRepository.save(order);
  }
}

export default UpdateOrderService;
