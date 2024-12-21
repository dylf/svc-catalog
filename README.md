# Svc Catalog

## Test Plan
### General
- Test bad endpoints
- Test bad methods

### Services Endpoint
- Endpoint happy-path
- Results that produce empty data set
- Paginination with different page numbers and limits
- Search functionality with different queries
- Test bad parameters
- Test bad methods

### Service Id Endpoint
- Endpoint happy-path
- Test errors 
    - Bad service id
- Test bad methods

### Service Versions Endpoint
- Endpoint happy-path
- Test errors 
    - Bad service id
- Test bad methods

### Service Version Id Endpoint
- Endpoint happy-path
- Test errors 
    - Bad service id
- Test bad methods

## Remaining tasks
- Ensure local set up works correctly 
    - Fresh install on a new system
    - Ensure database seeding works as expected
- Update the README.md with the following information
    - How to set up the project locally
    - How to run the project
    - How to run the tests
- Automate the test plan
- Explore authentication options
- Explore CRUD functionality
- Improvments
    - Telemetry/logging
    - Add openapi docs
    - Improve docker set up
- Document any other assumptions or decisions made during the development process
