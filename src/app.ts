import fastify from 'fastify';
import swagger, { SwaggerOptions } from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { usersRoutes } from './routes/users';
import { loginRoutes } from './routes/login';
import { mealsRoutes } from './routes/meals';

export const app = fastify();

// ===== SWAGGER =====
const swaggerOptions: SwaggerOptions = {
  openapi: {
    info: {
      title: 'Daily Diet API',
      description: 'API para controle de dieta diária.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
};
const swaggerUiOptions = {
  routePrefix: '/docs',
  exposeRoute: true,
};

app.register(swagger, swaggerOptions);
app.register(swaggerUi, swaggerUiOptions);
// =====

app.register(usersRoutes, {
  prefix: 'users',
});

app.register(loginRoutes, {
  prefix: 'login',
});

app.register(mealsRoutes, {
  prefix: 'meals',
});
