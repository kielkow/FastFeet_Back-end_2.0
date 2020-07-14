import { uuid } from 'uuidv4';

import IOrdersProblemsRepository from '@modules/orders_problems/repositories/IOrdersProblemsRepository';

import ICreateOrderProblemDTO from '@modules/orders_problems/dtos/ICreateOrderProblemDTO';

import OrderProblem from '../../infra/typeorm/entities/OrderProblem';

class FakeOrdersProblemsRepository implements IOrdersProblemsRepository {
  private orders_problems: OrderProblem[] = [];

  public async find(page = 1): Promise<OrderProblem[]> {
    const skip = (page - 1) * 10;
    const take = skip + 10;

    const findOrdersProblems = this.orders_problems.slice(skip, take);

    return findOrdersProblems;
  }

  public async findById(id: string): Promise<OrderProblem | undefined> {
    const findOrderProblem = this.orders_problems.find(
      order_problem => order_problem.id === id,
    );

    return findOrderProblem;
  }

  public async findByOrderId(
    order_id: string,
    page: number,
  ): Promise<OrderProblem[] | undefined> {
    const skip = (page - 1) * 10;
    const take = skip + 10;

    const findOrdersProblemsByOrder = this.orders_problems
      .filter(order_problem => order_problem.order.id === order_id)
      .slice(skip, take);

    return findOrdersProblemsByOrder;
  }

  public async create(
    orderProblemData: ICreateOrderProblemDTO,
  ): Promise<OrderProblem> {
    const order = new OrderProblem();

    Object.assign(order, { id: uuid() }, orderProblemData);

    this.orders_problems.push(order);

    return order;
  }

  public async save(order_problem: OrderProblem): Promise<OrderProblem> {
    const findIndex = this.orders_problems.findIndex(
      findOrderProblem => findOrderProblem.id === order_problem.id,
    );

    this.orders_problems[findIndex] = order_problem;

    return order_problem;
  }
}

export default FakeOrdersProblemsRepository;
