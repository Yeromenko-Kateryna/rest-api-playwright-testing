# GoREST Playwright API Testing Portfolio

[GoREST](https://gorest.co.in/) is a public REST API used in this project as the application under test.

This repository contains REST API testing and automation for the GoREST Users API using Playwright and TypeScript.

The project demonstrates practical QA and Test Automation skills: API exploration, manual test design, positive and negative testing, authentication and validation testing, CRUD workflows, dynamic test-data handling, environment-based secret management, maintainable test structure, and continuous integration with GitHub Actions.

---

## Tech Stack

- Playwright
- TypeScript
- Node.js
- REST API
- dotenv
- Git / GitHub
- GitHub Actions
- Manual API testing
- Exploratory testing

---

## Test Automation Architecture

The project uses a responsibility-based test structure.

```text
tests/
├── users-read.spec.ts
├── users-auth-validation.spec.ts
├── users-write.spec.ts
├── users-lifecycle.spec.ts
└── helpers/
    ├── auth.ts
    ├── cleanup.ts
    └── redacted-reporter.ts
```

Each specification covers one API testing responsibility:

- read operations and filtering;
- authentication and validation;
- authenticated write operations;
- complete CRUD lifecycle.

Repeated authentication and cleanup logic is kept in small shared helpers. The configured reporter redacts bearer tokens from failed-request output.

This keeps the tests readable and maintainable without introducing unnecessary service layers or framework abstractions for a portfolio-sized API project.

---

## Features

- Covers GET, POST, PATCH, PUT, and DELETE operations
- Validates positive and negative API scenarios
- Tests authenticated and unauthenticated requests
- Verifies required-field and invalid-value validation
- Covers pagination and filtering
- Uses dynamically obtained resource IDs instead of hardcoded public records
- Creates unique test data for write scenarios
- Cleans up resources created during automated execution
- Keeps tests independent from execution order
- Loads the GoREST bearer token from environment configuration
- Prevents secrets from being stored in source control
- Runs automated checks through GitHub Actions
- Documents exploration, manual test cases, execution results, and automation scope

---

## Test Coverage

The automated regression suite covers the GoREST `/users` resource.

### Read Operations

- Retrieve users collection
- Retrieve an existing user by ID
- Verify `404 Not Found` for a deleted/nonexistent user
- Retrieve users using pagination parameters
- Filter users by active status
- Filter users by female gender

### Authentication and Validation

- Reject user creation without authentication
- Reject user creation with an invalid bearer token
- Reject user creation without required email
- Reject user creation with an invalid gender value

### Write Operations

- Create an authenticated user
- Partially update a user with `PATCH`
- Fully update a user with `PUT`
- Delete an authenticated user

### CRUD Lifecycle

- Create user
- Retrieve created user
- Partially update user
- Verify persisted update
- Delete user
- Verify deleted resource returns `404 Not Found`

### Coverage Summary

| Area | Automated Scenarios |
|---|---:|
| Read Operations | 6 |
| Authentication and Validation | 4 |
| Write Operations | 4 |
| CRUD Lifecycle | 1 |
| **Automated Total** | **15** |

```text
15 documented manual test cases
15 automated Playwright scenarios
```

---

## Public API Strategy

GoREST is a shared public API whose user dataset can change independently of this test suite.

The project accounts for these constraints by:

- avoiding hardcoded IDs for existing public users;
- retrieving current user IDs dynamically where required;
- creating unique test data for authenticated write scenarios;
- validating stable response properties instead of volatile public values;
- cleaning up resources created by automated tests;
- keeping tests independent from execution order;
- using authenticated retrieval where required for created resources;
- excluding behavior that could not be confirmed as deterministic during exploration.

One pagination behavior observed above the documented limit was intentionally excluded from automation because repeated manual requests produced inconsistent results.

Details are documented in [Automation Scope](docs/automation-scope.md) and [Exploration Log](docs/exploration-log.md).

---

## Authentication and Secret Management

Authenticated GoREST operations require a bearer token.

The project loads the token from the environment:

```text
GOREST_TOKEN
```

Local configuration is stored in:

```text
.env
```

A safe template is provided in:

```text
.env.example
```

The real `.env` file is excluded from Git through `.gitignore`.

Authenticated requests use the shared helper:

```text
tests/helpers/auth.ts
```

The helper validates that the required token exists and builds the authorization header for authenticated API requests.

Negative authentication tests remain explicit so invalid-token behavior is visible directly in the test scenario.

---

## Automated Execution Scope

The repository contains 15 discoverable Playwright API scenarios. Test results depend on the availability of the public GoREST environment and a configured `GOREST_TOKEN` for authenticated scenarios.

The suite covers:

- 15 automated API scenarios
- GET, POST, PATCH, PUT, and DELETE coverage
- authentication and validation scenarios
- pagination and filtering
- complete authenticated CRUD lifecycle
- local Playwright execution through `npm test`
- GitHub Actions execution through the configured workflow

---

## Run Tests Locally

Install dependencies:

```bash
npm ci
```

Create a local `.env` file from `.env.example`:

```env
GOREST_TOKEN=your_token_here
```

Run the complete test suite:

```bash
npm test
```

Run the API test directory explicitly:

```bash
npm run test:api
```

The bearer token used for authenticated requests must never be committed to the repository.

---

## Continuous Integration

GitHub Actions runs the API regression suite on every push and pull request targeting `main`.

The workflow performs:

1. Repository checkout
2. Node.js setup
3. Dependency installation with `npm ci`
4. API test execution with `npm test`
5. Secure injection of the GoREST bearer token through GitHub repository secrets

The CI workflow is available in:

```text
.github/workflows/api-tests.yml
```

The required repository secret is:

```text
GOREST_TOKEN
```

The workflow is configured to run the suite with the `GOREST_TOKEN` repository secret.

---

## QA Documentation

### [Test Plan](docs/test-plan.md)

Project objective, scope, testing approach, risks, environment constraints, and exit criteria.

### [Exploration Log](docs/exploration-log.md)

Manually observed GoREST behavior used to establish evidence-based automated expectations.

### [Manual Test Cases](docs/test-cases.md)

Fifteen prioritized API scenarios with preconditions, requests, expected results, and automation status.

### [Manual Test Results](docs/test-results.md)

Manual execution results linked to exploration evidence.

### [Automation Scope](docs/automation-scope.md)

Implemented automation coverage, automation principles, and intentionally excluded unstable behavior.

---

## Quality Practices Demonstrated

- API exploration before automation
- Manual and automated test traceability
- Positive and negative API testing
- HTTP status-code validation
- Response body and header validation
- Authentication testing
- Input validation testing
- Pagination and filtering coverage
- CRUD testing
- Dynamic test-data handling
- Unique data generation for write scenarios
- Cleanup of created resources
- Environment-based secret management
- Independent test execution
- Small reusable helper abstraction without over-engineering
- Responsibility-based test organization
- Git and structured commit history
- GitHub Actions CI

---

## What I Learned

- How to explore a REST API before deciding what should be automated
- How to convert manually confirmed API behavior into deterministic Playwright assertions
- How to test authenticated and unauthenticated REST operations
- How to validate API errors and field-level validation responses
- How to create and clean up dynamic resources during automated execution
- How to avoid dependencies on volatile shared public API data
- How to organize API tests by responsibility instead of keeping a large monolithic specification
- How to extract repeated authentication logic without over-engineering the test framework
- How to manage API secrets locally and in GitHub Actions
- How to connect test planning, exploratory evidence, manual test cases, automation, and CI in one QA workflow

---

## Project Status

Completed portfolio project.

The current implementation includes:

- 15 documented manual API test cases
- 15 automated Playwright scenarios
- GET, POST, PATCH, PUT, and DELETE coverage
- positive and negative scenarios
- authentication and validation testing
- pagination and filtering
- complete authenticated CRUD lifecycle
- dynamic test-data creation and cleanup
- environment-based bearer-token handling
- GitHub Actions CI
- final test plan
- exploration log
- manual test execution results
- automation scope documentation

---

## Author

Kateryna Yeromenko

GitHub: [Yeromenko-Kateryna](https://github.com/Yeromenko-Kateryna)
