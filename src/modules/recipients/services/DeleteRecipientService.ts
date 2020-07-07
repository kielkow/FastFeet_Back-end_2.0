import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IRecipientsRepository from '../repositories/IRecipientsRepository';

interface IRequest {
  recipient_id: string;
}

@injectable()
class DeleteRecipientService {
  constructor(
    @inject('RecipientsRepository')
    private recipientsRepository: IRecipientsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ recipient_id }: IRequest): Promise<void | undefined> {
    await this.recipientsRepository.delete(recipient_id);

    await this.cacheProvider.invalidatePrefix('recipients-list');
  }
}

export default DeleteRecipientService;
