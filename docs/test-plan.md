# API Test Plan

## 1. Objective

The objective of this project is to validate selected functional capabilities and HTTP behaviour of the GoREST v2 API through structured manual and automated API testing.

The project also demonstrates practical QA skills in REST API analysis, validation, CRUD workflows, authentication-related scenarios, test design, and maintainable API automation with Playwright and TypeScript.

## 2. Scope

The project focuses primarily on the GoREST v2 Users resource, with selected coverage of related resources to demonstrate REST API relationships and nested endpoints.

The scope includes:

- retrieval of user collections and individual users;
- creation, full and partial update, and deletion of users;
- filtering and pagination;
- validation of HTTP status codes, relevant headers, and response bodies;
- response structure and field validation;
- positive and negative scenarios;
- input validation;
- bearer-token authentication for applicable write operations;
- an end-to-end CRUD lifecycle for a created resource;
- selected coverage of Posts, Comments, and/or Todos where it provides additional value beyond repeating the same CRUD patterns.

## 3. Out of Scope

The following areas are outside the scope of this project:

- UI testing;
- load and performance testing;
- security penetration testing;
- exhaustive coverage of all GoREST resources and endpoints;
- exhaustive validation of every possible input combination;
- browser-specific testing, since the project focuses on API-level behaviour;
- production-grade monitoring or availability testing of the public GoREST service.

## 4. Testing Approach

Testing will follow a staged QA workflow:

1. analyse the API documentation and available resources;
2. perform manual API exploration and record actual behaviour;
3. design test scenarios based on documented and observed behaviour;
4. execute key scenarios manually to validate expectations;
5. define the automation scope based on stability, repeatability, and regression value;
6. implement selected scenarios with Playwright and TypeScript;
7. refactor only where real duplication or maintainability issues appear;
8. execute the automated suite locally and in CI;
9. keep documentation aligned with the implemented coverage.

Automation will not be used as a substitute for initial API exploration or manual validation.

## 5. Test Types

The project may include the following test types where supported by the API and confirmed during exploration:

- functional testing;
- positive testing;
- negative testing;
- input validation testing;
- CRUD workflow testing;
- authentication-related testing;
- filtering and query parameter testing;
- response status, header, body, and structure validation;
- selected resource relationship testing.

## 6. Test Data Strategy

Testing will use a combination of existing public API data and test-created data.

Existing public records may be used for read-only scenarios when assertions do not depend on unstable record values.

Write scenarios will use test-created data with unique values where required. Resources created by automated tests should be cleaned up by the same test or related setup/teardown logic whenever the API allows reliable cleanup.

Tests should avoid depending on fixed public record IDs or execution order.

The public GoREST environment is shared and dynamic, so test data assumptions must be verified during manual exploration.

## 7. Environment

The project targets the public GoREST v2 API:

- Base URL: `https://gorest.co.in/public/v2`
- Runtime: Node.js
- Test framework: Playwright Test
- Language: TypeScript

Dependency versions are managed by the project `package.json` and `package-lock.json`.

Authenticated write operations require a GoREST bearer token. Secrets must not be stored in source control.

## 8. Risks

The project operates against a public shared API environment. Relevant risks include:

- public data may change independently of the test suite;
- existing records may be modified or removed;
- network availability may affect test execution;
- shared-environment activity may affect assumptions about public records;
- API behaviour or documentation may change over time;
- rate limiting may affect repeated or excessive requests;
- test-created data may remain in the environment if cleanup fails.

Tests and assertions should be designed to minimise dependence on these factors.

## 9. Assumptions and Limitations

The project assumes that the public GoREST v2 API and its official documentation are available during test analysis and execution.

Expected behaviour will not be based on documentation alone when it can be verified through manual exploration. Observed behaviour will be recorded before it is used as the basis for automation assertions.

Because GoREST is a shared public environment, stable control over existing public data cannot be assumed.

Any additional API limitations discovered during manual exploration will be documented rather than assumed in advance.

## 10. Entry Criteria

Testing may proceed when:

- the GoREST v2 API is accessible;
- relevant official documentation is available for review;
- the local Node.js project and required dependencies are installed;
- the current test scope has been defined;
- authentication credentials are available when authenticated write scenarios are executed.

## 11. Exit Criteria

The planned testing scope is considered complete when:

- planned manual scenarios have been executed and relevant observations documented;
- expected behaviour used by automated tests is supported by documentation and/or manual evidence;
- the selected automation scope has been implemented;
- positive and negative scenarios identified for automation are covered;
- CRUD, validation, authentication, and response validation coverage defined by the final scope is implemented where applicable;
- automated tests pass reliably in the supported local environment;
- CI executes the intended API test suite successfully;
- test documentation reflects the actual implemented coverage;
- no BLOCKER issues remain in the repository;
- no secrets or generated artifacts are unintentionally tracked.
