export const loginSwaggerSchema = {
  tags: ['Login'],
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhODdlZjMzNy0wODcxLTRjNzYtOGRiZS1kMTQ2ODAxNGI0ZmMiLCJpYXQiOjE3MTk3NTg0ODcsImV4cCI6MTcxOTc2OTI4N30.jkckqcoqas5MJRL_Pah1Qy-IZCbCZrefo4Nos5YGZ-Q',
        },
      },
    },
  },
};
