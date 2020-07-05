import { Request, Response } from 'express';

import { container } from 'tsyringe';

import { classToClass } from 'class-transformer';

import UpdateCourierAvatarService from '@modules/couriers/services/UpdateCourierAvatarService';

export default class CourierAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const courier_id = request.params.id;

    const updateCourierAvatar = container.resolve(UpdateCourierAvatarService);

    const courier = await updateCourierAvatar.execute({
      courier_id,
      avatarFilename: request.file.filename,
    });

    return response.json(classToClass(courier));
  }
}
