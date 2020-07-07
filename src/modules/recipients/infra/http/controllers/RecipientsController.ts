import { Request, Response } from 'express';

import { container } from 'tsyringe';

import { classToClass } from 'class-transformer';

import CreateRecipientService from '@modules/recipients/services/CreateRecipientService';
import UpdateRecipientService from '@modules/recipients/services/UpdateRecipientService';
import ShowRecipientService from '@modules/recipients/services/ShowRecipientService';
import DeleteRecipientService from '@modules/recipients/services/DeleteRecipientService';
import ListRecipientsService from '@modules/recipients/services/ListRecipientsService';

export default class RecipientsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const page = request.query.page ? Number(request.query.page) : 1;
    const name = request.query.name ? String(request.query.name) : undefined;

    const listRecipientsService = container.resolve(ListRecipientsService);

    const recipients = await listRecipientsService.execute({
      page,
      name,
    });

    return response.json(classToClass(recipients));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const recipient_id = request.params.id;

    const showRecipientService = container.resolve(ShowRecipientService);

    const recipient = await showRecipientService.execute({
      recipient_id,
    });

    return response.json(classToClass(recipient));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, street, number, details, state, city, cep } = request.body;

    const createRecipient = container.resolve(CreateRecipientService);

    const recipient = await createRecipient.execute({
      name,
      street,
      number,
      details,
      state,
      city,
      cep,
    });

    return response.json(classToClass(recipient));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const recipient_id = request.params.id;
    const { name, street, number, details, state, city, cep } = request.body;

    const updateRecipient = container.resolve(UpdateRecipientService);

    const recipient = await updateRecipient.execute({
      recipient_id,
      name,
      street,
      number,
      details,
      state,
      city,
      cep,
    });

    return response.json(classToClass(recipient));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const recipient_id = request.params.id;

    const deleteRecipientService = container.resolve(DeleteRecipientService);

    await deleteRecipientService.execute({ recipient_id });

    return response.status(204).json({});
  }
}
