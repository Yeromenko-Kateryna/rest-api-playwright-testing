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

test('API-USERS-004 - should retrieve users with pagination parameters', async ({ request }) => {
  const response = await request.get('users?page=2&per_page=3');

  expect(response.status()).toBe(200);

  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');

  const body = await response.json();

  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBe(3);

  const headers = response.headers();

  expect(headers['x-pagination-page']).toBe('2');
  expect(headers['x-pagination-limit']).toBe('3');
  expect(headers).toHaveProperty('x-pagination-total');
  expect(headers).toHaveProperty('x-pagination-pages');
});

test('API-USERS-005 - should filter users by active status', async ({ request }) => {
  const response = await request.get('users?status=active&per_page=5');

  expect(response.status()).toBe(200);

  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');

  const body = await response.json();

  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);

  for (const user of body) {
    expect(user.status).toBe('active');
  }

  const headers = response.headers();
  expect(headers['x-pagination-limit']).toBe('5');
});

test('API-USERS-006 - should filter users by female gender', async ({ request }) => {
  const response = await request.get('users?gender=female&per_page=5');

  expect(response.status()).toBe(200);

  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');

  const body = await response.json();

  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);

  for (const user of body) {
    expect(user.gender).toBe('female');
  }

  const headers = response.headers();
  expect(headers['x-pagination-limit']).toBe('5');
});

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
  const token = process.env.GOREST_TOKEN;

  expect(token).toBeTruthy();

  const userData = {
    name: 'Missing Email API User',
    gender: 'female',
    status: 'active',
  };

  const response = await request.post('users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
  const token = process.env.GOREST_TOKEN;

  expect(token).toBeTruthy();

  const userData = {
    name: 'Invalid Gender API User',
    email: `invalid-gender-${Date.now()}@example.com`,
    gender: 'invalid-value',
    status: 'active',
  };

  const response = await request.post('users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
