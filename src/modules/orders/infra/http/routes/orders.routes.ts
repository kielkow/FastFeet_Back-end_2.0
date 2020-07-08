import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import OrdersController from '../controllers/OrdersController';

const ordersRouter = Router();

const ordersController = new OrdersController();

ordersRouter.use(ensureAuthenticated);

ordersRouter.get('/', ordersController.index);

ordersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  ordersController.show,
);

ordersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      recipient_id: Joi.string().required(),
      courier_id: Joi.string().required(),
      product: Joi.string().required(),
      start_date: Joi.string().required(),
    },
  }),
  ordersController.create,
);

ordersRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
    [Segments.BODY]: {
      recipient_id: Joi.string().required(),
      courier_id: Joi.string().required(),
      product: Joi.string().required(),
      start_date: Joi.string().required(),
    },
  }),
  ordersController.update,
);

ordersRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  ordersController.delete,
);

export default ordersRouter;
