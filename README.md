# CSVShield-BACKEND

This API provides endpoints for user creation, user authentication, CSV file upload and validation, and management of records in a PostgreSQL database. It uses JWT tokens for user authentication and authorization, ensuring the security of operations.

API LINK: https://csvshield.onrender.com



https://github.com/AYolimaArias/CSVShield-BACKEND/assets/125715473/20511ed2-2cba-43c1-a02d-0ceebb5f622b



## Table of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Endpoints](#endpoints)
5. [Request Examples](#request-examples)
6. [Authentication](#authentication)
7. [Testing](#testing)


## Requirements

You need to have Node.js, npm, and PostgreSQL installed in your development environment.


## Installation

1. Clone this repository:

```bash
git@github.com:AYolimaArias/CSVShield-BACKEND.git
cd CSVShield-BACKEND
```

2. Install dependencies:

```bash
npm install
```

3. Configure the database connection in the .env file, an example is provided in the .env.example file.

4. Migrate the database:
   
```bash
npm run db:reset
npm run db:seed
```

5. start the server:

```bash
npm run dev
```


## Configuration

To properly configure your development environment, you'll need to create a .env file in the root of the project and set the following environment variables.

The .env.example file provides a template for users to copy and configure the variables according to their needs, similar to the following example:

```plaintext
# File .env content

# PostgreSQL database configuration
DB_HOST=localhost
DB_NAME=mi_base_de_datos
DB_PORT=5432
DB_USER=mi_usuario
DB_PASSWORD=mi_contraseña
DB_ADMIN_DATABASE=mi_database_admin

# Token JWT configuraton
JWT_SECRET=mi_secreto
COST_FACTOR=10
```

Make sure to provide specific values for each variable according to your application's requirements.

### Example Database Migration:

You can directly migrate the example database using the following commands:

- Create database:
  
```bash
npm run db:create 
```
- Create tables:

```bash
npm run db:migrate up
```
- Migrate information from users and :

```bash
npm run db:seed
```
- Drop and recreate the database and tables with a single command:

```bash
npm run db:reset
```


## Proyect Structure

The authentication is based on the three-layer architecture:

- **Routers:** Defines routes and handles HTTP requests.
- **Services:** Contains business logic and communicates with the data access layer.
- **data:** Manages interactions with the PostgreSQL database using pg.
  

## Endpoints

####  POST / signup (Create account)

- **Description**: Allow a user to signup 
- **Body**: `name`, `email`, `password` - Required fields for registration. `role` - Optional field, you can choose between 'admin' or 'user', with 'user' being the default option.
- **Response**: Create a new account and return the user information

#### POST / login (Login session)

- **Descriptionn**:Allow a user to login 
- **Body**: `email`, `password` - Credentials required to login
- **Response**: Login successful  and return a JWT token 

#### POST / upload (Read the CSV file)

- **Description**: Convert the CSV file into JSON format and store the records in a PostgreSQL database.
- **Authentication**: Secure the JWT token generated during login under `Auth/Bearer`.
- **Response**: The CSV file converted to JSON format with success data and error data


## Request Examples

##### POST / signup 

- **Description**: Allow a user to signup 
- **Body**: `name`, `email`, `password` - Required fields for registration. `role` - Optional field, you can choose between 'admin' or 'user', with 'user' being the default option.
- **Response**:
  - `201 CREATED`
  - **Example of response**:
    ```json
    
    {
      "ok": true,
      "message":"Signup successful",
      "data": {
        {
          "id": 16,
          "name": "Probino",
          "email": "probino@gmail.com",
          "role": "admin",
        }
      }
    
    ```

##### POST /login 

- **Descriptionn**:Allow a user to login 
- **Body**: `email`, `password` - Credentials required to login
- **Response**:
  - `200 OK`: login succesful
  - `401 Unauthorized`: Incorrect credentials
  - **Example of response**:
    ```json
    {
      "ok": true,
      "message": "Login successful",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5..."
      }
    }
    ```

##### POST /upload 

- **Description**: Convert the CSV file into JSON format and store the records in a PostgreSQL database.
- **Authentication**: Secure the JWT token generated during login under `Auth/Bearer`.
- **Response**:
  - `200 OK`
  - `401 Unauthorized`: If the user does not have an administrator role

**Example response:**

```json
{
	"ok": true,
	"data": {
	  "success": [
	    {
	      "id": 1,
	      "name": "Juan Perez",
	      "email": "juan.perez@example.com",
	      "age": 28
	    }
	   others ...
	  ],
	  "errors": [
	    {
	      "row": 4,
	      "details": {
	        "name": "Name is required",
	        "email": "Email must be valid",
	        "age": "Age must be a positive number"
	      }
	    }
	   others ...
	  ]
	}
}
```


## Authentication

In this project, I use JSON Web Token (JWT) to manage authentication. JWT is an open standard (RFC 7519) that defines a compact and self-contained way of securely transmitting information between parties as a JSON object. In the context of authentication, JWT is used to generate tokens that can be verified to ensure the user's identity.

### How it works

1. **Token Generation:**

   - When a user successfully authenticates, a JWT containing user information and possibly other relevant data is generated..

2. **Token Sending:**

   - The JWT token is sent to the client, usually as part of the response after successful authentication.

3. **Token Storage::**

   - The client stores the token, typically in local storage or cookies, to include it in subsequent requests to protected resources..

4. **Token Verification:**
   -With each request to a protected resource, the server verifies the validity of the received JWT token. If the token is valid, access to the protected resource is allowed.



## Testing

I did eight test to testing the endpoints functionality implementing `Vitest` and `SuperTest` libraries.

you can run the tests with the command below:

```bash
npm run test
```



