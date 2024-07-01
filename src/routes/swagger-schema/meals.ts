const mealBody = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    datetime: { type: 'string' },
    within_diet: { type: 'boolean' },
  },
};

export const createMealSwaggerSchema = {
  tags: ['Meals'],
  security: [{ bearerAuth: [] }],
  body: mealBody,
  response: {
    201: {},
  },
};

export const updateMealSwaggerSchema = {
  tags: ['Meals'],
  security: [{ bearerAuth: [] }],
  body: mealBody,
  response: {
    200: {},
  },
};
