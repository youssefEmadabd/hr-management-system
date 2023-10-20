# hr-management-system
* A Server providing REST APIs for a web app.

## Technologies used:
* Node.js
* express.js
* typescript
* bcrypt
* Mongoose

## EndPoints:

* *GET* `/v1/` will return all normal employees (you must provide an auth token that was signed as an HR Employee.). An auth middleware is implemented to extract token's payload and to validate its content.
* *POST `v1/login` can login to already created account only if it's of type hr employee returns the data of the employee and compares the password with the hashed one the database, if successful, refresh token and access token are returned along the way.
* *POST* `v1/register` registers a new employee with username, password and type. Type can be either `normal` or `human resource`.
* *POST* `v1/reset-token` resets the access token using the refresh token send in the request headers "x-refresh-token". A middleware is implemented to check the validity of this token.
* *PATCH* `v1/:id` updates the data in an employee. This is mainly used by the hr to update normal employee's attendance. only a token that was issued for an hr can be used to pass the auth validation.

## Architecture used.

* Service, controller and route configuration. an abstract service that covers most of the common database queries, along with an abstract controller that registers the service in the constructor. Classes are used to better abstraction and code quality.

