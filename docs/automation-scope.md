# Automation Scope

## Objective

Define which manually validated GoREST API scenarios should be automated with Playwright and which should remain manual or exploratory.

## Automated Scenarios

### High Priority Coverage

- `API-USERS-001` - Retrieve users collection
- `API-USERS-002` - Retrieve existing user by ID
- `API-USERS-003` - Retrieve nonexistent user by ID
- `API-AUTH-001` - Create user without authentication
- `API-AUTH-002` - Create user with invalid bearer token
- `API-USERS-007` - Create user without required email
- `API-USERS-008` - Create user with invalid gender value
- `API-USERS-009` - Create authenticated user
- `API-USERS-010` - Partially update authenticated user
- `API-USERS-011` - Fully update authenticated user with PUT
- `API-USERS-012` - Delete authenticated user
- `API-CRUD-001` - Complete authenticated user lifecycle

## Secondary Coverage

- `API-USERS-004` - Retrieve users with pagination parameters
- `API-USERS-005` - Filter users by active status
- `API-USERS-006` - Filter users by female gender

These scenarios are useful for regression coverage but depend more heavily on the current state of the shared public dataset.

## Not Planned for Automation

The manually observed behavior above the documented pagination limit is not planned for automation because the response behavior was inconsistent during exploration and is not sufficiently stable to use as a deterministic automated expectation.

See `EXP-USERS-007` in `docs/exploration-log.md`.

## Automation Principles

- automated assertions must be based on confirmed manual evidence;
- dynamic public user IDs must not be hardcoded;
- write tests must create their own unique test data;
- authenticated write tests must use the bearer token from environment configuration;
- secrets must not be stored in source control;
- created test resources must be cleaned up;
- tests should not depend on execution order;
- stable response properties should be asserted instead of volatile public data;
- automation should remain readable and maintainable.
