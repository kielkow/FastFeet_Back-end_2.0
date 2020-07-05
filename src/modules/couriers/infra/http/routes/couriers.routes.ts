import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import CouriersController from '../controllers/CouriersController';
import CourierAvatarController from '../controllers/CourierAvatarController';

const couriersRouter = Router();
const upload = multer(uploadConfig.multer);

const couriersController = new CouriersController();
const courierAvatarController = new CourierAvatarController();

couriersRouter.use(ensureAuthenticated);

couriersRouter.get('/', couriersController.index);

couriersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  couriersController.show,
);

couriersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    },
  }),
  couriersController.create,
);

couriersRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
    [Segments.BODY]: {
      name: Joi.string(),
      email: Joi.string().email(),
    },
  }),
  couriersController.update,
);

couriersRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  couriersController.delete,
);

couriersRouter.patch(
  '/:id/avatar',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  upload.single('avatar'),
  courierAvatarController.update,
);

export default couriersRouter;
