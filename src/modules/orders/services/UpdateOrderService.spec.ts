import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import FakeCouriersRepository from '@modules/couriers/repositories/fakes/FakeCouriersRepository';
import FakeRecipientsRepository from '@modules/recipients/repositories/fakes/FakeRecipientsRepository';

import CreateCourierService from '@modules/couriers/services/CreateCourierService';
import CreateRecipientService from '@modules/recipients/services/CreateRecipientService';

import FakeOrdersRepository from '../repositories/fakes/FakeOrdersRepository';

import CreateOrderService from './CreateOrderService';
import UpdateOrderService from './UpdateOrderService';

let fakeCacheProvider: FakeCacheProvider;
let fakeOrdersRepository: FakeOrdersRepository;
let fakeCouriersRepository: FakeCouriersRepository;
let fakeRecipientsRepository: FakeRecipientsRepository;

let createOrder: CreateOrderService;
let updateOrder: UpdateOrderService;
let createCourier: CreateCourierService;
let createRecipient: CreateRecipientService;

describe('UpdateOrder', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();

    fakeOrdersRepository = new FakeOrdersRepository();
    fakeCouriersRepository = new FakeCouriersRepository();
    fakeRecipientsRepository = new FakeRecipientsRepository();

    updateOrder = new UpdateOrderService(
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

    const courier2 = await createCourier.execute({
      name: 'John Tre',
      email: 'johntre@example.com',
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

    const recipient2 = await createRecipient.execute({
      name: 'Jonh Tre',
      street: 'Street',
      number: '123',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111112',
    });

    const order = await createOrder.execute({
      recipient_id: recipient1.id,
      courier_id: courier1.id,
      product: 'Product',
      start_date: new Date(new Date().setHours(10, 0, 0)),
    });

    const updatedOrder = await updateOrder.execute({
      order_id: order.id,
      recipient_id: recipient2.id,
      courier_id: courier2.id,
      product: 'Product Updated',
      start_date: new Date(new Date().setHours(10, 0, 0)),
    });

    expect(updatedOrder.recipient.id).toBe(recipient2.id);
    expect(updatedOrder.courier.id).toBe(courier2.id);
  });

  it('should not be able to update non-existing order', async () => {
    await expect(
      updateOrder.execute({
        order_id: 'non-existing-order-id',
        recipient_id: 'recipient-id',
        courier_id: 'courier-id',
        product: 'Product Updated',
        start_date: new Date(new Date().setHours(10, 0, 0)),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
