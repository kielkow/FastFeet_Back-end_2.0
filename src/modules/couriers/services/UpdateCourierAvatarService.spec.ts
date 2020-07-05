import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeCouriersRepository from '../repositories/fakes/FakeCouriersRepository';
import UpdateCourierAvatarService from './UpdateCourierAvatarService';

let fakeCouriersRepository: FakeCouriersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateCourierAvatar: UpdateCourierAvatarService;

describe('UpdateCourierAvatar', () => {
  beforeEach(() => {
    fakeCouriersRepository = new FakeCouriersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateCourierAvatar = new UpdateCourierAvatarService(
      fakeCouriersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update a new courier avatar', async () => {
    const courier = await fakeCouriersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    await updateCourierAvatar.execute({
      courier_id: courier.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(courier.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar from non existing courier', async () => {
    await expect(
      updateCourierAvatar.execute({
        courier_id: 'non-existing-courier',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar on update a new avatar', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const courier = await fakeCouriersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    await updateCourierAvatar.execute({
      courier_id: courier.id,
      avatarFilename: 'avatar.jpg',
    });

    await updateCourierAvatar.execute({
      courier_id: courier.id,
      avatarFilename: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

    expect(courier.avatar).toBe('avatar2.jpg');
  });
});
