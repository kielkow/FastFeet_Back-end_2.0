import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import ICouriersRepository from '../repositories/ICouriersRepository';

import Courier from '../infra/typeorm/entities/Courier';

interface IRequest {
  page: number;
  name?: string;
}

@injectable()
class ListCouriersService {
  constructor(
    @inject('CouriersRepository')
    private couriersRepository: ICouriersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ page = 1, name }: IRequest): Promise<Courier[]> {
    const cacheKey = 'couriers-list';

    let couriers = await this.cacheProvider.recover<Courier[]>(cacheKey);

    if (!couriers) {
      couriers = await this.couriersRepository.find(page, name);

      if (!couriers) {
        throw new AppError('Couriers not found.');
      }
    }

    return couriers;
  }
}

export default ListCouriersService;
