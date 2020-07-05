import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeCouriersRepository from '../repositories/fakes/FakeCouriersRepository';
import DeleteCourierService from './DeleteCourierService';
import ListCouriersService from './ListCouriersService';

let fakeCouriersRepository: FakeCouriersRepository;
let fakeCacheProvider: FakeCacheProvider;
let deleteCourier: DeleteCourierService;
let listCouriers: ListCouriersService;

describe('DeleteCourier', () => {
  beforeEach(() => {
    fakeCouriersRepository = new FakeCouriersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    deleteCourier = new DeleteCourierService(
      fakeCouriersRepository,
      fakeCacheProvider,
    );

    listCouriers = new ListCouriersService(
      fakeCouriersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to delete a courier', async () => {
    const courier = await fakeCouriersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
    });

    await deleteCourier.execute({ courier_id: courier.id });

    const couriers = await listCouriers.execute({ page: 1 });

    expect(couriers).toEqual([]);
  });

  it('should not be able to delete a non-existing courier', async () => {
    await expect(
      deleteCourier.execute({
        courier_id: 'non-existing-courier-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
