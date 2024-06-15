import fastify from 'fastify';
import { usersRoutes } from './routes/users';
import { loginRoutes } from './routes/login';
import { mealsRoutes } from './routes/meals';

export const app = fastify();

app.register(usersRoutes, {
  prefix: 'users',
});

app.register(loginRoutes, {
  prefix: 'login',
});

app.register(mealsRoutes, {
  prefix: 'meals',
});
