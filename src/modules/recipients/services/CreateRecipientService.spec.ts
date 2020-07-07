import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeRecipientsRepository from '../repositories/fakes/FakeRecipientsRepository';
import CreateRecipientService from './CreateRecipientService';

let fakeRecipientsRepository: FakeRecipientsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createRecipient: CreateRecipientService;

describe('CreateRecipient', () => {
  beforeEach(() => {
    fakeRecipientsRepository = new FakeRecipientsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createRecipient = new CreateRecipientService(
      fakeRecipientsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new recipient', async () => {
    const recipient = await createRecipient.execute({
      name: 'Jonh Doe',
      street: 'Street',
      number: '123',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111111',
    });

    expect(recipient).toHaveProperty('id');
  });

  it('should not be able to create a new recipient with same cep from another', async () => {
    await createRecipient.execute({
      name: 'Jonh Doe',
      street: 'Street',
      number: '123',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111111',
    });

    await expect(
      createRecipient.execute({
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
});
