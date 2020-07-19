import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import OrdersController from '../controllers/OrdersController';
import OrdersStatusController from '../controllers/OrdersStatusController';
import OrdersByCourierController from '../controllers/OrdersByCourierController';

const ordersRouter = Router();

const ordersController = new OrdersController();
const ordersStatusController = new OrdersStatusController();
const ordersByCourierController = new OrdersByCourierController();

ordersRouter.use(ensureAuthenticated);

ordersRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number(),
      product: Joi.string(),
    },
  }),
  ordersController.index,
);

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
      start_date: Joi.date().required(),
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
      start_date: Joi.date().required(),
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

ordersRouter.patch(
  '/:id/delivery',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  ordersStatusController.delivery,
);

ordersRouter.patch(
  '/:id/cancel',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  ordersStatusController.cancel,
);

ordersRouter.get(
  '/courier/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  ordersByCourierController.index,
);

export default ordersRouter;
