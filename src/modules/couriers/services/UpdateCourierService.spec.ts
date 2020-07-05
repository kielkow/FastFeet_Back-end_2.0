import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeCouriersRepository from '../repositories/fakes/FakeCouriersRepository';
import UpdateCourierService from './UpdateCourierService';

let fakeCouriersRepository: FakeCouriersRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateCourier: UpdateCourierService;

describe('UpdateCourier', () => {
  beforeEach(() => {
    fakeCouriersRepository = new FakeCouriersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    updateCourier = new UpdateCourierService(
      fakeCouriersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to update the courier', async () => {
    const courier = await fakeCouriersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    const updatedCourier = await updateCourier.execute({
      courier_id: courier.id,
      name: 'John Tre',
      email: 'johntre@example.com',
    });

    expect(updatedCourier.name).toBe('John Tre');
    expect(updatedCourier.email).toBe('johntre@example.com');
  });

  it('should not be able to update non-existing courier', async () => {
    await expect(
      updateCourier.execute({
        courier_id: 'non-existing-courier-id',
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change e-mail to another courier e-mail ', async () => {
    await fakeCouriersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    const courier = await fakeCouriersRepository.create({
      name: 'John Tre',
      email: 'johntre@example.com',
    });

    await expect(
      updateCourier.execute({
        courier_id: courier.id,
        name: 'John Tre',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
