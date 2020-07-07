import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeCouriersRepository from '../repositories/fakes/FakeCouriersRepository';
import CreateCourierService from './CreateCourierService';

let fakeCouriersRepository: FakeCouriersRepository;
let fakeCacheProvider: FakeCacheProvider;
let createCourier: CreateCourierService;

describe('CreateCourier', () => {
  beforeEach(() => {
    fakeCouriersRepository = new FakeCouriersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createCourier = new CreateCourierService(
      fakeCouriersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new courier', async () => {
    const courier = await createCourier.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    expect(courier).toHaveProperty('id');
  });

  it('should not be able to create a new courier with same e-mail from another', async () => {
    await createCourier.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    await expect(
      createCourier.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
