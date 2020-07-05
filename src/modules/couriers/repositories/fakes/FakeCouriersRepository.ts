import { uuid } from 'uuidv4';

import ICouriersRepository from '@modules/couriers/repositories/ICouriersRepository';

import ICreateCourierDTO from '@modules/couriers/dtos/ICreateCourierDTO';

import AppError from '@shared/errors/AppError';

import Courier from '../../infra/typeorm/entities/Courier';

class FakeCouriersRepository implements ICouriersRepository {
  private couriers: Courier[] = [];

  public async find(page = 1, name?: string): Promise<Courier[]> {
    if (name) {
      this.couriers = this.couriers.filter(courier =>
        courier.name.includes(name),
      );

      const skip = (page - 1) * 10;
      const take = skip + 10;

      const findCouriers = this.couriers.slice(skip, take);

      return findCouriers;
    }

    const skip = (page - 1) * 10;
    const take = skip + 10;

    const findCouriers = this.couriers.slice(skip, take);

    return findCouriers;
  }

  public async findById(id: string): Promise<Courier | undefined> {
    const findCourier = this.couriers.find(courier => courier.id === id);

    return findCourier;
  }

  public async findByName(name: string): Promise<Courier | undefined> {
    const findCourier = this.couriers.find(courier => courier.name === name);

    if (!findCourier) {
      throw new AppError('Courier with this name not found.');
    }

    return findCourier;
  }

  public async findByEmail(email: string): Promise<Courier | undefined> {
    const findCourier = this.couriers.find(courier => courier.email === email);

    return findCourier;
  }

  public async create(courierData: ICreateCourierDTO): Promise<Courier> {
    const courier = new Courier();

    Object.assign(courier, { id: uuid() }, courierData);

    this.couriers.push(courier);

    return courier;
  }

  public async save(courier: Courier): Promise<Courier> {
    const findIndex = this.couriers.findIndex(
      findCourier => findCourier.id === courier.id,
    );

    this.couriers[findIndex] = courier;

    return courier;
  }

  public async delete(id: string): Promise<void | undefined> {
    const findCourier = this.couriers.find(courier => courier.id === id);

    if (!findCourier) throw new AppError('Courier not found');

    const couriersNotDeleted = this.couriers.filter(
      courier => courier.id !== id,
    );

    this.couriers = couriersNotDeleted;
  }
}

export default FakeCouriersRepository;
