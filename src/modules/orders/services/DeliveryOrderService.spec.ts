import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import FakeCouriersRepository from '@modules/couriers/repositories/fakes/FakeCouriersRepository';
import FakeRecipientsRepository from '@modules/recipients/repositories/fakes/FakeRecipientsRepository';

import CreateCourierService from '@modules/couriers/services/CreateCourierService';
import CreateRecipientService from '@modules/recipients/services/CreateRecipientService';

import FakeOrdersRepository from '../repositories/fakes/FakeOrdersRepository';

import CreateOrderService from './CreateOrderService';
import DeliveryOrderService from './DeliveryOrderService';

let fakeCacheProvider: FakeCacheProvider;
let fakeOrdersRepository: FakeOrdersRepository;
let fakeCouriersRepository: FakeCouriersRepository;
let fakeRecipientsRepository: FakeRecipientsRepository;

let createOrder: CreateOrderService;
let deliveryOrder: DeliveryOrderService;
let createCourier: CreateCourierService;
let createRecipient: CreateRecipientService;

describe('DeliveryOrder', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();

    fakeOrdersRepository = new FakeOrdersRepository();
    fakeCouriersRepository = new FakeCouriersRepository();
    fakeRecipientsRepository = new FakeRecipientsRepository();

    deliveryOrder = new DeliveryOrderService(
      fakeOrdersRepository,
      fakeCouriersRepository,
      fakeRecipientsRepository,
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

  it('should be able to update the order', async () => {
    const courier1 = await createCourier.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    const recipient1 = await createRecipient.execute({
      name: 'Jonh Doe',
      street: 'Street',
      number: '123',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111111',
    });

    const order = await createOrder.execute({
      recipient_id: recipient1.id,
      courier_id: courier1.id,
      product: 'Product',
      start_date: new Date(new Date().setHours(10, 0, 0)),
    });

    const deliveredOrder = await deliveryOrder.execute({
      order_id: order.id,
    });

    expect(deliveredOrder.end_date).not.toBeNull();
    expect(deliveredOrder.status).toBe('delivered');
  });

  it('should not be able to update non-existing order', async () => {
    await expect(
      deliveryOrder.execute({
        order_id: 'non-existing-order-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
