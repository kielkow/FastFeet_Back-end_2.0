import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import AppError from '@shared/errors/AppError';
import IRecipientsRepository from '../repositories/IRecipientsRepository';

import Recipient from '../infra/typeorm/entities/Recipient';

interface IRequest {
  recipient_id: string;
}

@injectable()
class ShowRecipientService {
  constructor(
    @inject('RecipientsRepository')
    private recipientsRepository: IRecipientsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ recipient_id }: IRequest): Promise<Recipient> {
    const cacheKey = `recipient-${recipient_id}-show`;

    const recipientCached = await this.cacheProvider.recover<Recipient>(
      cacheKey,
    );

    if (!recipientCached) {
      const recipient = await this.recipientsRepository.findById(recipient_id);

      if (!recipient) {
        throw new AppError('Recipients not found.');
      }

      return recipient;
    }

    return recipientCached;
  }
}

export default ShowRecipientService;
