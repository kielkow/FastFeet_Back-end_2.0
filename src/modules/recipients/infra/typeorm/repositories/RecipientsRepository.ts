import { getRepository, Repository, Like } from 'typeorm';

import IRecipientsRepository from '@modules/recipients/repositories/IRecipientsRepository';
import ICreateRecipientDTO from '@modules/recipients/dtos/ICreateRecipientDTO';

import AppError from '@shared/errors/AppError';
import Recipient from '../entities/Recipient';

class RecipientsRepository implements IRecipientsRepository {
  private ormRepository: Repository<Recipient>;

  constructor() {
    this.ormRepository = getRepository(Recipient);
  }

  public async find(page = 1, name?: string): Promise<Recipient[]> {
    if (name) {
      const recipients = await this.ormRepository.find({
        where: {
          name: Like(`%${name}%`),
        },
        skip: (page - 1) * 10,
        take: 10,
      });

      return recipients;
    }

    const recipients = await this.ormRepository.find({
      skip: (page - 1) * 10,
      take: 10,
    });

    return recipients;
  }

  public async findById(id: string): Promise<Recipient | undefined> {
    const recipient = await this.ormRepository.findOne(id);

    return recipient;
  }

  public async findByName(name: string): Promise<Recipient | undefined> {
    const recipient = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return recipient;
  }

  public async findByCep(cep: string): Promise<Recipient | undefined> {
    const recipient = await this.ormRepository.findOne({
      where: {
        cep,
      },
    });

    return recipient;
  }

  public async create(recipientData: ICreateRecipientDTO): Promise<Recipient> {
    const recipient = this.ormRepository.create(recipientData);

    await this.ormRepository.save(recipient);

    return recipient;
  }

  public async save(recipient: Recipient): Promise<Recipient> {
    return this.ormRepository.save(recipient);
  }

  public async delete(id: string): Promise<void | undefined> {
    const recipient = await this.ormRepository.findOne(id);

    if (!recipient) throw new AppError('Recipient not found.');

    await this.ormRepository.delete(id);
  }
}

export default RecipientsRepository;
