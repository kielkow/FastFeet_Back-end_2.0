import Order from '@modules/orders/infra/typeorm/entities/Order';

export default interface ICreateOrderDTO {
  order: Order;
  description: string;
}
