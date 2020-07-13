import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import FakeCouriersRepository from '@modules/couriers/repositories/fakes/FakeCouriersRepository';
import FakeRecipientsRepository from '@modules/recipients/repositories/fakes/FakeRecipientsRepository';

import CreateCourierService from '@modules/couriers/services/CreateCourierService';
import CreateRecipientService from '@modules/recipients/services/CreateRecipientService';

import FakeOrdersRepository from '../repositories/fakes/FakeOrdersRepository';

import CreateOrderService from './CreateOrderService';
import ListOrdersByCourierService from './ListOrdersByCourierService';

let fakeCacheProvider: FakeCacheProvider;

let fakeOrdersRepository: FakeOrdersRepository;
let fakeRecipientsRepository: FakeRecipientsRepository;
let fakeCouriersRepository: FakeCouriersRepository;

let createOrder: CreateOrderService;
let listOrdersByCouier: ListOrdersByCourierService;

let createCourier: CreateCourierService;
let createRecipient: CreateRecipientService;

describe('ListOrdersByCouier', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();

    fakeOrdersRepository = new FakeOrdersRepository();
    fakeCouriersRepository = new FakeCouriersRepository();
    fakeRecipientsRepository = new FakeRecipientsRepository();

    listOrdersByCouier = new ListOrdersByCourierService(
      fakeOrdersRepository,
      fakeCacheProvider,
    );

    createOrder = new CreateOrderService(
      fakeOrdersRepository,
      fakeCouriersRepository,
      fakeRecipientsRepository,
      fakeCacheProvider,
    );

    createCourier = new CreateCourierService(
      fakeCouriersRepository,
      fakeCacheProvider,
    );

    createRecipient = new CreateRecipientService(
      fakeRecipientsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list orders by courier', async () => {
    const courier = await createCourier.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    const recipient = await createRecipient.execute({
      name: 'Jonh Doe',
      street: 'Street',
      number: '123',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111111',
    });

    const order1 = await createOrder.execute({
      recipient_id: recipient.id,
      courier_id: courier.id,
      product: 'Product1',
      start_date: new Date(new Date().setHours(10, 0, 0)),
    });

    const order2 = await createOrder.execute({
      recipient_id: recipient.id,
      courier_id: courier.id,
      product: 'Product2',
      start_date: new Date(new Date().setHours(10, 0, 0)),
    });

    const order3 = await createOrder.execute({
      recipient_id: recipient.id,
      courier_id: courier.id,
      product: 'Product3',
      start_date: new Date(new Date().setHours(10, 0, 0)),
    });

    const orders = await listOrdersByCouier.execute({
      page: 1,
      courier_id: courier.id,
    });

    expect(orders).toEqual([order1, order2, order3]);
  });
});
