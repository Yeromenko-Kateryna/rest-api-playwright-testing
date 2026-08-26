# Manual API Test Results

## API-USERS-001 - Retrieve users collection

**Status:** PASS

**Actual Result:**

- response returned `200 OK`;
- response body was a JSON array;
- returned users contained `id`, `name`, `email`, `gender`, and `status`;
- pagination headers were present;
- `Content-Type` contained `application/json`.

**Evidence:**  
See `EXP-USERS-001` in `docs/exploration-log.md`.


## API-USERS-002 - Retrieve existing user by ID

**Status:** PASS

**Actual Result:**

- an existing user ID was obtained dynamically from the users collection;
- request returned `200 OK`;
- response body was a JSON object;
- returned user ID matched the requested ID;
- expected user fields were present;
- `Content-Type` contained `application/json`.

**Evidence:**  
See `EXP-USERS-002` in `docs/exploration-log.md`.


## API-USERS-003 - Retrieve nonexistent user by ID

**Status:** PASS

**Actual Result:**

- request returned `404 Not Found`;
- response body was a JSON object;
- `Content-Type` contained `application/json`;
- response contained `message`;
- observed message was `Resource not found`.

**Evidence:**  
See `EXP-USERS-003` in `docs/exploration-log.md`.

## API-USERS-004 - Retrieve users with pagination parameters

**Status:** PASS

**Actual Result:**

- request returned `200 OK`;
- response body was a JSON array;
- `page=2` was reflected in `x-pagination-page`;
- `per_page=3` was reflected in `x-pagination-limit`;
- 3 user objects were returned during execution;
- pagination total and pages headers were present;
- `Content-Type` contained `application/json`.

**Evidence:**  
See `EXP-USERS-004` in `docs/exploration-log.md`.


## API-USERS-005 - Filter users by active status

**Status:** PASS

**Actual Result:**

- request returned `200 OK`;
- response body was a JSON array;
- 5 users were returned during execution;
- every returned user had `status` equal to `active`;
- `x-pagination-limit` was `5`;
- `Content-Type` contained `application/json`.

**Evidence:**  
See `EXP-USERS-005` in `docs/exploration-log.md`.


## API-USERS-006 - Filter users by female gender

**Status:** PASS

**Actual Result:**

- request returned `200 OK`;
- response body was a JSON array;
- 5 users were returned during execution;
- every returned user had `gender` equal to `female`;
- `x-pagination-limit` was `5`;
- `Content-Type` contained `application/json`.

**Evidence:**  
See `EXP-USERS-006` in `docs/exploration-log.md`.

## API-AUTH-001 - Create user without authentication

**Status:** PASS

**Actual Result:**

- request returned `401 Unauthorized`;
- response `Content-Type` contained `application/json`;
- response body was a JSON object;
- response contained a `message` field;
- observed message was `Authentication failed`;
- no user resource was created.

**Evidence:**  
See `EXP-USERS-008` in `docs/exploration-log.md`.


## API-AUTH-002 - Create user with invalid bearer token

**Status:** PASS

**Actual Result:**

- request returned `401 Unauthorized`;
- response `Content-Type` contained `application/json`;
- no user resource was created;
- the response body was not used as test evidence because it was not captured reliably during manual execution.

**Evidence:**  
See `EXP-USERS-009` in `docs/exploration-log.md`.


## API-USERS-007 - Create user without required email

**Status:** PASS

**Actual Result:**

- request returned `422 Unprocessable Entity`;
- response body was a JSON array;
- response contained a validation error for the `email` field;
- observed validation message was `can't be blank`;
- no user resource was created.

**Evidence:**  
See `EXP-USERS-014` in `docs/exploration-log.md`.


## API-USERS-008 - Create user with invalid gender value

**Status:** PASS

**Actual Result:**

- request returned `422 Unprocessable Entity`;
- response body was a JSON array;
- response contained a validation error for the `gender` field;
- observed validation message was `can't be blank, can be male of female`;
- no user resource was created.

**Evidence:**  
See `EXP-USERS-015` in `docs/exploration-log.md`.

## API-USERS-009 - Create authenticated user

**Status:** PASS

**Actual Result:**

- authenticated request returned `201 Created`;
- response body was a JSON object;
- a server-generated user ID was returned;
- returned `name`, `email`, `gender`, and `status` matched the submitted values;
- the created user was successfully retrieved with the same bearer token;
- authenticated retrieval returned `200 OK`.

**Evidence:**  
See `EXP-USERS-010` in `docs/exploration-log.md`.


## API-USERS-010 - Partially update authenticated user

**Status:** PASS

**Actual Result:**

- authenticated PATCH request returned `200 OK`;
- submitted `name` and `status` values were updated;
- `email` and `gender` remained unchanged;
- a subsequent authenticated GET returned `200 OK`;
- the retrieved user contained the persisted updated values.

**Evidence:**  
See `EXP-USERS-011` in `docs/exploration-log.md`.


## API-USERS-011 - Fully update authenticated user with PUT

**Status:** PASS

**Actual Result:**

- authenticated PUT request returned `200 OK`;
- submitted `name`, `email`, `gender`, and `status` values were updated;
- a subsequent authenticated GET returned `200 OK`;
- the retrieved user contained the updated representation.

**Evidence:**  
See `EXP-USERS-013` in `docs/exploration-log.md`.


## API-USERS-012 - Delete authenticated user

**Status:** PASS

**Actual Result:**

- authenticated DELETE request returned `204 No Content`;
- response body was empty;
- a subsequent authenticated GET returned `404 Not Found`;
- the verification response contained `Resource not found`;
- the test resource was no longer retrievable.

**Evidence:**  
See `EXP-USERS-012` in `docs/exploration-log.md`.


## API-CRUD-001 - Complete authenticated user lifecycle

**Status:** PASS

**Actual Result:**

- an authenticated user was created successfully with `201 Created`;
- the created resource was retrieved successfully with authentication;
- selected fields were updated successfully with PATCH;
- the updated values persisted on subsequent retrieval;
- the resource was deleted successfully with `204 No Content`;
- retrieval after deletion returned `404 Not Found`;
- the created test resource was cleaned up by the end of the lifecycle.

**Evidence:**  
See `EXP-USERS-010`, `EXP-USERS-011`, and `EXP-USERS-012` in `docs/exploration-log.md`.
