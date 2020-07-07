import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeCouriersRepository from '../repositories/fakes/FakeCouriersRepository';
import ListCouriersService from './ListCouriersService';

let fakeCouriersRepository: FakeCouriersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listCouriers: ListCouriersService;

describe('ListCouriers', () => {
  beforeEach(() => {
    fakeCouriersRepository = new FakeCouriersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listCouriers = new ListCouriersService(
      fakeCouriersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list couriers', async () => {
    const courier1 = await fakeCouriersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    const courier2 = await fakeCouriersRepository.create({
      name: 'John Tre',
      email: 'johntre@example.com',
    });

    const courier3 = await fakeCouriersRepository.create({
      name: 'John Quo',
      email: 'johnquo@example.com',
    });

    const couriers = await listCouriers.execute({ page: 1 });

    expect(couriers).toEqual([courier1, courier2, courier3]);
  });

  it('should be able to list the couriers by specific name', async () => {
    const courier1 = await fakeCouriersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    await fakeCouriersRepository.create({
      name: 'John Tre',
      email: 'johntre@example.com',
    });

    await fakeCouriersRepository.create({
      name: 'John Quo',
      email: 'johnquo@example.com',
    });

    const couriers = await listCouriers.execute({
      page: 1,
      name: 'John Doe',
    });

    expect(couriers).toEqual([courier1]);
  });
});
