import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import AppError from '@shared/errors/AppError';
import ICouriersRepository from '../repositories/ICouriersRepository';

import Courier from '../infra/typeorm/entities/Courier';

interface IRequest {
  courier_id: string;
}

@injectable()
class ShowCourierService {
  constructor(
    @inject('CouriersRepository')
    private couriersRepository: ICouriersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ courier_id }: IRequest): Promise<Courier> {
    const cacheKey = `courier-${courier_id}-show`;

    const courierCached = await this.cacheProvider.recover<Courier>(cacheKey);

    if (!courierCached) {
      const courier = await this.couriersRepository.findById(courier_id);

      if (!courier) {
        throw new AppError('Couriers not found.');
      }

      return courier;
    }

    return courierCached;
  }
}

export default ShowCourierService;
