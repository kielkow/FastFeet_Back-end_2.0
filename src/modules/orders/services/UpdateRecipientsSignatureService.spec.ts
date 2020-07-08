import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeRecipientsRepository from '../repositories/fakes/FakeRecipientsRepository';
import UpdateRecipientSignatureService from './UpdateRecipientsSignatureService';

let fakeRecipientsRepository: FakeRecipientsRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateRecipientSignature: UpdateRecipientSignatureService;

describe('UpdateRecipientSignature', () => {
  beforeEach(() => {
    fakeRecipientsRepository = new FakeRecipientsRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateRecipientSignature = new UpdateRecipientSignatureService(
      fakeRecipientsRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update a new recipient signature', async () => {
    const recipient = await fakeRecipientsRepository.create({
      name: 'Jonh Doe',
      street: 'Street',
      number: '123',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111111',
    });

    await updateRecipientSignature.execute({
      recipient_id: recipient.id,
      signatureFilename: 'signature.jpg',
    });

    expect(recipient.signature).toBe('signature.jpg');
  });

  it('should not be able to update signature from non existing recipient', async () => {
    await expect(
      updateRecipientSignature.execute({
        recipient_id: 'non-existing-recipient',
        signatureFilename: 'signature.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old signature on update a new signature', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const recipient = await fakeRecipientsRepository.create({
      name: 'Jonh Doe',
      street: 'Street',
      number: '123',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111111',
    });

    await updateRecipientSignature.execute({
      recipient_id: recipient.id,
      signatureFilename: 'signature.jpg',
    });

    await updateRecipientSignature.execute({
      recipient_id: recipient.id,
      signatureFilename: 'signature2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('signature.jpg');

    expect(recipient.signature).toBe('signature2.jpg');
  });
});
