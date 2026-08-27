import { test, expect } from '@playwright/test';
import { getAuthHeaders } from './helpers/auth';
import { cleanupUser } from './helpers/cleanup';

test('API-USERS-001 - should retrieve users collection', async ({ request }) => {
  const response = await request.get('users');

  expect(response.status()).toBe(200);

  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');

  const body = await response.json();

  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);

  for (const user of body) {
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('gender');
    expect(user).toHaveProperty('status');
  }

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

test('API-USERS-003 - should return 404 for nonexistent user', async ({ request }, testInfo) => {
  
  const userData = {
    name: 'Nonexistent User Verification',
    email: `nonexistent-${Date.now()}@example.com`,
    gender: 'female',
    status: 'active',
  };

  const createResponse = await request.post('users', {
    headers: getAuthHeaders(),
    data: userData,
  });

  expect(createResponse.status()).toBe(201);

  const createdUser = await createResponse.json();
  expect(createdUser).toHaveProperty('id');
  expect(typeof createdUser.id).toBe('number');

  const nonexistentUserId = createdUser.id;

  let deleted = false;
  let primaryFailure: unknown;

  try {
    const deleteResponse = await request.delete(`users/${nonexistentUserId}`, {
      headers: getAuthHeaders(),
    });

    expect(deleteResponse.status()).toBe(204);
    deleted = true;

    const response = await request.get(`users/${nonexistentUserId}`, {
      headers: getAuthHeaders(),
    });

    expect(response.status()).toBe(404);

    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');

    const body = await response.json();

    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Resource not found');
  } catch (error) {
    primaryFailure = error;
    throw error;
  } finally {
    if (!deleted) {
      const cleanupError = await cleanupUser(request, nonexistentUserId);

      if (cleanupError) {
        if (primaryFailure) {
          await testInfo.attach('cleanup-failure', {
            body: cleanupError.message,
            contentType: 'text/plain',
          });
        } else {
          throw cleanupError;
        }
      }
    }
  }
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

