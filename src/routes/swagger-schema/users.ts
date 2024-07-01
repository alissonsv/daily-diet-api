export const userSwaggerSchema = {
  tags: ['User'],
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      password: { type: 'string' },
      email: { type: 'string', format: 'email' },
    },
  },
  response: {
    201: {
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
