import { getRepository, Repository, Like, Between } from 'typeorm';

import { startOfDay, endOfDay } from 'date-fns';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';

import AppError from '@shared/errors/AppError';
import Order from '../entities/Order';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async find(page = 1, product?: string): Promise<Order[]> {
    if (product) {
      const orders = await this.ormRepository.find({
        where: {
          product: Like(`%${product}%`),
        },
        skip: (page - 1) * 10,
        take: 10,
      });

      return orders;
    }

    const orders = await this.ormRepository.find({
      skip: (page - 1) * 10,
      take: 10,
    });

    return orders;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ormRepository.findOne(id);

    return order;
  }

  public async findByCourierId(
    page: number,
    end_date: boolean,
    courier_id: string,
  ): Promise<Order[] | undefined> {
    if (end_date) {
      const orders = await this.ormRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.courier', 'courier')
        .leftJoinAndSelect('order.recipient', 'recipient')
        .where('courier.id = :id', { id: courier_id })
        .skip((page - 1) * 10)
        .take(10)
        .getMany();

      const ordersWithEnddate = orders.filter(order => order.end_date);

      return ordersWithEnddate;
    }

    const orders = await this.ormRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.courier', 'courier')
      .leftJoinAndSelect('order.recipient', 'recipient')
      .where('courier.id = :id', { id: courier_id })
      .skip((page - 1) * 10)
      .take(10)
      .getMany();

    return orders;
  }

  public async findByRecipientId(
    recipient_id: string,
  ): Promise<Order[] | undefined> {
    const orders = await this.ormRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.recipient', 'recipient')
      .where('recipient.id = :id', { id: recipient_id })
      .getMany();

    return orders;
  }

  public async findOrdersOpen(today: Date): Promise<number> {
    const orders = await this.ormRepository.findAndCount({
      where: {
        start_date: Between(startOfDay(today), endOfDay(today)),
      },
    });

    return orders[1];
  }

  public async create(orderData: ICreateOrderDTO): Promise<Order> {
    const order = this.ormRepository.create(orderData);

    await this.ormRepository.save(order);

    return order;
  }

  public async save(order: Order): Promise<Order> {
    return this.ormRepository.save(order);
  }

  public async delete(id: string): Promise<void | undefined> {
    const order = await this.ormRepository.findOne(id);

    if (!order) throw new AppError('Order not found.');

    await this.ormRepository.delete(id);
  }
}

export default OrdersRepository;
