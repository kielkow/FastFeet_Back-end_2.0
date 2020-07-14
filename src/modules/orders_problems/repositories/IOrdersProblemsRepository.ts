import OrderProblem from '../infra/typeorm/entities/OrderProblem';
import ICreateOrderProblemDTO from '../dtos/ICreateOrderProblemDTO';

export default interface IOrderProblemsRepository {
  find(page: number, product?: string): Promise<OrderProblem[]>;
  findById(id: string): Promise<OrderProblem | undefined>;
  findByOrderId(
    order_id: string,
    page: number,
  ): Promise<OrderProblem[] | undefined>;
  create(data: ICreateOrderProblemDTO): Promise<OrderProblem>;
  save(order: OrderProblem): Promise<OrderProblem>;
}
