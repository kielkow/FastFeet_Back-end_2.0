import { uuid } from 'uuidv4';

import IRecipientsRepository from '@modules/recipients/repositories/IRecipientsRepository';

import ICreateRecipientDTO from '@modules/recipients/dtos/ICreateRecipientDTO';

import AppError from '@shared/errors/AppError';

import Recipient from '../../infra/typeorm/entities/Recipient';

class FakeRecipientsRepository implements IRecipientsRepository {
  private recipients: Recipient[] = [];

  public async find(page = 1, name?: string): Promise<Recipient[]> {
    if (name) {
      this.recipients = this.recipients.filter(recipient =>
        recipient.name.includes(name),
      );

      const skip = (page - 1) * 10;
      const take = skip + 10;

      const findRecipients = this.recipients.slice(skip, take);

      return findRecipients;
    }

    const skip = (page - 1) * 10;
    const take = skip + 10;

    const findRecipients = this.recipients.slice(skip, take);

    return findRecipients;
  }

  public async findById(id: string): Promise<Recipient | undefined> {
    const findRecipient = this.recipients.find(
      recipient => recipient.id === id,
    );

    return findRecipient;
  }

  public async findByName(name: string): Promise<Recipient | undefined> {
    const findRecipient = this.recipients.find(
      recipient => recipient.name === name,
    );

    if (!findRecipient) {
      throw new AppError('Recipient with this name not found.');
    }

    return findRecipient;
  }

  public async findByCep(cep: string): Promise<Recipient | undefined> {
    const findRecipient = this.recipients.find(
      recipient => recipient.cep === cep,
    );

    return findRecipient;
  }

  public async create(recipientData: ICreateRecipientDTO): Promise<Recipient> {
    const recipient = new Recipient();

    Object.assign(recipient, { id: uuid() }, recipientData);

    this.recipients.push(recipient);

    return recipient;
  }

  public async save(recipient: Recipient): Promise<Recipient> {
    const findIndex = this.recipients.findIndex(
      findRecipient => findRecipient.id === recipient.id,
    );

    this.recipients[findIndex] = recipient;

    return recipient;
  }

  public async delete(id: string): Promise<void | undefined> {
    const findRecipient = this.recipients.find(
      recipient => recipient.id === id,
    );

    if (!findRecipient) throw new AppError('Recipient not found');

    const recipientsNotDeleted = this.recipients.filter(
      recipient => recipient.id !== id,
    );

    this.recipients = recipientsNotDeleted;
  }
}

export default FakeRecipientsRepository;
