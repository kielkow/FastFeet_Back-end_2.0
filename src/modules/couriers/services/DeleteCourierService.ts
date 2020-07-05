import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import ICouriersRepository from '../repositories/ICouriersRepository';

interface IRequest {
  courier_id: string;
}

@injectable()
class DeleteCourierService {
  constructor(
    @inject('CouriersRepository')
    private couriersRepository: ICouriersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ courier_id }: IRequest): Promise<void | undefined> {
    await this.couriersRepository.delete(courier_id);

    await this.cacheProvider.invalidatePrefix('couriers-list');
  }
}

export default DeleteCourierService;
