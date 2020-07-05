import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICouriersRepository from '@modules/couriers/repositories/ICouriersRepository';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import Courier from '../infra/typeorm/entities/Courier';

interface IRequest {
  name: string;
  email: string;
}
@injectable()
class CreateCourierService {
  constructor(
    @inject('CouriersRepository')
    private couriersRepository: ICouriersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, email }: IRequest): Promise<Courier> {
    const checkCourierexists = await this.couriersRepository.findByEmail(email);

    if (checkCourierexists) throw new AppError('E-mail address already used');

    const courier = await this.couriersRepository.create({
      name,
      email,
    });

    await this.cacheProvider.invalidatePrefix('couriers-list');

    return courier;
  }
}

export default CreateCourierService;
