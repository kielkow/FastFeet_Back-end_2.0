import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IRecipientsRepository from '../repositories/IRecipientsRepository';

import Recipient from '../infra/typeorm/entities/Recipient';

interface IRequest {
  recipient_id: string;
  name: string;
  street: string;
  number: string;
  details: string;
  state: string;
  city: string;
  cep: string;
}

@injectable()
class UpdateRecipientService {
  constructor(
    @inject('RecipientsRepository')
    private recipientsRepository: IRecipientsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    recipient_id,
    name,
    street,
    number,
    details,
    state,
    city,
    cep,
  }: IRequest): Promise<Recipient> {
    const recipient = await this.recipientsRepository.findById(recipient_id);

    if (!recipient) {
      throw new AppError('Recipient not found.');
    }

    const recipientWithUpdatedCep = await this.recipientsRepository.findByCep(
      cep,
    );

    if (
      recipientWithUpdatedCep &&
      recipientWithUpdatedCep.id !== recipient_id
    ) {
      throw new AppError('This CEP is already used.');
    }

    recipient.name = name;
    recipient.street = street;
    recipient.number = number;
    recipient.details = details;
    recipient.state = state;
    recipient.city = city;
    recipient.cep = cep;

    await this.cacheProvider.invalidatePrefix(`recipient-${recipient.id}-show`);

    return this.recipientsRepository.save(recipient);
  }
}

export default UpdateRecipientService;
