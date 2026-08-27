import { test, expect } from '@playwright/test';
import { getAuthHeaders } from './helpers/auth';

test('API-AUTH-001 - should reject user creation without authentication', async ({ request }) => {
  const userData = {
    name: 'Unauthenticated API User',
    email: `unauth-${Date.now()}@example.com`,
    gender: 'female',
    status: 'active',
  };

  const response = await request.post('users', {
    data: userData,
  });

  expect(response.status()).toBe(401);

  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');

  const body = await response.json();

  expect(body).toHaveProperty('message');
  expect(body.message).toBe('Authentication failed');
});

test('API-AUTH-002 - should reject user creation with invalid bearer token', async ({ request }) => {
  const userData = {
    name: 'Invalid Token API User',
    email: `invalid-token-${Date.now()}@example.com`,
    gender: 'female',
    status: 'active',
  };

  const response = await request.post('users', {
    headers: {
      Authorization: 'Bearer invalid-token',
    },
    data: userData,
  });

  expect(response.status()).toBe(401);

  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');
});

test('API-USERS-007 - should reject user creation without required email', async ({ request }) => {


  const userData = {
    name: 'Missing Email API User',
    gender: 'female',
    status: 'active',
  };

  const response = await request.post('users', {
    headers: getAuthHeaders(),
    data: userData,
  });

  expect(response.status()).toBe(422);

  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');

  const body = await response.json();

  expect(Array.isArray(body)).toBe(true);
  expect(body).toContainEqual({
    field: 'email',
    message: "can't be blank",
  });
});

test('API-USERS-008 - should reject user creation with invalid gender value', async ({ request }) => {
  
  const userData = {
    name: 'Invalid Gender API User',
    email: `invalid-gender-${Date.now()}@example.com`,
    gender: 'invalid-value',
    status: 'active',
  };

  const response = await request.post('users', {
    headers: getAuthHeaders(),
    data: userData,
  });

  expect(response.status()).toBe(422);

  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');

  const body = await response.json();

  expect(Array.isArray(body)).toBe(true);
  expect(body).toContainEqual({
    field: 'gender',
    message: "can't be blank, can be male of female",
  });
});

