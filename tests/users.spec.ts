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

test('API-USERS-002 - should retrieve existing user by ID', async ({ request }) => {
  const usersResponse = await request.get('users');

  expect(usersResponse.status()).toBe(200);

  const users = await usersResponse.json();

  expect(Array.isArray(users)).toBe(true);
  expect(users.length).toBeGreaterThan(0);

  const existingUserId = users[0].id;

  const response = await request.get(`users/${existingUserId}`);

  expect(response.status()).toBe(200);

  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');

  const user = await response.json();

  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('gender');
  expect(user).toHaveProperty('status');

  expect(user.id).toBe(existingUserId);
});

test('API-USERS-003 - should return 404 for nonexistent user', async ({ request }) => {
  const nonexistentUserId = 999999999;

  const response = await request.get(`users/${nonexistentUserId}`);

  expect(response.status()).toBe(404);

  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');

  const body = await response.json();

  expect(body).toHaveProperty('message');
  expect(body.message).toBe('Resource not found');
});
