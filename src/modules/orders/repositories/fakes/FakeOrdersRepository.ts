import { uuid } from 'uuidv4';

import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';

import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';

import AppError from '@shared/errors/AppError';

import Order from '../../infra/typeorm/entities/Order';

class FakeOrdersRepository implements IOrdersRepository {
  private orders: Order[] = [];

  public async find(page = 1, product?: string): Promise<Order[]> {
    if (product) {
      this.orders = this.orders.filter(order =>
        order.product.includes(product),
      );

      const skip = (page - 1) * 10;
      const take = skip + 10;

      const findOrders = this.orders.slice(skip, take);

      return findOrders;
    }

    const skip = (page - 1) * 10;
    const take = skip + 10;

    const findOrders = this.orders.slice(skip, take);

    return findOrders;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const findOrder = this.orders.find(order => order.id === id);

    return findOrder;
  }

  public async findByCourierId(
    page: number,
    end_date: boolean,
    courier_id: string,
  ): Promise<Order[] | undefined> {
    if (end_date) {
      const skip = (page - 1) * 10;
      const take = skip + 10;

      const findOrdersByCourier = this.orders
        .filter(order => order.courier.id === courier_id && order.end_date)
        .slice(skip, take);

      return findOrdersByCourier;
    }

    const skip = (page - 1) * 10;
    const take = skip + 10;

    const findOrdersByCourier = this.orders
      .filter(order => order.courier.id === courier_id)
      .slice(skip, take);

    return findOrdersByCourier;
  }

  public async findByRecipientId(
    recipient_id: string,
  ): Promise<Order[] | undefined> {
    const findOrder = this.orders.filter(
      order => order.recipient.id === recipient_id,
    );

    return findOrder;
  }

  public async findOrdersOpen(today: Date): Promise<number> {
    const orders = this.orders.filter(() =>
      isWithinInterval(today, {
        start: startOfDay(today),
        end: endOfDay(today),
      }),
    );

    return orders.length;
  }

  public async create(orderData: ICreateOrderDTO): Promise<Order> {
    const order = new Order();

    Object.assign(order, { id: uuid() }, orderData);

    this.orders.push(order);

    return order;
  }

  public async save(order: Order): Promise<Order> {
    const findIndex = this.orders.findIndex(
      findOrder => findOrder.id === order.id,
    );

    this.orders[findIndex] = order;

    return order;
  }

  public async delete(id: string): Promise<void | undefined> {
    const findOrder = this.orders.find(order => order.id === id);

    if (!findOrder) throw new AppError('Order not found');

    const ordersNotDeleted = this.orders.filter(order => order.id !== id);

    this.orders = ordersNotDeleted;
  }
}

export default FakeOrdersRepository;
