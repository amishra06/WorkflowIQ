import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';

export const handlers = [
  // Mock workflow execution
  http.post('/api/workflows/:id/execute', async () => {
    return HttpResponse.json({
      id: faker.string.uuid(),
      status: 'success',
      executionTime: faker.number.int({ min: 100, max: 2000 }),
      outputs: {
        result: faker.string.sample(),
      },
    });
  }),

  // Mock workflow test results
  http.get('/api/workflows/:id/tests', () => {
    return HttpResponse.json({
      testCases: Array.from({ length: 5 }, () => ({
        id: faker.string.uuid(),
        name: faker.string.sample(),
        description: faker.string.sample(),
        passed: faker.datatype.boolean(),
        executionTime: faker.number.int({ min: 100, max: 1000 }),
      })),
    });
  }),

  // Add more mock handlers as needed
];