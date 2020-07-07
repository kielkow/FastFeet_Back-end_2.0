import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import RecipientsController from '../controllers/RecipientsController';

const recipientsRouter = Router();

const recipientsController = new RecipientsController();

recipientsRouter.use(ensureAuthenticated);

recipientsRouter.get('/', recipientsController.index);

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

export default recipientsRouter;
