# API Test Cases

## API-USERS-001 - Retrieve users collection

**Preconditions:**
GoREST v2 API is accessible.

**Request:**
`GET /users`

**Expected Result:**

* response status is `200 OK`;
* response body is a JSON array;
* returned user objects contain `id`, `name`, `email`, `gender`, and `status`;
* `x-pagination-page`, `x-pagination-limit`, `x-pagination-total`, and `x-pagination-pages` headers are present;
* response `Content-Type` contains `application/json`.

**Priority:** High

**Automation Status:** Automated

## API-USERS-002 - Retrieve existing user by ID

**Preconditions:**
An existing user ID is obtained from the current users collection.

**Request:**
`GET /users/{id}`

**Expected Result:**

* response status is `200 OK`;
* response body is a JSON object;
* returned `id` matches the requested user ID;
* the response contains `id`, `name`, `email`, `gender`, and `status`;
* response `Content-Type` contains `application/json`.

**Priority:** High

**Automation Status:** Automated

## API-USERS-003 - Retrieve nonexistent user by ID

**Preconditions:**
A user ID confirmed to be absent from the API is available for negative testing.

**Request:**
`GET /users/{id}`

**Expected Result:**

* response status is `404 Not Found`;
* response `Content-Type` contains `application/json`;
* response body is a JSON object;
* response contains a `message` field;
* the observed error message is `Resource not found`.

**Priority:** High

**Automation Status:** Automated

## API-USERS-004 - Retrieve users with pagination parameters

**Preconditions:**  
GoREST v2 API is accessible.

**Request:**  
`GET /users?page=2&per_page=3`

**Expected Result:**

- response status is `200 OK`;
- response body is a JSON array;
- response contains 3 user objects when sufficient data is available;
- `x-pagination-page` equals `2`;
- `x-pagination-limit` equals `3`;
- `x-pagination-total` and `x-pagination-pages` headers are present;
- response `Content-Type` contains `application/json`.

**Priority:** Medium

**Automation Status:** Automated


## API-USERS-005 - Filter users by active status

**Preconditions:**  
GoREST v2 API is accessible.

**Request:**  
`GET /users?status=active&per_page=5`

**Expected Result:**

- response status is `200 OK`;
- response body is a JSON array;
- every returned user has `status` equal to `active`;
- `x-pagination-limit` equals `5`;
- response `Content-Type` contains `application/json`.

**Priority:** Medium

**Automation Status:** Automated


## API-USERS-006 - Filter users by female gender

**Preconditions:**  
GoREST v2 API is accessible.

**Request:**  
`GET /users?gender=female&per_page=5`

**Expected Result:**

- response status is `200 OK`;
- response body is a JSON array;
- every returned user has `gender` equal to `female`;
- `x-pagination-limit` equals `5`;
- response `Content-Type` contains `application/json`.

**Priority:** Medium

**Automation Status:** Automated

## API-AUTH-001 - Create user without authentication

**Preconditions:**  
GoREST v2 API is accessible.

**Request:**  
`POST /users`

A valid user payload is sent without an `Authorization` header.

**Expected Result:**

- response status is `401 Unauthorized`;
- response `Content-Type` contains `application/json`;
- response body is a JSON object;
- response contains a `message` field;
- the observed error message is `Authentication failed`;
- no user resource is created.

**Priority:** High

**Automation Status:** Automated


## API-AUTH-002 - Create user with invalid bearer token

**Preconditions:**  
GoREST v2 API is accessible.

**Request:**  
`POST /users`

A valid user payload is sent with an invalid bearer token.

**Expected Result:**

- response status is `401 Unauthorized`;
- response `Content-Type` contains `application/json`;
- no user resource is created.

**Priority:** High

**Automation Status:** Automated


## API-USERS-007 - Create user without required email

**Preconditions:**  
A valid GoREST bearer token is available.

**Request:**  
`POST /users`

The request contains valid `name`, `gender`, and `status` values but omits `email`.

**Expected Result:**

- response status is `422 Unprocessable Entity`;
- response body is a JSON array;
- response contains a validation error for the `email` field;
- the observed validation message is `can't be blank`;
- no user resource is created.

**Priority:** High

**Automation Status:** Automated


## API-USERS-008 - Create user with invalid gender value

**Preconditions:**  
A valid GoREST bearer token is available.

**Request:**  
`POST /users`

The request contains a unique email and uses `invalid-value` for `gender`.

**Expected Result:**

- response status is `422 Unprocessable Entity`;
- response body is a JSON array;
- response contains a validation error for the `gender` field;
- the observed validation message is `can't be blank, can be male of female`;
- no user resource is created.

**Priority:** High

**Automation Status:** Automated

## API-USERS-009 - Create authenticated user

**Preconditions:**  
A valid GoREST bearer token is available.

**Request:**  
`POST /users`

The request contains valid `name`, unique `email`, `gender`, and `status` values.

**Expected Result:**

- response status is `201 Created`;
- response body is a JSON object;
- response contains a server-generated `id`;
- returned `name`, `email`, `gender`, and `status` match the submitted values;
- the created resource can be retrieved with the same bearer token.

**Priority:** High

**Automation Status:** Automated


## API-USERS-010 - Partially update authenticated user

**Preconditions:**  
A test user has been created with a valid bearer token.

**Request:**  
`PATCH /users/{id}`

The request updates only selected fields such as `name` and `status`.

**Expected Result:**

- response status is `200 OK`;
- submitted fields are updated;
- fields omitted from the PATCH request remain unchanged;
- a subsequent authenticated `GET /users/{id}` returns the updated values.

**Priority:** High

**Automation Status:** Automated


## API-USERS-011 - Fully update authenticated user with PUT

**Preconditions:**  
A test user has been created with a valid bearer token.

**Request:**  
`PUT /users/{id}`

The request contains a complete user payload with updated `name`, `email`, `gender`, and `status`.

**Expected Result:**

- response status is `200 OK`;
- returned `name`, `email`, `gender`, and `status` match the submitted values;
- a subsequent authenticated `GET /users/{id}` returns the updated representation.

**Priority:** High

**Automation Status:** Automated


## API-USERS-012 - Delete authenticated user

**Preconditions:**  
A test user has been created with a valid bearer token.

**Request:**  
`DELETE /users/{id}`

**Expected Result:**

- response status is `204 No Content`;
- response body is empty;
- a subsequent authenticated `GET /users/{id}` returns `404 Not Found`;
- the verification response contains `Resource not found`.

**Priority:** High

**Automation Status:** Automated


## API-CRUD-001 - Complete authenticated user lifecycle

**Preconditions:**  
A valid GoREST bearer token is available.

**Flow:**

1. create a user with `POST /users`;
2. retrieve the created user with `GET /users/{id}`;
3. partially update the user with `PATCH /users/{id}`;
4. retrieve the user and verify the update;
5. delete the user with `DELETE /users/{id}`;
6. attempt to retrieve the deleted user.

**Expected Result:**

- creation returns `201 Created` and a server-generated user ID;
- authenticated retrieval returns `200 OK` and the created user data;
- PATCH returns `200 OK` and updates only the submitted fields;
- the update persists when the user is retrieved again;
- DELETE returns `204 No Content`;
- retrieval after deletion returns `404 Not Found`;
- the created test resource is removed by the end of the scenario.

**Priority:** High

**Automation Status:** Automated
