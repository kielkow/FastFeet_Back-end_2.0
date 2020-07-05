import { Request, Response } from 'express';

import { container } from 'tsyringe';

import { classToClass } from 'class-transformer';

import CreateCourierService from '@modules/couriers/services/CreateCourierService';
import UpdateCourierService from '@modules/couriers/services/UpdateCourierService';
import ShowCourierService from '@modules/couriers/services/ShowCourierService';
import DeleteCourierService from '@modules/couriers/services/DeleteCourierService';
import ListCouriersService from '@modules/couriers/services/ListCouriersService';

export default class CouriersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const page = request.query.page ? Number(request.query.page) : 1;
    const name = request.query.name ? String(request.query.name) : undefined;

    const listCouriersService = container.resolve(ListCouriersService);

    const couriers = await listCouriersService.execute({
      page,
      name,
    });

    return response.json(classToClass(couriers));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const courier_id = request.params.id;

    const showCourierService = container.resolve(ShowCourierService);

    const courier = await showCourierService.execute({
      courier_id,
    });

    return response.json(classToClass(courier));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;

    const createCourier = container.resolve(CreateCourierService);

    const courier = await createCourier.execute({
      name,
      email,
    });

    return response.json(classToClass(courier));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const courier_id = request.params.id;
    const { name, email } = request.body;

    const updateCourier = container.resolve(UpdateCourierService);

    const courier = await updateCourier.execute({
      courier_id,
      name,
      email,
    });

    return response.json(classToClass(courier));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const courier_id = request.params.id;

    const deleteCourierService = container.resolve(DeleteCourierService);

    await deleteCourierService.execute({ courier_id });

    return response.status(204).json({});
  }
}
