import Recipient from '../infra/typeorm/entities/Recipient';
import ICreateRecipientDTO from '../dtos/ICreateRecipientDTO';

export default interface IRecipientsRepository {
  find(page: number, name?: string): Promise<Recipient[]>;
  findById(id: string): Promise<Recipient | undefined>;
  findByName(name: string): Promise<Recipient | undefined>;
  findByCep(cep: string): Promise<Recipient | undefined>;
  create(data: ICreateRecipientDTO): Promise<Recipient>;
  save(recipient: Recipient): Promise<Recipient>;
  delete(id: string): Promise<void | undefined>;
}
