import { test, expect } from '@playwright/test';

test('API-USERS-001 - should retrieve users collection', async ({ request }) => {
  const response = await request.get('users');

  expect(response.status()).toBe(200);

  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');

  const body = await response.json();

  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);

  const user = body[0];

  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('gender');
  expect(user).toHaveProperty('status');

  const headers = response.headers();

  expect(headers).toHaveProperty('x-pagination-page');
  expect(headers).toHaveProperty('x-pagination-limit');
  expect(headers).toHaveProperty('x-pagination-total');
  expect(headers).toHaveProperty('x-pagination-pages');
});
