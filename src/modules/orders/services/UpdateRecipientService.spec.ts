import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeRecipientsRepository from '../repositories/fakes/FakeRecipientsRepository';
import UpdateRecipientService from './UpdateRecipientService';

let fakeRecipientsRepository: FakeRecipientsRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateRecipient: UpdateRecipientService;

describe('UpdateRecipient', () => {
  beforeEach(() => {
    fakeRecipientsRepository = new FakeRecipientsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    updateRecipient = new UpdateRecipientService(
      fakeRecipientsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to update the recipient', async () => {
    const recipient = await fakeRecipientsRepository.create({
      name: 'Jonh Doe',
      street: 'Street',
      number: '123',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111111',
    });

    const updatedRecipient = await updateRecipient.execute({
      recipient_id: recipient.id,
      name: 'Jonh Tre',
      street: 'Street',
      number: '123',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111112',
    });

    expect(updatedRecipient.name).toBe('Jonh Tre');
    expect(updatedRecipient.cep).toBe('11111112');
  });

  it('should not be able to update non-existing recipient', async () => {
    await expect(
      updateRecipient.execute({
        recipient_id: 'non-existing-recipient-id',
        name: 'Jonh Doe',
        street: 'Street',
        number: '123',
        details: 'Details',
        state: 'State',
        city: 'City',
        cep: '11111111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change CEP to another recipient CEP ', async () => {
    await fakeRecipientsRepository.create({
      name: 'Jonh Doe',
      street: 'Street',
      number: '123',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111111',
    });

    const recipient = await fakeRecipientsRepository.create({
      name: 'Jonh Tre',
      street: 'Street',
      number: '123',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111112',
    });

    await expect(
      updateRecipient.execute({
        recipient_id: recipient.id,
        name: 'Jonh Tre',
        street: 'Street',
        number: '123',
        details: 'Details',
        state: 'State',
        city: 'City',
        cep: '11111111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
