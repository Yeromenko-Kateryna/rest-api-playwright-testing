# API Exploration Log

## EXP-USERS-001 - Retrieve users collection

**Endpoint:** `GET /users`

**Purpose:**  
Explore the users collection response before defining test scenarios and automation assertions.

**Manual request:**

`GET https://gorest.co.in/public/v2/users`

**Actual status:**  
`200 OK`

**Relevant headers observed:**

- `Content-Type: application/json; charset=utf-8`
- `x-pagination-page: 1`
- `x-pagination-limit: 10`
- `x-pagination-total` was present
- `x-pagination-pages` was present
- `x-links-current` was present
- `x-links-next` was present
- `x-links-previous` was present but empty for the first page

**Body observations:**

- the response body was a JSON array;
- the observed response contained 10 user objects;
- observed user objects contained `id`, `name`, `email`, `gender`, and `status`;
- user IDs and record values are dynamic public data;
- both `active` and `inactive` status values were observed;
- both `male` and `female` gender values were observed.

**Current conclusion:**

The endpoint is accessible without authentication for this read operation and returns a paginated collection of users in JSON format.

Exact public record values and pagination totals should not be treated as stable test expectations.

**Follow-up:**

- repeat the request to assess data stability;
- explore an individual user with `GET /users/{id}`;
- investigate pagination and filtering separately before defining related test cases.

## EXP-USERS-002 - Retrieve existing user by ID

**Endpoint:** `GET /users/{id}`

**Purpose:**
Explore the response for an existing individual user selected from the current users collection.

**Manual request:**

A current user ID was first obtained from `GET /users`, then used in:

`GET https://gorest.co.in/public/v2/users/{id}`

**Actual status:**
`200 OK`

**Relevant headers observed:**

- `Content-Type: application/json; charset=utf-8`
- pagination headers were not observed in the individual resource response

**Body observations:**

- the response body was a single JSON object;
- the observed object contained `id`, `name`, `email`, `gender`, and `status`;
- the returned `id` matched the ID requested;
- the returned user data matched the corresponding user selected from the collection at the time of exploration.

**Current conclusion:**

An existing user can be retrieved by ID without authentication.

The individual resource response differs from the collection response by returning a single object rather than an array and by not exposing collection pagination metadata.

**Follow-up:**

- explore `GET /users/{id}` with a nonexistent ID;
- determine the actual error status and response body before defining a negative test expectation.

## EXP-USERS-003 - Retrieve nonexistent user by ID

**Endpoint:** `GET /users/{id}`

**Purpose:**
Explore the API response when an individual user resource does not exist.

**Manual request:**

`GET https://gorest.co.in/public/v2/users/999999999`

The ID was selected as a deliberately unlikely public user ID for negative exploration.

**Actual status:**
`404 Not Found`

**Relevant headers observed:**

- `Content-Type: application/json; charset=utf-8`

**Body observations:**

- the response body was a JSON object;
- the observed response contained a `message` property;
- the observed message value was `Resource not found`.

**Current conclusion:**

For the explored nonexistent user ID, `GET /users/{id}` returned `404 Not Found` with a JSON error response.

This observation can be considered a candidate expectation for a negative user retrieval scenario, but should not yet be generalized to unrelated endpoints without further evidence.

**Follow-up:**

- repeat the nonexistent-user request to confirm the behaviour is reproducible;
- explore pagination behaviour on `GET /users`;
- explore filtering behaviour before defining related test cases.

## EXP-USERS-004 - Explore users pagination

**Endpoint:** `GET /users`

**Purpose:**
Explore how the users collection responds to pagination query parameters.

**Manual request:**

`GET https://gorest.co.in/public/v2/users?page=2&per_page=3`

**Actual status:**
`200 OK`

**Relevant headers observed:**

- `Content-Type: application/json; charset=utf-8`
- `x-pagination-page: 2`
- `x-pagination-limit: 3`
- `x-pagination-total` was present
- `x-pagination-pages` was present
- `x-links-current` was present
- `x-links-next` was present
- `x-links-previous` was present

**Body observations:**

- the response body was a JSON array;
- the observed response contained 3 user objects;
- the returned collection size matched the requested `per_page=3` value;
- pagination totals differed from an earlier exploration request, confirming that public dataset totals are dynamic.

**Current conclusion:**

The explored request respected the `page` and `per_page` query parameters.

The requested page and page size were reflected in pagination headers, and the returned collection size matched the requested page size for this observation.

Exact pagination totals should not be treated as stable expectations.

**Follow-up:**

- explore filtering behaviour on the users collection;
- explore edge cases for pagination separately if they provide useful test value.

## EXP-USERS-005 - Explore users filtering by status

**Endpoint:** `GET /users`

**Purpose:**
Explore filtering behaviour for the users collection using the `status` query parameter.

**Manual request:**

`GET https://gorest.co.in/public/v2/users?status=active&per_page=5`

**Actual status:**
`200 OK`

**Relevant headers observed:**

- `Content-Type: application/json; charset=utf-8`
- `x-pagination-page: 1`
- `x-pagination-limit: 5`
- `x-pagination-total` was present
- `x-pagination-pages` was present

**Body observations:**

- the response body was a JSON array;
- the observed response contained 5 user objects;
- every returned user had `status` equal to `active`;
- no other status value was observed in the returned collection;
- record IDs and pagination totals remained dynamic public data.

**Current conclusion:**

For the explored request, the `status=active` query parameter filtered the returned users by status.

The observed result supports a future filtering scenario that validates returned record values rather than relying only on the HTTP status code.

**Follow-up:**

- explore another supported filter to compare behaviour;
- investigate invalid or unsupported filter values only if they provide useful negative test value;
- continue read-only exploration before authenticated mutation scenarios.

## EXP-USERS-006 - Explore users filtering by gender

**Endpoint:** `GET /users`

**Purpose:**
Explore filtering behaviour for the users collection using the `gender` query parameter.

**Manual request:**

`GET https://gorest.co.in/public/v2/users?gender=female&per_page=5`

**Actual status:**
`200 OK`

**Relevant headers observed:**

- `Content-Type: application/json; charset=utf-8`
- `x-pagination-page: 1`
- `x-pagination-limit: 5`
- `x-pagination-total` was present
- `x-pagination-pages` was present

**Body observations:**

- the response body was a JSON array;
- the observed response contained 5 user objects;
- every returned user had `gender` equal to `female`;
- no other gender value was observed in the returned collection;
- record IDs and pagination totals remained dynamic public data.

**Current conclusion:**

For the explored request, the `gender=female` query parameter filtered the returned users by gender.

Together with the earlier status-filter exploration, this provides evidence that supported user filters should be validated through returned record values rather than HTTP status alone.

**Follow-up:**

- positive filtering exploration is sufficient for the current stage;
- explore one useful pagination or filter edge case before moving toward authenticated write operations.

## EXP-USERS-007 - Explore pagination limit boundary

**Endpoint:** `GET /users`

**Purpose:**
Explore pagination behaviour at and above the documented `per_page` limit.

**Manual requests:**

`GET https://gorest.co.in/public/v2/users?per_page=100`

`GET https://gorest.co.in/public/v2/users?per_page=150`

**Observed behaviour for `per_page=100`:**

- the response returned `200 OK`;
- `x-pagination-limit` was `100`;
- the response body contained 100 user objects.

**Observed behaviour for `per_page=150`:**

- an initial request executed through PowerShell returned a `502` error;
- a repeated request through `curl.exe` returned `200 OK`;
- the repeated response exposed `x-pagination-limit: 10`;
- the repeated response body contained 10 user objects.

**Current conclusion:**

The documented `per_page=100` boundary behaved consistently with the requested page size during exploration.

Behaviour above that boundary was not stable across the observed requests. The initial `502` could not be reproduced, so it should not be treated as an expected API response or confirmed defect.

The repeated `per_page=150` request returned the default-like page size of 10 rather than the requested value.

**Follow-up:**

- do not automate `per_page=150` behaviour until it is reproducible and sufficiently understood;
- use the confirmed `per_page=100` behaviour as the current upper-bound observation;
- proceed to authentication and write-operation exploration.

## EXP-USERS-008 - Create user without authentication

**Endpoint:** `POST /users`

**Purpose:**
Explore authentication behaviour for a user creation request without an `Authorization` header.

**Manual request:**

`POST https://gorest.co.in/public/v2/users`

A valid-looking JSON payload containing `name`, `email`, `gender`, and `status` was sent without a bearer token.

**Actual status:**
`401 Unauthorized`

**Relevant headers observed:**

- `Content-Type: application/json; charset=utf-8`

**Body observations:**

- the response body was a JSON object;
- the observed response contained a `message` property;
- the observed message value was `Authentication failed`.

**Additional observation:**

An earlier attempt returned `400 Bad Request` when the JSON body was passed directly from a Windows PowerShell variable to `curl.exe`.

After the same payload was written to a UTF-8 temporary file and sent with `--data-binary`, the API returned `401 Unauthorized`.

The earlier `400` is therefore not treated as confirmed authentication behaviour.

**Current conclusion:**

For the explored `POST /users` request, user creation without an `Authorization` header was rejected with `401 Unauthorized` and a JSON authentication error response.

No resource was created.

**Follow-up:**

- explore the same operation with an invalid bearer token;
- obtain and configure a valid GoREST token securely before testing successful write operations;
- do not store authentication credentials in source control.

## EXP-USERS-009 - Create user with invalid authentication token

**Endpoint:** `POST /users`

**Purpose:**
Explore authentication behaviour for a user creation request with an invalid bearer token.

**Manual request:**

`POST https://gorest.co.in/public/v2/users`

The request contained:

`Authorization: Bearer invalid-token-for-exploration`

A valid-looking JSON user payload was included.

**Actual status:**
`401 Unauthorized`

**Relevant headers observed:**

- `Content-Type: application/json; charset=utf-8`

**Body observations:**

- the response body could not be reliably captured with the Windows PowerShell error-response handling used during this exploration;
- no error message is therefore recorded as an expected value for this scenario.

**Current conclusion:**

For the explored `POST /users` request, an invalid bearer token was rejected with `401 Unauthorized`.

Both missing-token and invalid-token requests returned `401` during exploration, but their response bodies should not be assumed to be identical without further evidence.

No resource was created.

**Follow-up:**

- verify the invalid-token response body later with a client that reliably exposes 4xx response content;
- configure a valid GoREST bearer token securely before successful write-operation exploration;
- keep real credentials outside source control.

## EXP-USERS-010 - Create and retrieve authenticated user

**Endpoint:** `POST /users`, followed by `GET /users/{id}`

**Purpose:**
Explore successful authenticated user creation and verify whether the created resource can be retrieved afterwards.

**Create request:**

`POST https://gorest.co.in/public/v2/users`

The request used a valid bearer token and a unique user payload containing `name`, `email`, `gender`, and `status`.

**Create result:**

- the response returned `201 Created`;
- the response body contained a server-generated `id`;
- the returned `name`, `email`, `gender`, and `status` matched the submitted values.

**Read-after-create observations:**

A subsequent unauthenticated `GET /users/{id}` returned `404 Resource not found`.

When the same `GET /users/{id}` request was repeated with the bearer token used for creation:

- the response returned `200 OK`;
- the returned user ID matched the created resource ID;
- the returned user data matched the created user.

**Current conclusion:**

The explored authenticated `POST /users` request successfully created a persistent user resource.

The created resource was retrievable with the same bearer token used for creation.

The unauthenticated `404` should not be interpreted as failed persistence because authenticated retrieval succeeded.

**Follow-up:**

- use authenticated requests when validating test-created resources;
- explore update behaviour for the created user;
- delete the resource after exploration and verify deletion.

## EXP-USERS-011 - Partially update an authenticated user

**Endpoint:** `PATCH /users/{id}`, followed by `GET /users/{id}`

**Purpose:**
Explore partial update behaviour for a test-created authenticated user and verify that the changes persist.

**Update request:**

`PATCH https://gorest.co.in/public/v2/users/{id}`

The request used the same bearer token as the create operation and included only:

- `name`
- `status`

**Update result:**

- the response returned `200 OK`;
- `name` changed to `API Exploration User Updated`;
- `status` changed to `inactive`;
- the existing `email` value remained unchanged;
- the existing `gender` value remained unchanged.

**Read-after-update observations:**

A subsequent authenticated `GET /users/{id}`:

- returned `200 OK`;
- returned the updated `name`;
- returned the updated `status`;
- retained the previously stored `email` and `gender`.

**Current conclusion:**

The explored `PATCH /users/{id}` operation successfully performed a partial update.

Only the supplied fields changed, while fields omitted from the PATCH request remained unchanged.

The changes persisted and were confirmed through a subsequent authenticated GET request.

**Follow-up:**

- delete the test-created user using the same bearer token;
- verify that the deleted resource can no longer be retrieved.

## EXP-USERS-012 - Delete user and verify deletion

**Endpoint:** `DELETE /users/{id}`, followed by `GET /users/{id}`

**Purpose:**
Explore deletion behaviour for a test-created authenticated user and verify that the resource is no longer retrievable afterwards.

**Delete request:**

`DELETE https://gorest.co.in/public/v2/users/{id}`

The request used the same bearer token used for creation and update operations.

**Delete result:**

- the response returned `204 No Content`;
- no response body was returned.

**Verification request:**

A subsequent authenticated `GET /users/{id}` was performed for the same resource.

**Verification result:**

- the response returned `404 Not Found`;
- the response body was a JSON object;
- the observed response contained `{"message":"Resource not found"}`.

**Current conclusion:**

The explored `DELETE /users/{id}` request successfully removed the test-created user.

The `204 No Content` response was supported by a subsequent authenticated retrieval attempt that returned `404 Not Found`.

This provides evidence that deletion should be verified through resource retrieval rather than relying on the DELETE status code alone.

**Follow-up:**

- the test-created resource has been cleaned up;
- explore full update behaviour with `PUT`;
- explore selected validation scenarios before defining manual test cases.

## EXP-USERS-013 - Fully update an authenticated user with PUT

**Endpoint:** `PUT /users/{id}`, followed by `GET /users/{id}`

**Purpose:**
Explore full update behaviour for a test-created authenticated user and verify that the updated representation persists.

**Update request:**

`PUT https://gorest.co.in/public/v2/users/{id}`

The request used the same bearer token as the create operation and included a complete user payload containing:

- `name`
- `email`
- `gender`
- `status`

All four values were changed from the originally created resource.

**Update result:**

- the response returned `200 OK`;
- the returned `name` matched the submitted value;
- the returned `email` matched the submitted value;
- the returned `gender` matched the submitted value;
- the returned `status` matched the submitted value;
- the user ID remained unchanged.

**Read-after-update observations:**

A subsequent authenticated `GET /users/{id}`:

- returned `200 OK`;
- returned the same updated `name`, `email`, `gender`, and `status`;
- returned the same user ID.

**Current conclusion:**

The explored `PUT /users/{id}` request successfully updated the complete submitted user representation.

The updated values persisted and were confirmed through a subsequent authenticated GET request.

This observation does not yet prove how GoREST handles incomplete PUT payloads; that behaviour should not be assumed without separate exploration.

**Follow-up:**

- delete the temporary PUT exploration user;
- optionally explore incomplete PUT behaviour if it provides useful validation value;
- continue with selected validation scenarios.

## EXP-USERS-014 - Create user without required email

**Endpoint:** `POST /users`

**Purpose:**
Explore input validation behaviour when a required user field is omitted from an authenticated creation request.

**Manual request:**

`POST https://gorest.co.in/public/v2/users`

The request used a valid bearer token and included:

- `name`
- `gender`
- `status`

The `email` field was intentionally omitted.

**Actual status:**
`422 Unprocessable Entity`

**Body observations:**

- the response body was a JSON array;
- the observed response contained a validation error for the `email` field;
- the observed validation message was `can't be blank`.

Observed response:

`[{"field":"email","message":"can't be blank"}]`

**Current conclusion:**

For the explored authenticated `POST /users` request, omitting the `email` field caused the API to reject the request with `422 Unprocessable Entity`.

The response identified the missing field and provided a field-level validation message.

No user resource was created.

**Follow-up:**

- explore another meaningful validation rule, such as an invalid enum value;
- compare validation error structure across different invalid inputs;
- avoid exhaustively testing every possible invalid value unless it adds useful coverage.

## EXP-USERS-015 - Create user with invalid gender value

**Endpoint:** `POST /users`

**Purpose:**
Explore input validation behaviour when an invalid value is provided for the `gender` field.

**Manual request:**

`POST https://gorest.co.in/public/v2/users`

The request used a valid bearer token and included a unique email address.

The `gender` field was intentionally set to:

`invalid-value`

**Actual status:**
`422 Unprocessable Entity`

**Body observations:**

- the response body was a JSON array;
- the observed response contained a validation error for the `gender` field;
- the observed validation message was `can't be blank, can be male of female`.

Observed response:

`[{"field":"gender","message":"can't be blank, can be male of female"}]`

**Current conclusion:**

For the explored authenticated `POST /users` request, an unsupported `gender` value caused the API to reject the request with `422 Unprocessable Entity`.

The validation response used the same `field` and `message` structure observed in the missing-email scenario.

No user resource was created.

**Follow-up:**

- initial user validation exploration is sufficient for the current stage;
- do not expand validation coverage without a clear test-design reason;
- review the complete exploration log before creating formal manual test cases.
