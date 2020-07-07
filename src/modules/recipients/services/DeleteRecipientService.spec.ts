import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeRecipientsRepository from '../repositories/fakes/FakeRecipientsRepository';
import DeleteRecipientService from './DeleteRecipientService';
import ListRecipientsService from './ListRecipientsService';

let fakeRecipientsRepository: FakeRecipientsRepository;
let fakeCacheProvider: FakeCacheProvider;
let deleteRecipient: DeleteRecipientService;
let listRecipients: ListRecipientsService;

describe('DeleteRecipient', () => {
  beforeEach(() => {
    fakeRecipientsRepository = new FakeRecipientsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    deleteRecipient = new DeleteRecipientService(
      fakeRecipientsRepository,
      fakeCacheProvider,
    );

    listRecipients = new ListRecipientsService(
      fakeRecipientsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to delete a recipient', async () => {
    const recipient = await fakeRecipientsRepository.create({
      name: 'Jonh Doe',
      street: 'Street',
      number: '123',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111111',
    });

    await deleteRecipient.execute({ recipient_id: recipient.id });

    const recipients = await listRecipients.execute({ page: 1 });

    expect(recipients).toEqual([]);
  });

  it('should not be able to delete a non-existing recipient', async () => {
    await expect(
      deleteRecipient.execute({
        recipient_id: 'non-existing-recipient-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
