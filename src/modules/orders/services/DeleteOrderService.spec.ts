import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import FakeCouriersRepository from '@modules/couriers/repositories/fakes/FakeCouriersRepository';
import FakeRecipientsRepository from '@modules/recipients/repositories/fakes/FakeRecipientsRepository';

import CreateCourierService from '@modules/couriers/services/CreateCourierService';
import CreateRecipientService from '@modules/recipients/services/CreateRecipientService';

import FakeOrdersRepository from '../repositories/fakes/FakeOrdersRepository';

import CreateOrderService from './CreateOrderService';
import DeleteOrderService from './DeleteOrderService';
import ListOrdersService from './ListOrdersService';

let fakeCacheProvider: FakeCacheProvider;
let fakeOrdersRepository: FakeOrdersRepository;
let fakeCouriersRepository: FakeCouriersRepository;
let fakeRecipientsRepository: FakeRecipientsRepository;

let createOrder: CreateOrderService;
let deleteOrder: DeleteOrderService;
let listOrders: ListOrdersService;
let createCourier: CreateCourierService;
let createRecipient: CreateRecipientService;

describe('DeleteOrder', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();

    fakeOrdersRepository = new FakeOrdersRepository();
    fakeCouriersRepository = new FakeCouriersRepository();
    fakeRecipientsRepository = new FakeRecipientsRepository();

    deleteOrder = new DeleteOrderService(
      fakeOrdersRepository,
      fakeCacheProvider,
    );

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

  it('should be able to delete a order', async () => {
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
      product: 'Product',
      start_date: new Date(new Date().setHours(10, 0, 0)),
    });

    await deleteOrder.execute({ order_id: order.id });

    const orders = await listOrders.execute({ page: 1 });

    expect(orders).toEqual([]);
  });

  it('should not be able to delete a non-existing order', async () => {
    await expect(
      deleteOrder.execute({
        order_id: 'non-existing-order-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
