Here is how you handle the `GET /users/me` route conceptually, followed by the complete map of your project's files and routes.

### How to do `GET /users/me` (Conceptually)

Since you are using `@fastify/jwt`, this route is a **Protected Route**. This means a user cannot access it unless they prove they are logged in.

1. **The Request:** The client (frontend/Postman) sends a request to `GET /users/me`. Crucially, they must include their JWT token in the HTTP `Authorization` header (formatted as `Bearer <their_token>`).
2. **The Verification Hook:** Before your controller even runs, you tell Fastify to run `request.jwtVerify()`.
3. **The Check:** Fastify cracks open the token, checks if it is expired, and verifies it was signed with your `JWT_SECRET`.
    * If the token is fake or expired, Fastify instantly rejects the request with a `401 Unauthorized` error.
    * If it is valid, Fastify extracts the `{ userId: 1 }` payload you put in there during login, and attaches it to the request object (usually accessible via `request.user`).
4. **The Controller:** Now your controller takes over. It grabs the `userId` from the verified token, asks Sequelize to find the user by that ID, and sends the user's data (name, email) back to the client. *(Important: Make sure you delete the password from the object before sending it back!)*

---

### The Complete Route Blueprint

Here is how you should organize your files inside `src/routes/` and `src/controllers/`, and exactly what each route needs to do.

#### 1. `auth.routes.ts` & `auth.controller.ts`

*(Prefix: `/auth`)*

* **`POST /register`**
  * **Inputs:** Body requires `name`, `email`, `password`.
  * **Action:** Checks for duplicate email, hashes password, creates DB row.
  * **Outputs:** 201 Status, Success message, and the new User's ID.
* **`POST /login`**
  * **Inputs:** Body requires `email`, `password`.
  * **Action:** Finds user, compares hashed password, signs a JWT.
  * **Outputs:** 200 Status, Success message, and the JWT string.
* **`GET /me`**
  * **Inputs:** Requires valid JWT in the Authorization header.
  * **Action:** Verifies token, fetches user from DB based on token's payload.
  * **Outputs:** User profile object (excluding the password).

#### 2. `title.routes.ts` & `title.controller.ts`

*(Prefix: `/titles`)*

* **`GET /search`**
  * **Inputs:** URL Query parameter `?q=`.
  * **Action:** Uses `Op.iLike` to search `primaryTitle`. Optionally includes Ratings table.
  * **Outputs:** Array of matching Title objects.
* **`GET /top-rated`**
  * **Inputs:** Optional query parameters for pagination (`?limit=50`).
  * **Action:** Joins Title and Rating tables, sorts by `averageRating` and `numVotes` in descending order.
  * **Outputs:** Array of the highest-rated Title objects.
* **`GET /:id`**
  * **Inputs:** URL parameter (the `tconst` string, e.g., `/titles/tt0111161`).
  * **Action:** Fetches a single Title by ID. Includes the Rating table, and includes the Person table (via CastCrew junction) to get the actors/directors.
  * **Outputs:** A single, massive, detailed Movie object.

#### 3. `person.routes.ts` & `person.controller.ts`

*(Prefix: `/people`)*

* **`GET /search`**
  * **Inputs:** URL Query parameter `?q=`.
  * **Action:** Uses `Op.iLike` to search `primaryName`.
  * **Outputs:** Array of matching Person objects.
* **`GET /:id`**
  * **Inputs:** URL parameter (the `nconst` string).
  * **Action:** Fetches a single Person by ID.
  * **Outputs:** A single Person object (name, birth year, profession).
* **`GET /:id/credits`**
  * **Inputs:** URL parameter (the `nconst` string).
  * **Action:** Uses the CastCrew junction table to find all Titles where this Person worked.
  * **Outputs:** Array of Movie objects this person was involved in.

#### 4. `watchlist.routes.ts` & `watchlist.controller.ts`

*(Prefix: `/watchlist`)*
*(Note: EVERY route in this file requires a valid JWT in the header to identify the user).*

* **`GET /`**
  * **Inputs:** JWT Header.
  * **Action:** Uses token's `userId` to query the Watchlist table, joining the Title table to get the movie details.
  * **Outputs:** Array of Movies the user has saved.
* **`POST /:titleId`**
  * **Inputs:** JWT Header, URL parameter (`titleId`).
  * **Action:** Uses token's `userId` and the URL's `titleId` to create a new row in the Watchlist table. Checks if it's already there to prevent duplicates.
  * **Outputs:** 201 Status, Success message.
* **`DELETE /:titleId`**
  * **Inputs:** JWT Header, URL parameter (`titleId`).
  * **Action:** Finds the Watchlist row matching the `userId` and `titleId` and deletes it.
  * **Outputs:** 200 Status, Success message.
