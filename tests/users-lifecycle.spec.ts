import { test, expect } from '@playwright/test';
import { getAuthHeaders } from './helpers/auth';
import { cleanupUser } from './helpers/cleanup';

test('API-CRUD-001 - should complete authenticated user lifecycle', async ({ request }, testInfo) => {
 
  const userData = {
    name: 'CRUD Lifecycle User',
    email: `crud-${Date.now()}@example.com`,
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

  const userId = createdUser.id;

  let deleted = false;
  let primaryFailure: unknown;

  try {
    const getCreatedResponse = await request.get(`users/${userId}`, {
      headers: getAuthHeaders(),
    });

    expect(getCreatedResponse.status()).toBe(200);

    const retrievedCreatedUser = await getCreatedResponse.json();

    expect(retrievedCreatedUser.id).toBe(userId);
    expect(retrievedCreatedUser.name).toBe(userData.name);
    expect(retrievedCreatedUser.email).toBe(userData.email);
    expect(retrievedCreatedUser.gender).toBe(userData.gender);
    expect(retrievedCreatedUser.status).toBe(userData.status);

    const updateData = {
      name: 'CRUD Lifecycle User Updated',
      status: 'inactive',
    };

    const patchResponse = await request.patch(`users/${userId}`, {
      headers: getAuthHeaders(),
      data: updateData,
    });

    expect(patchResponse.status()).toBe(200);

    const updatedUser = await patchResponse.json();

    expect(updatedUser.name).toBe(updateData.name);
    expect(updatedUser.status).toBe(updateData.status);
    expect(updatedUser.email).toBe(userData.email);
    expect(updatedUser.gender).toBe(userData.gender);

    const getUpdatedResponse = await request.get(`users/${userId}`, {
      headers: getAuthHeaders(),
    });

    expect(getUpdatedResponse.status()).toBe(200);

    const retrievedUpdatedUser = await getUpdatedResponse.json();

    expect(retrievedUpdatedUser.name).toBe(updateData.name);
    expect(retrievedUpdatedUser.status).toBe(updateData.status);
    expect(retrievedUpdatedUser.email).toBe(userData.email);
    expect(retrievedUpdatedUser.gender).toBe(userData.gender);

    const deleteResponse = await request.delete(`users/${userId}`, {
      headers: getAuthHeaders(),
    });

    expect(deleteResponse.status()).toBe(204);
    deleted = true;

    const getDeletedResponse = await request.get(`users/${userId}`, {
      headers: getAuthHeaders(),
    });

    expect(getDeletedResponse.status()).toBe(404);

    const deletedBody = await getDeletedResponse.json();

    expect(deletedBody).toHaveProperty('message');
    expect(deletedBody.message).toBe('Resource not found');
  } catch (error) {
    primaryFailure = error;
    throw error;
  } finally {
    if (!deleted) {
      const cleanupError = await cleanupUser(request, userId);

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
