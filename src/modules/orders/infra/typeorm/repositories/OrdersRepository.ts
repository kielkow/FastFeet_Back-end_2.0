import { getRepository, Repository, Like } from 'typeorm';

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

  public async findByCourierId(courier_id: string): Promise<Order | undefined> {
    const order = await this.ormRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.courier', 'courier')
      .where('courier.id = :id', { id: courier_id })
      .getOne();

    return order;
  }

  public async findByRecipientId(
    recipient_id: string,
  ): Promise<Order | undefined> {
    const recipient = await this.ormRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.recipient', 'recipient')
      .where('recipient.id = :id', { id: recipient_id })
      .getOne();

    return recipient;
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
