import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import FakeCouriersRepository from '@modules/couriers/repositories/fakes/FakeCouriersRepository';
import FakeRecipientsRepository from '@modules/recipients/repositories/fakes/FakeRecipientsRepository';

import CreateCourierService from '@modules/couriers/services/CreateCourierService';
import CreateRecipientService from '@modules/recipients/services/CreateRecipientService';

import FakeOrdersRepository from '../repositories/fakes/FakeOrdersRepository';

import CreateOrderService from './CreateOrderService';
import ListOrdersService from './ListOrdersService';

let fakeCacheProvider: FakeCacheProvider;

let fakeOrdersRepository: FakeOrdersRepository;
let fakeRecipientsRepository: FakeRecipientsRepository;
let fakeCouriersRepository: FakeCouriersRepository;

let createOrder: CreateOrderService;
let listOrders: ListOrdersService;

let createCourier: CreateCourierService;
let createRecipient: CreateRecipientService;

describe('ListOrders', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();

    fakeOrdersRepository = new FakeOrdersRepository();
    fakeCouriersRepository = new FakeCouriersRepository();
    fakeRecipientsRepository = new FakeRecipientsRepository();

    listOrders = new ListOrdersService(fakeOrdersRepository, fakeCacheProvider);
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

  it('should be able to list orders', async () => {
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
      start_date: new Date(),
    });

    const order2 = await createOrder.execute({
      recipient_id: recipient.id,
      courier_id: courier.id,
      product: 'Product2',
      start_date: new Date(),
    });

    const order3 = await createOrder.execute({
      recipient_id: recipient.id,
      courier_id: courier.id,
      product: 'Product3',
      start_date: new Date(),
    });

    const orders = await listOrders.execute({ page: 1 });

    expect(orders).toEqual([order1, order2, order3]);
  });

  it('should be able to list the orders by specific product', async () => {
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

    const order = await createOrder.execute({
      recipient_id: recipient.id,
      courier_id: courier.id,
      product: 'Product1',
      start_date: new Date(),
    });

    await createOrder.execute({
      recipient_id: recipient.id,
      courier_id: courier.id,
      product: 'Product2',
      start_date: new Date(),
    });

    await createOrder.execute({
      recipient_id: recipient.id,
      courier_id: courier.id,
      product: 'Product3',
      start_date: new Date(),
    });

    const orders = await listOrders.execute({
      page: 1,
      product: 'Product1',
    });

    expect(orders).toEqual([order]);
  });
});
