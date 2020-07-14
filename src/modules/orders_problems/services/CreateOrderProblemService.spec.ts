import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import FakeCouriersRepository from '@modules/couriers/repositories/fakes/FakeCouriersRepository';
import CreateCourierService from '@modules/couriers/services/CreateCourierService';

import FakeRecipientsRepository from '@modules/recipients/repositories/fakes/FakeRecipientsRepository';
import CreateRecipientService from '@modules/recipients/services/CreateRecipientService';

import FakeOrdersRepository from '@modules/orders/repositories/fakes/FakeOrdersRepository';
import CreateOrderService from '@modules/orders/services/CreateOrderService';

import FakeOrdersProblemsRepository from '../repositories/fakes/FakeOrdersProblemsRepository';
import CreateOrderProblemService from './CreateOrderProblemService';

let fakeCacheProvider: FakeCacheProvider;

let fakeOrdersProblemsRepository: FakeOrdersProblemsRepository;
let createOrderProblem: CreateOrderProblemService;

let fakeOrdersRepository: FakeOrdersRepository;
let createOrder: CreateOrderService;

let fakeCouriersRepository: FakeCouriersRepository;
let createCourier: CreateCourierService;

let fakeRecipientsRepository: FakeRecipientsRepository;
let createRecipient: CreateRecipientService;

describe('CreateOrderProblem', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();

    fakeOrdersProblemsRepository = new FakeOrdersProblemsRepository();
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeCouriersRepository = new FakeCouriersRepository();
    fakeRecipientsRepository = new FakeRecipientsRepository();

    createOrderProblem = new CreateOrderProblemService(
      fakeOrdersProblemsRepository,
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

  it('should be able to create a new order problem', async () => {
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

    const order_problem = await createOrderProblem.execute({
      order_id: order.id,
      description: 'Description',
    });

    expect(order_problem).toHaveProperty('id');
  });

  it('should not be able to create a new order problem from non-existing order', async () => {
    await expect(
      createOrderProblem.execute({
        order_id: 'non-existing-order',
        description: 'Description',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
