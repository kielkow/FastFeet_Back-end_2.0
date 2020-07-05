import { getRepository, Repository, Like } from 'typeorm';

import ICouriersRepository from '@modules/couriers/repositories/ICouriersRepository';
import ICreateCourierDTO from '@modules/couriers/dtos/ICreateCourierDTO';

import AppError from '@shared/errors/AppError';
import Courier from '../entities/Courier';

class CouriersRepository implements ICouriersRepository {
  private ormRepository: Repository<Courier>;

  constructor() {
    this.ormRepository = getRepository(Courier);
  }

  public async find(page = 1, name?: string): Promise<Courier[]> {
    if (name) {
      const couriers = await this.ormRepository.find({
        where: {
          name: Like(`%${name}%`),
        },
        skip: (page - 1) * 10,
        take: 10,
      });

      return couriers;
    }

    const couriers = await this.ormRepository.find({
      skip: (page - 1) * 10,
      take: 10,
    });

    return couriers;
  }

  public async findById(id: string): Promise<Courier | undefined> {
    const courier = await this.ormRepository.findOne(id);

    return courier;
  }

  public async findByName(name: string): Promise<Courier | undefined> {
    const courier = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return courier;
  }

  public async findByEmail(email: string): Promise<Courier | undefined> {
    const courier = await this.ormRepository.findOne({
      where: {
        email,
      },
    });

    return courier;
  }

  public async create(courierData: ICreateCourierDTO): Promise<Courier> {
    const courier = this.ormRepository.create(courierData);

    await this.ormRepository.save(courier);

    return courier;
  }

  public async save(courier: Courier): Promise<Courier> {
    return this.ormRepository.save(courier);
  }

  public async delete(id: string): Promise<void | undefined> {
    const courier = await this.ormRepository.findOne(id);

    if (!courier) throw new AppError('Courier not found.');

    await this.ormRepository.delete(id);
  }
}

export default CouriersRepository;
