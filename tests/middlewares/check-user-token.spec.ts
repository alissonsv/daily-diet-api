import { afterAll, beforeAll, describe, it } from 'vitest';
import request from 'supertest';

import { JWT } from '../../src/utils/jwt';
import { checkUserToken } from '../../src/middlewares/check-user-token';
import { app } from '../../src/app';
import { FastifyInstance } from 'fastify';

describe('Check User Token Middleware', () => {
  beforeAll(async () => {
    // create test route
    const testRoute = (app: FastifyInstance) =>
      app.get(
        '/test/middleware/token',
        { preHandler: [checkUserToken] },
        () => {
          return {};
        },
      );
    app.register(testRoute);

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should return 200 if token is valid', async () => {
    const validToken = JWT.createToken({ userId: '123' });

    await request(app.server)
      .get('/test/middleware/token')
      .auth(validToken, { type: 'bearer' })
      .expect(200);
  });

  it('Should return 401 if no token is informed', async () => {
    await request(app.server).get('/test/middleware/token').expect(401);
  });

  it('Should return 401 if an invalid token is informed', async () => {
    const invalidToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6InRlc3QiLCJpYXQiOjE1MTYyMzkwMjJ9.tRF6jrkFnCfv6ksyU-JwVq0xsW3SR3y5cNueSTdHdAg';

    await request(app.server)
      .get('/test/middleware/token')
      .auth(invalidToken, { type: 'bearer' })
      .expect(401);
  });
});
