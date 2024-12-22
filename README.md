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

## Remaining tasks
- Automate the test plan
- Explore authentication options
- Explore CRUD functionality
- Improvments
    - Telemetry/logging
    - Add openapi docs
    - Improve docker set up
- Document any other assumptions or decisions made during the
development process
