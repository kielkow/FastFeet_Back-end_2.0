import { Request, Response } from 'express';

import { container } from 'tsyringe';

import { classToClass } from 'class-transformer';

import UpdateRecipientSignatureService from '@modules/recipients/services/UpdateRecipientsSignatureService';

export default class RecipientAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const recipient_id = request.params.id;

    const updateRecipientsSignature = container.resolve(
      UpdateRecipientSignatureService,
    );

    const recipient = await updateRecipientsSignature.execute({
      recipient_id,
      signatureFilename: request.file.filename,
    });

    return response.json(classToClass(recipient));
  }
}
