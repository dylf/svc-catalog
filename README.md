# Svc Catalog

A RESTful API that provides information about services and their versions.

## Getting Started
### Running locally

To run this project locally, you will need to have docker compose installed.

```bash
docker compose up -d
```

This will install the dependencies, seed the database with data and start
the project on `http://localhost:3000`

## Test Plan
### General
- [ ] Test bad endpoints
- [ ] Test bad methods

### Services Endpoint
- [ ] Endpoint happy-path
- [ ] Results that produce empty data set
- [ ] Paginination with different page numbers and limits
- [ ] Search functionality with different queries
- [ ] Test bad parameters
- [ ] Test bad methods

### Service Id Endpoint
- [ ] Endpoint happy-path
- [ ] Test errors 
    - [ ] Bad service id
- [ ] Test bad methods

### Service Versions Endpoint
- [ ] Endpoint happy-path
- [ ] Test errors 
    - [ ] Bad service id
- [ ] Test bad methods

### Service Version Id Endpoint
- [ ] Endpoint happy-path
- [ ] Test errors 
    - [ ] Bad service id
- [ ] Test bad methods


### Implementing Authentication
For the purposes of this project, I did not implement authentication. If we were
to add authentication to this api, I would use the following approach:
- Leverage the nestjs passport and jwt modules
- Create a jwt passport strategy that would validate the token
- Add an authentication controller either providing endpoints to our own login
mechanism or using a third-party service and adding a callback endpoint to
populate our jwt.
    - We would add services and entities to our app to store and retrieve
    information about users and their orgs, or alternatively fetch the data from the
    appropriate upstream identity service.
- Create an auth guard to use in front of our protected endpoints
    - We would want to store a user id, org id, and potentially roles to the jwt
    to understand what entities and operations the client should be able to
    access. (e.g. only services that are in their org.)

## CRUD Operations
Implementing CRUD operations would be a natural next step for this project.

- For create operations we would want to validate request body and add a post
method to the services controller.
    - Certain fields like created, id, etc. are system generated and would not
    be part of the request body.
    - After implementing authentication we can add the users organization id,
    and author to the entity
- Read operations are already implemented.
- Update operations would require a put method to the services controller.
    - We would want to validate the request body to ensure all required fields
    are sent with well-formed data. Read-only properties should not be part of
    the update request.
- Delete operations would require a delete method to the services controller.
    - It may be worth considering a soft delete for the ability to recover from
    accidental deletions, or to maintain history, etc. (we'd need to filter soft-deleted
    entities from the other endpoints)
- All the above operations should have access checks based on the requesting
user.

## Remaining tasks
- Automate the test plan
- Improvments
    - Telemetry/logging
    - Add openapi docs
    - Improve docker set up
- Document any other assumptions or decisions made during the
development process
