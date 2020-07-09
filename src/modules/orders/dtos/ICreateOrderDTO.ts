import Recipient from '@modules/recipients/infra/typeorm/entities/Recipient';
import Courier from '@modules/couriers/infra/typeorm/entities/Courier';

export default interface ICreateOrderDTO {
  recipient: Recipient;
  courier: Courier;
  product: string;
  start_date: Date;
}
