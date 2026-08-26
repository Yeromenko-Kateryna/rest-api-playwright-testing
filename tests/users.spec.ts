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
  const token = process.env.GOREST_TOKEN;

  expect(token).toBeTruthy();

  const userData = {
    name: 'Nonexistent User Verification',
    email: `nonexistent-${Date.now()}@example.com`,
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
  const nonexistentUserId = createdUser.id;

  let deleted = false;

  try {
    const deleteResponse = await request.delete(`users/${nonexistentUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(deleteResponse.status()).toBe(204);
    deleted = true;

    const response = await request.get(`users/${nonexistentUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(404);

    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');

    const body = await response.json();

    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Resource not found');
  } finally {
    if (!deleted) {
      await request.delete(`users/${nonexistentUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

test('API-CRUD-001 - should complete authenticated user lifecycle', async ({ request }) => {
  const token = process.env.GOREST_TOKEN;

  expect(token).toBeTruthy();

  const userData = {
    name: 'CRUD Lifecycle User',
    email: `crud-${Date.now()}@example.com`,
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
    const getCreatedResponse = await request.get(`users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

    const getUpdatedResponse = await request.get(`users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(getUpdatedResponse.status()).toBe(200);

    const retrievedUpdatedUser = await getUpdatedResponse.json();

    expect(retrievedUpdatedUser.name).toBe(updateData.name);
    expect(retrievedUpdatedUser.status).toBe(updateData.status);
    expect(retrievedUpdatedUser.email).toBe(userData.email);
    expect(retrievedUpdatedUser.gender).toBe(userData.gender);

    const deleteResponse = await request.delete(`users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(deleteResponse.status()).toBe(204);
    deleted = true;

    const getDeletedResponse = await request.get(`users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(getDeletedResponse.status()).toBe(404);

    const deletedBody = await getDeletedResponse.json();

    expect(deletedBody).toHaveProperty('message');
    expect(deletedBody.message).toBe('Resource not found');
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
