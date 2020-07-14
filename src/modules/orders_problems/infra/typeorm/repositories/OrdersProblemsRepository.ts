import { getRepository, Repository } from 'typeorm';

import IOrderProblemsRepository from '@modules/orders_problems/repositories/IOrdersProblemsRepository';
import ICreateOrderProblemDTO from '@modules/orders_problems/dtos/ICreateOrderProblemDTO';

import OrderProblem from '../entities/OrderProblem';

class OrdersProblemsRepository implements IOrderProblemsRepository {
  private ormRepository: Repository<OrderProblem>;

  constructor() {
    this.ormRepository = getRepository(OrderProblem);
  }

  public async find(page = 1): Promise<OrderProblem[]> {
    const orders_problems = await this.ormRepository.find({
      skip: (page - 1) * 10,
      take: 10,
    });

    return orders_problems;
  }

  public async findById(id: string): Promise<OrderProblem | undefined> {
    const order_problem = await this.ormRepository.findOne(id);

    return order_problem;
  }

  public async findByOrderId(
    order_id: string,
    page: number,
  ): Promise<OrderProblem[] | undefined> {
    const orders_problems = await this.ormRepository
      .createQueryBuilder('order_problem')
      .leftJoinAndSelect('order_problem.order', 'order')
      .where('order.id = :id', { id: order_id })
      .skip((page - 1) * 10)
      .take(10)
      .getMany();

    return orders_problems;
  }

  public async create(
    orderProblemData: ICreateOrderProblemDTO,
  ): Promise<OrderProblem> {
    const order_problem = this.ormRepository.create(orderProblemData);

    await this.ormRepository.save(order_problem);

    return order_problem;
  }

  public async save(order_problem: OrderProblem): Promise<OrderProblem> {
    return this.ormRepository.save(order_problem);
  }
}

export default OrdersProblemsRepository;
