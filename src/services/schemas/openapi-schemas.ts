export const serviceResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    url: { type: 'string' },
    version_count: { type: 'number' },
  },
};

export const metaResponseSchema = {
  type: 'object',
  properties: {
    total: { type: 'number' },
    page: { type: 'number' },
    page_size: { type: 'number' },
    last_page: { type: 'number' },
  },
};

export const badRequestResponseSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number', example: 400 },
    message: {
      type: 'array',
      items: { type: 'string', example: 'Invalid request' },
    },
    error: { type: 'string', example: 'Bad Request' },
  },
};
