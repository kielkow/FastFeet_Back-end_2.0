import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeRecipientsRepository from '../repositories/fakes/FakeRecipientsRepository';
import ShowRecipientService from './ShowRecipientService';

let fakeRecipientsRepository: FakeRecipientsRepository;
let fakeCacheProvider: FakeCacheProvider;
let showRecipient: ShowRecipientService;

describe('ShowRecipient', () => {
  beforeEach(() => {
    fakeRecipientsRepository = new FakeRecipientsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    showRecipient = new ShowRecipientService(
      fakeRecipientsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to show the recipient', async () => {
    const recipient = await fakeRecipientsRepository.create({
      name: 'Jonh Doe',
      street: 'Street',
      number: '123',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111111',
    });

    const profile = await showRecipient.execute({
      recipient_id: recipient.id,
    });

    expect(profile.name).toBe('Jonh Doe');
    expect(profile.cep).toBe('11111111');
  });

  it('should not be able to show non-existing recipient', async () => {
    await expect(
      showRecipient.execute({
        recipient_id: 'non-existing-recipient-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
