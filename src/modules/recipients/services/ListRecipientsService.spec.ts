import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeRecipientsRepository from '../repositories/fakes/FakeRecipientsRepository';
import ListRecipientsService from './ListRecipientsService';

let fakeRecipientsRepository: FakeRecipientsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listRecipients: ListRecipientsService;

describe('ListRecipients', () => {
  beforeEach(() => {
    fakeRecipientsRepository = new FakeRecipientsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listRecipients = new ListRecipientsService(
      fakeRecipientsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list recipients', async () => {
    const recipient1 = await fakeRecipientsRepository.create({
      name: 'Jonh Doe',
      street: 'Street',
      number: '123',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111111',
    });

    const recipient2 = await fakeRecipientsRepository.create({
      name: 'Jonh Tre',
      street: 'Street',
      number: '1234',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111112',
    });

    const recipient3 = await fakeRecipientsRepository.create({
      name: 'Jonh Quo',
      street: 'Street',
      number: '12345',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111113',
    });

    const recipients = await listRecipients.execute({ page: 1 });

    expect(recipients).toEqual([recipient1, recipient2, recipient3]);
  });

  it('should be able to list the recipients by specific name', async () => {
    const recipient1 = await fakeRecipientsRepository.create({
      name: 'Jonh Doe',
      street: 'Street',
      number: '123',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111111',
    });

    await fakeRecipientsRepository.create({
      name: 'Jonh Tre',
      street: 'Street',
      number: '1234',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111112',
    });

    await fakeRecipientsRepository.create({
      name: 'Jonh Quo',
      street: 'Street',
      number: '12345',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111113',
    });

    const recipients = await listRecipients.execute({
      page: 1,
      name: 'John Doe',
    });

    expect(recipients).toEqual([recipient1]);
  });
});
