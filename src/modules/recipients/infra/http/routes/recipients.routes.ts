import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import RecipientsController from '../controllers/RecipientsController';
import RecipientSignatureController from '../controllers/RecipientSignatureController';

const recipientsRouter = Router();
const upload = multer(uploadConfig.multer);

const recipientsController = new RecipientsController();
const recipientSignatureController = new RecipientSignatureController();

recipientsRouter.use(ensureAuthenticated);

recipientsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number(),
      name: Joi.string(),
    },
  }),
  recipientsController.index,
);

recipientsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  recipientsController.show,
);

recipientsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      street: Joi.string().required(),
      number: Joi.string().required(),
      details: Joi.string().required(),
      state: Joi.string().required(),
      city: Joi.string().required(),
      cep: Joi.string().required(),
    },
  }),
  recipientsController.create,
);

recipientsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      street: Joi.string().required(),
      number: Joi.string().required(),
      details: Joi.string().required(),
      state: Joi.string().required(),
      city: Joi.string().required(),
      cep: Joi.string().required(),
    },
  }),
  recipientsController.update,
);

recipientsRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  recipientsController.delete,
);

recipientsRouter.patch(
  '/:id/signature',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  upload.single('signature'),
  recipientSignatureController.update,
);

export default recipientsRouter;
