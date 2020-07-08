import Order from '../infra/typeorm/entities/Order';
import ICreateOrderDTO from '../dtos/ICreateOrderDTO';

export default interface IOrdersRepository {
  find(page: number, product?: string): Promise<Order[]>;
  findById(id: string): Promise<Order | undefined>;
  findByCourierId(name: string): Promise<Order | undefined>;
  findByRecipientId(cep: string): Promise<Order | undefined>;
  create(data: ICreateOrderDTO): Promise<Order>;
  save(order: Order): Promise<Order>;
  delete(id: string): Promise<void | undefined>;
}
