import { test, expect } from '@playwright/test';

test('API-USERS-009 - should create authenticated user', async ({ request }) => {
  const token = process.env.GOREST_TOKEN;

  expect(token).toBeTruthy();

  const userData = {
    name: 'Authenticated API User',
    email: `authenticated-${Date.now()}@example.com`,
    gender: 'female',
    status: 'active',
  };

  const createResponse = await request.post('users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userData,
  });

  expect(createResponse.status()).toBe(201);

  const createdUser = await createResponse.json();

  expect(createdUser).toHaveProperty('id');
  expect(createdUser.name).toBe(userData.name);
  expect(createdUser.email).toBe(userData.email);
  expect(createdUser.gender).toBe(userData.gender);
  expect(createdUser.status).toBe(userData.status);

  const userId = createdUser.id;

  try {
    const getResponse = await request.get(`users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(getResponse.status()).toBe(200);

    const retrievedUser = await getResponse.json();

    expect(retrievedUser.id).toBe(userId);
    expect(retrievedUser.name).toBe(userData.name);
    expect(retrievedUser.email).toBe(userData.email);
    expect(retrievedUser.gender).toBe(userData.gender);
    expect(retrievedUser.status).toBe(userData.status);
  } finally {
    const deleteResponse = await request.delete(`users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(deleteResponse.status()).toBe(204);
  }
});

test('API-USERS-010 - should partially update authenticated user', async ({ request }) => {
  const token = process.env.GOREST_TOKEN;

  expect(token).toBeTruthy();

  const userData = {
    name: 'PATCH API User',
    email: `patch-${Date.now()}@example.com`,
    gender: 'female',
    status: 'active',
  };

  const createResponse = await request.post('users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userData,
  });

  expect(createResponse.status()).toBe(201);

  const createdUser = await createResponse.json();
  const userId = createdUser.id;

  try {
    const updateData = {
      name: 'PATCH API User Updated',
      status: 'inactive',
    };

    const patchResponse = await request.patch(`users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: updateData,
    });

    expect(patchResponse.status()).toBe(200);

    const updatedUser = await patchResponse.json();

    expect(updatedUser.name).toBe(updateData.name);
    expect(updatedUser.status).toBe(updateData.status);
    expect(updatedUser.email).toBe(userData.email);
    expect(updatedUser.gender).toBe(userData.gender);

    const getResponse = await request.get(`users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(getResponse.status()).toBe(200);

    const retrievedUser = await getResponse.json();

    expect(retrievedUser.name).toBe(updateData.name);
    expect(retrievedUser.status).toBe(updateData.status);
    expect(retrievedUser.email).toBe(userData.email);
    expect(retrievedUser.gender).toBe(userData.gender);
  } finally {
    const deleteResponse = await request.delete(`users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(deleteResponse.status()).toBe(204);
  }
});

test('API-USERS-011 - should fully update authenticated user with PUT', async ({ request }) => {
  const token = process.env.GOREST_TOKEN;

  expect(token).toBeTruthy();

  const userData = {
    name: 'PUT API User',
    email: `put-${Date.now()}@example.com`,
    gender: 'female',
    status: 'active',
  };

  const createResponse = await request.post('users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userData,
  });

  expect(createResponse.status()).toBe(201);

  const createdUser = await createResponse.json();
  const userId = createdUser.id;

  try {
    const updatedUserData = {
      name: 'PUT API User Updated',
      email: `put-updated-${Date.now()}@example.com`,
      gender: 'male',
      status: 'inactive',
    };

    const putResponse = await request.put(`users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: updatedUserData,
    });

    expect(putResponse.status()).toBe(200);

    const updatedUser = await putResponse.json();

    expect(updatedUser.name).toBe(updatedUserData.name);
    expect(updatedUser.email).toBe(updatedUserData.email);
    expect(updatedUser.gender).toBe(updatedUserData.gender);
    expect(updatedUser.status).toBe(updatedUserData.status);

    const getResponse = await request.get(`users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(getResponse.status()).toBe(200);

    const retrievedUser = await getResponse.json();

    expect(retrievedUser.name).toBe(updatedUserData.name);
    expect(retrievedUser.email).toBe(updatedUserData.email);
    expect(retrievedUser.gender).toBe(updatedUserData.gender);
    expect(retrievedUser.status).toBe(updatedUserData.status);
  } finally {
    const deleteResponse = await request.delete(`users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(deleteResponse.status()).toBe(204);
  }
});

test('API-USERS-012 - should delete authenticated user', async ({ request }) => {
  const token = process.env.GOREST_TOKEN;

  expect(token).toBeTruthy();

  const userData = {
    name: 'DELETE API User',
    email: `delete-${Date.now()}@example.com`,
    gender: 'female',
    status: 'active',
  };

  const createResponse = await request.post('users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userData,
  });

  expect(createResponse.status()).toBe(201);

  const createdUser = await createResponse.json();
  const userId = createdUser.id;

  let deleted = false;

  try {
    const deleteResponse = await request.delete(`users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(deleteResponse.status()).toBe(204);

    const deleteBody = await deleteResponse.body();
    expect(deleteBody.length).toBe(0);

    deleted = true;

    const getResponse = await request.get(`users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(getResponse.status()).toBe(404);

    const contentType = getResponse.headers()['content-type'];
    expect(contentType).toContain('application/json');

    const body = await getResponse.json();

    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Resource not found');
  } finally {
    if (!deleted) {
      await request.delete(`users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }
});

