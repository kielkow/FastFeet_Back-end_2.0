import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import ICouriersRepository from '../repositories/ICouriersRepository';

import Courier from '../infra/typeorm/entities/Courier';

interface IRequest {
  courier_id: string;
  name: string;
  email: string;
}

@injectable()
class UpdateCourierService {
  constructor(
    @inject('CouriersRepository')
    private couriersRepository: ICouriersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    courier_id,
    name,
    email,
  }: IRequest): Promise<Courier> {
    const courier = await this.couriersRepository.findById(courier_id);

    if (!courier) {
      throw new AppError('Courier not found.');
    }

    const courierWithUpdatedEmail = await this.couriersRepository.findByEmail(
      email,
    );

    if (courierWithUpdatedEmail && courierWithUpdatedEmail.id !== courier_id) {
      throw new AppError('This title is already used.');
    }

    courier.name = name;
    courier.email = email;

    await this.cacheProvider.invalidatePrefix(`courier-${courier.id}-show`);

    return this.couriersRepository.save(courier);
  }
}

export default UpdateCourierService;
