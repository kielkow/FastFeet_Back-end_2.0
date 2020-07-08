import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IRecipientsRepository from '@modules/recipients/repositories/IRecipientsRepository';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import Recipient from '../infra/typeorm/entities/Recipient';

interface IRequest {
  name: string;
  street: string;
  number: string;
  details: string;
  state: string;
  city: string;
  cep: string;
}
@injectable()
class CreateRecipientService {
  constructor(
    @inject('RecipientsRepository')
    private recipientsRepository: IRecipientsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    name,
    street,
    number,
    details,
    state,
    city,
    cep,
  }: IRequest): Promise<Recipient> {
    const checkRecipientexists = await this.recipientsRepository.findByCep(cep);

    if (checkRecipientexists) throw new AppError('CEP address already used');

    const recipient = await this.recipientsRepository.create({
      name,
      street,
      number,
      details,
      state,
      city,
      cep,
    });

    await this.cacheProvider.invalidatePrefix('recipients-list');

    return recipient;
  }
}

export default CreateRecipientService;
