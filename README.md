# Sword Health - Code Challenge

## About
Simple CRUD API to manage Tasks.
- There are 2 types of Users (T: Technician, M: Manager);
- Technicians can log in to create, list or update their own tasks only;
- Managers can list all tasks from all Technicians, but are not able to see the description (can contain personal info);
- Managers are the only ones that can delete tasks;  
<br/>

-------------
<br/>

## Supported Routes and Methods

### API Path `/api`:
- **GET** -> `/` for status check

### User's path `/api/user`:
- **POST** -> `/create` to create a new user
- **POST** -> `/auth` to receive an authentication token
- **GET** -> `/list` to list all registered users

### Task's path `/api/task`:
- **GET** -> `/` to list user's tasks (or all tasks if you're a Manager)
- **POST** -> `/` to create a new task
- **PUT** -> `/:id` to update an existing task
- **DELETE** -> `/:id` to delete a specific test  
<br/>

### Install and Run Application
```
$ docker-compose up --build
```
### Run Tests
```
$ npm test
```
<br/>

### Postman Collection
There is a Postman collection to be imported with all created endpoints.  
- *sword-health-challenge.postman_collection.json*.  
<br/>

-------------
<br/>

## Environment
- Node.js
- Express.js
- express-validator
- JWT
- Kafka
- BCrypt
- Crypto
- Docker
## Dev & Tests
- Faker
- ESLint
- Jest
- Supertest
