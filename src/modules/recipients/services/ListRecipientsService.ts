import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IRecipientsRepository from '../repositories/IRecipientsRepository';

import Recipient from '../infra/typeorm/entities/Recipient';

interface IRequest {
  page: number;
  name?: string;
}

@injectable()
class ListRecipientsService {
  constructor(
    @inject('RecipientsRepository')
    private recipientsRepository: IRecipientsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ page = 1, name }: IRequest): Promise<Recipient[]> {
    const cacheKey = 'recipients-list';

    let recipients = await this.cacheProvider.recover<Recipient[]>(cacheKey);

    if (!recipients) {
      recipients = await this.recipientsRepository.find(page, name);

      if (!recipients) {
        throw new AppError('Recipients not found.');
      }
    }

    return recipients;
  }
}

export default ListRecipientsService;
