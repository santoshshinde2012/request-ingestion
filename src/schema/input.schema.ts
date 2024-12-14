const querySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    date: { type: 'string' },
  },
  required: ['name'],
  additionalProperties: false,
};

export { querySchema };
