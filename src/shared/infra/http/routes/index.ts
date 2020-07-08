import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';

import couriersRouter from '@modules/couriers/infra/http/routes/couriers.routes';
import recipientsRouter from '@modules/recipients/infra/http/routes/recipients.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

routes.use('/couriers', couriersRouter);
routes.use('/recipients', recipientsRouter);

export default routes;
