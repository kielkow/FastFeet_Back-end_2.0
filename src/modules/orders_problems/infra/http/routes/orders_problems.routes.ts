import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import OrdersProblemsController from '../controllers/OrdersProblemsController';

const ordersProblemsRouter = Router();

const ordersProblemsController = new OrdersProblemsController();

ordersProblemsRouter.use(ensureAuthenticated);

ordersProblemsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number(),
    },
  }),
  ordersProblemsController.index,
);

ordersProblemsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  ordersProblemsController.show,
);

ordersProblemsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      order_id: Joi.string().required(),
      description: Joi.string().required(),
    },
  }),
  ordersProblemsController.create,
);

export default ordersProblemsRouter;
