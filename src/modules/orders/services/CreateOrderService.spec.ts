import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import FakeCouriersRepository from '@modules/couriers/repositories/fakes/FakeCouriersRepository';
import CreateCourierService from '@modules/couriers/services/CreateCourierService';

import FakeRecipientsRepository from '@modules/recipients/repositories/fakes/FakeRecipientsRepository';
import CreateRecipientService from '@modules/recipients/services/CreateRecipientService';

import FakeOrdersRepository from '../repositories/fakes/FakeOrdersRepository';
import CreateOrderService from './CreateOrderService';

let fakeCacheProvider: FakeCacheProvider;

let fakeOrdersRepository: FakeOrdersRepository;
let createOrder: CreateOrderService;

let fakeCouriersRepository: FakeCouriersRepository;
let createCourier: CreateCourierService;

let fakeRecipientsRepository: FakeRecipientsRepository;
let createRecipient: CreateRecipientService;

describe('CreateOrder', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();

    fakeOrdersRepository = new FakeOrdersRepository();
    fakeCouriersRepository = new FakeCouriersRepository();
    fakeRecipientsRepository = new FakeRecipientsRepository();

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

  it('should be able to create a new order', async () => {
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

    expect(order).toHaveProperty('id');
  });

  it('should not be able to create a new order with non-existing recipient', async () => {
    const courier = await createCourier.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    await expect(
      createOrder.execute({
        recipient_id: 'non-existing-recipient',
        courier_id: courier.id,
        product: 'Product',
        start_date: new Date(new Date().setHours(10, 0, 0)),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new order with non-existing courier', async () => {
    const recipient = await createRecipient.execute({
      name: 'Jonh Doe',
      street: 'Street',
      number: '123',
      details: 'Details',
      state: 'State',
      city: 'City',
      cep: '11111111',
    });

    await expect(
      createOrder.execute({
        recipient_id: recipient.id,
        courier_id: 'non-existing-courier',
        product: 'Product',
        start_date: new Date(new Date().setHours(10, 0, 0)),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new order after 06:00PM or before 08:00AM', async () => {
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

    const beforeDate = new Date(new Date().setHours(7, 59, 59));
    const afterDate = new Date(new Date().setHours(18, 0, 0));

    await expect(
      createOrder.execute({
        recipient_id: recipient.id,
        courier_id: courier.id,
        product: 'Product',
        start_date: beforeDate,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createOrder.execute({
        recipient_id: recipient.id,
        courier_id: courier.id,
        product: 'Product',
        start_date: afterDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create more than 5 orders by day', async () => {
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

    await createOrder.execute({
      recipient_id: recipient.id,
      courier_id: courier.id,
      product: 'Product1',
      start_date: new Date(new Date().setHours(10, 0, 0)),
    });

    await createOrder.execute({
      recipient_id: recipient.id,
      courier_id: courier.id,
      product: 'Product2',
      start_date: new Date(new Date().setHours(10, 0, 0)),
    });

    await createOrder.execute({
      recipient_id: recipient.id,
      courier_id: courier.id,
      product: 'Product3',
      start_date: new Date(new Date().setHours(10, 0, 0)),
    });

    await createOrder.execute({
      recipient_id: recipient.id,
      courier_id: courier.id,
      product: 'Product4',
      start_date: new Date(new Date().setHours(10, 0, 0)),
    });

    await createOrder.execute({
      recipient_id: recipient.id,
      courier_id: courier.id,
      product: 'Product5',
      start_date: new Date(new Date().setHours(10, 0, 0)),
    });

    await expect(
      createOrder.execute({
        recipient_id: recipient.id,
        courier_id: courier.id,
        product: 'Product6',
        start_date: new Date(new Date().setHours(10, 0, 0)),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
