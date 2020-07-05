import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeCouriersRepository from '../repositories/fakes/FakeCouriersRepository';
import ShowCourierService from './ShowCourierService';

let fakeCouriersRepository: FakeCouriersRepository;
let fakeCacheProvider: FakeCacheProvider;
let showCourier: ShowCourierService;

describe('ShowCourier', () => {
  beforeEach(() => {
    fakeCouriersRepository = new FakeCouriersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    showCourier = new ShowCourierService(
      fakeCouriersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to show the courier', async () => {
    const courier = await fakeCouriersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
    });

    const profile = await showCourier.execute({
      courier_id: courier.id,
    });

    expect(profile.name).toBe('Jonh Doe');
    expect(profile.email).toBe('jonhdoe@example.com');
  });

  it('should not be able to show non-existing courier', async () => {
    await expect(
      showCourier.execute({
        courier_id: 'non-existing-courier-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
