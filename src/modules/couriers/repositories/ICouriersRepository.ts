import Courier from '../infra/typeorm/entities/Courier';
import ICreateCourierDTO from '../dtos/ICreateCourierDTO';

export default interface ICouriersRepository {
  find(page: number, name?: string): Promise<Courier[]>;
  findById(id: string): Promise<Courier | undefined>;
  findByName(name: string): Promise<Courier | undefined>;
  findByEmail(email: string): Promise<Courier | undefined>;
  create(data: ICreateCourierDTO): Promise<Courier>;
  save(courier: Courier): Promise<Courier>;
  delete(id: string): Promise<void | undefined>;
}
