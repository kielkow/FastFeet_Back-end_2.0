import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import FakeCouriersRepository from '@modules/couriers/repositories/fakes/FakeCouriersRepository';
import CreateCourierService from '@modules/couriers/services/CreateCourierService';

import FakeRecipientsRepository from '@modules/recipients/repositories/fakes/FakeRecipientsRepository';
import CreateRecipientService from '@modules/recipients/services/CreateRecipientService';

import FakeOrdersRepository from '@modules/orders/repositories/fakes/FakeOrdersRepository';
import CreateOrderService from '@modules/orders/services/CreateOrderService';

import FakeOrdersProblemsRepository from '../repositories/fakes/FakeOrdersProblemsRepository';
import CreateOrderProblemService from './CreateOrderProblemService';
import ListOrdersProblemsService from './ListOrdersProblemsService';

let fakeCacheProvider: FakeCacheProvider;

let fakeOrdersProblemsRepository: FakeOrdersProblemsRepository;
let createOrderProblem: CreateOrderProblemService;
let listOrdersProblems: ListOrdersProblemsService;

let fakeOrdersRepository: FakeOrdersRepository;
let createOrder: CreateOrderService;

let fakeCouriersRepository: FakeCouriersRepository;
let createCourier: CreateCourierService;

let fakeRecipientsRepository: FakeRecipientsRepository;
let createRecipient: CreateRecipientService;

describe('ListOrdersProblems', () => {
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

    listOrdersProblems = new ListOrdersProblemsService(
      fakeOrdersProblemsRepository,
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

    const order_problem1 = await createOrderProblem.execute({
      order_id: order.id,
      description: 'Description',
    });

    const order_problem2 = await createOrderProblem.execute({
      order_id: order.id,
      description: 'Description',
    });

    const order_problem3 = await createOrderProblem.execute({
      order_id: order.id,
      description: 'Description',
    });

    const orders_problems = await listOrdersProblems.execute({ page: 1 });

    expect(orders_problems).toEqual([
      order_problem1,
      order_problem2,
      order_problem3,
    ]);
  });
});
