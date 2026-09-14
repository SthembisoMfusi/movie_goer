import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../../src/app.js';

describe('Authentication Routes', () => {
    let authToken = '';

    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    };

    beforeAll(async () => {
        await app.ready();
        await app.db.User.destroy({ where: { email: testUser.email } });
    });

    afterAll(async () => {
        await app.close();
    });

    it('1. Should register a new user', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/register',
            payload: testUser
        });

        const body = response.json();

        expect(response.statusCode, `Registration failed. Expected status 201 Created, but received ${response.statusCode}. Error message from server: ${body.error}`).toBe(201);
        expect(body.success, 'The response object did not return success: true. Check if the controller is formatting the response correctly.').toBe(true);
        expect(body.userId, 'The server failed to return the newly generated userId from the database.').toBeDefined();
    });

    it('2. Should prevent duplicate email registration', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/register',
            payload: testUser
        });

        const body = response.json();

        expect(response.statusCode, `Duplicate prevention failed. Expected 409 Conflict, but got ${response.statusCode}. The server might have allowed the duplicate or crashed entirely.`).toBe(409);
        expect(body.error, 'Expected the server to explicitly return an "Email is already in use" error message in the body.').toBe('Email is already in use');
    });

    it('3. Should login the user and return a JWT', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: { email: testUser.email, password: testUser.password }
        });

        const body = response.json();

        expect(response.statusCode, `Login failed. Expected status 200, but got ${response.statusCode}. The credentials might be wrong or the server crashed. Error: ${body.error}`).toBe(200);
        expect(body.success, 'Login response did not return success: true.').toBe(true);
        expect(body.token, 'The server authenticated the user but failed to return a JWT token in the response payload.').toBeDefined();

        authToken = body.token;
    });

    it('4. Should fail to login with wrong password', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: { email: testUser.email, password: 'wrongpassword' }
        });

        const body = response.json();

        expect(response.statusCode, `Security flaw: Expected status 401 Unauthorized for a bad password, but received ${response.statusCode}.`).toBe(401);
        expect(body.error, 'The server should return a generic "Invalid email or password" error to prevent user enumeration.').toBe('Invalid email or password');
    });

    it('5. Should fetch /auth/me with a valid token', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/auth/me',
            headers: { authorization: `Bearer ${authToken}` }
        });

        const body = response.json();

        expect(response.statusCode, `Token validation failed. Expected 200, but got ${response.statusCode}. The token might be expired, malformed, or the header was incorrectly formatted.`).toBe(200);
        expect(body.success, 'Response should indicate success: true when fetching profile.').toBe(true);
        expect(body.user.email, `The returned profile email does not match the token's owner. Expected ${testUser.email} but got ${body.user?.email}.`).toBe(testUser.email);
        expect(body.user.password, 'Critical Data Leak: The server returned the hashed password in the profile object. Ensure attributes are strictly defined in the query.').toBeUndefined();
    });
});