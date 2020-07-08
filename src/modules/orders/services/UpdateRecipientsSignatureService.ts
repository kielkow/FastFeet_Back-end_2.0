import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import Recipient from '../infra/typeorm/entities/Recipient';
import IRecipientsRepository from '../repositories/IRecipientsRepository';

interface IRequest {
  recipient_id: string;
  signatureFilename: string;
}

@injectable()
class UpdateRecipientSignatureService {
  constructor(
    @inject('RecipientsRepository')
    private recipientsRepository: IRecipientsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    recipient_id,
    signatureFilename,
  }: IRequest): Promise<Recipient> {
    const recipient = await this.recipientsRepository.findById(recipient_id);

    if (!recipient) throw new AppError('Recipient not found', 401);

    if (recipient.signature) {
      await this.storageProvider.deleteFile(recipient.signature);
    }

    const filename = await this.storageProvider.saveFile(signatureFilename);

    recipient.signature = filename;

    await this.recipientsRepository.save(recipient);

    return recipient;
  }
}

export default UpdateRecipientSignatureService;
