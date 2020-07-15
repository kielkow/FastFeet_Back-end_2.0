import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IOrdersRepository from '../repositories/IOrdersRepository';

import Order from '../infra/typeorm/entities/Order';

interface IRequest {
  page: number;
  end_date: boolean;
  courier_id: string;
}

@injectable()
class ListOrdersByCouierService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    page = 1,
    end_date = false,
    courier_id,
  }: IRequest): Promise<Order[] | undefined> {
    const orders = await this.ordersRepository.findByCourierId(
      page,
      end_date,
      courier_id,
    );

    return orders;
  }
}

export default ListOrdersByCouierService;
