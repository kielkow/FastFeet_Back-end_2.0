import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';

import couriersRouter from '@modules/couriers/infra/http/routes/couriers.routes';
import recipientsRouter from '@modules/recipients/infra/http/routes/recipients.routes';
import ordersRouter from '@modules/orders/infra/http/routes/orders.routes';
import ordersProblemsRouter from '@modules/orders_problems/infra/http/routes/orders_problems.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

routes.use('/couriers', couriersRouter);
routes.use('/recipients', recipientsRouter);
routes.use('/orders', ordersRouter);
routes.use('/orders_problems', ordersProblemsRouter);

export default routes;
