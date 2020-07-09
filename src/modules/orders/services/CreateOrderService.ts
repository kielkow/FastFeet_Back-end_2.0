import { injectable, inject } from 'tsyringe';

import { startOfHour, getHours } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICouriersRepository from '@modules/couriers/repositories/ICouriersRepository';
import IRecipientsRepository from '@modules/recipients/repositories/IRecipientsRepository';

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

    @inject('CouriersRepository')
    private couriersRepository: ICouriersRepository,

    @inject('RecipientsRepository')
    private recipientsRepository: IRecipientsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    recipient_id,
    courier_id,
    product,
    start_date,
  }: IRequest): Promise<Order> {
    const courier = await this.couriersRepository.findById(courier_id);
    if (!courier) throw new AppError('Courier not found.');

    const recipient = await this.recipientsRepository.findById(recipient_id);
    if (!recipient) throw new AppError('Recipient not found.');

    const hourStart = getHours(startOfHour(start_date));

    if (hourStart < 8 || hourStart >= 18) {
      throw new AppError('Date not permitted');
    }

    const similiarOrders = await this.ordersRepository.findOrdersOpen(
      start_date,
    );

    if (similiarOrders >= 5) {
      throw new AppError('Not possible open more than 5 orders p/ day');
    }

    const order = await this.ordersRepository.create({
      recipient,
      courier,
      product,
      start_date,
    });

    await this.cacheProvider.invalidatePrefix('orders-list');

    return order;
  }
}

export default CreateOrderService;
