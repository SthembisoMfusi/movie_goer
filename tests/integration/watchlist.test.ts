import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../../src/app.js';

describe('Watchlist Routes', () => {
    let authToken = '';
    let testUserId: number;
    const testMovieId = 'tt0111161'; // The Shawshank Redemption

    const testUser = {
        name: 'Watchlist Tester',
        email: 'watchlist@example.com',
        password: 'password123'
    };

    beforeAll(async () => {
        await app.ready();

        await app.db.User.destroy({ where: { email: testUser.email } });


        const registerRes = await app.inject({
            method: 'POST',
            url: '/auth/register',
            payload: testUser
        });
        testUserId = registerRes.json().userId;

        const loginRes = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: { email: testUser.email, password: testUser.password }
        });
        authToken = loginRes.json().token;
    });

    afterAll(async () => {
        if (testUserId) {
            await app.db.User.destroy({ where: { id: testUserId } });
        }
        await app.close();
    });

    it('1. Should reject watchlist requests without a valid token', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/watchlist'
        });

        expect(response.statusCode, `Security failure. Expected 401 Unauthorized for a request without a token, but got ${response.statusCode}`).toBe(401);
    });

    it('2. Should add a movie to the user\'s watchlist', async () => {
        const response = await app.inject({
            method: 'POST',
            url: `/watchlist/${testMovieId}`,
            headers: { authorization: `Bearer ${authToken}` }
        });

        const body = response.json();

        expect(response.statusCode, `Add to watchlist failed. Expected 201 Created, but got ${response.statusCode}. Error: ${body.error}`).toBe(201);
        expect(body.success, 'Response should indicate success: true.').toBe(true);
    });

    it('3. Should prevent adding the exact same movie twice', async () => {
        const response = await app.inject({
            method: 'POST',
            url: `/watchlist/${testMovieId}`,
            headers: { authorization: `Bearer ${authToken}` }
        });

        const body = response.json();

        expect(response.statusCode, `Duplicate prevention failed. Expected 409 Conflict, but got ${response.statusCode}.`).toBe(409);
        expect(body.error, 'Expected a specific error message about the movie already being in the watchlist.').toBe('Movie is already in your watchlist');
    });

    it('4. Should fetch the user\'s populated watchlist', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/watchlist',
            headers: { authorization: `Bearer ${authToken}` }
        });

        const body = response.json();
        const watchlist = body.watchlist;

        expect(response.statusCode, `Fetch watchlist failed. Expected 200, got ${response.statusCode}`).toBe(200);
        expect(Array.isArray(watchlist), 'The watchlist payload should be an array.').toBe(true);
        expect(watchlist.length, 'The watchlist should contain the 1 movie we just added.').toBe(1);
        expect(watchlist[0].tconst, 'The movie in the watchlist should match the requested test movie ID.').toBe(testMovieId);
    });

    it('5. Should remove a movie from the user\'s watchlist', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: `/watchlist/${testMovieId}`,
            headers: { authorization: `Bearer ${authToken}` }
        });

        const body = response.json();

        expect(response.statusCode, `Remove from watchlist failed. Expected 200, got ${response.statusCode}. Error: ${body.error}`).toBe(200);
        expect(body.success, 'Response should indicate success: true upon deletion.').toBe(true);
    });

    it('6. Should return a 404 when trying to delete a movie not in the watchlist', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: `/watchlist/${testMovieId}`,
            headers: { authorization: `Bearer ${authToken}` }
        });

        const body = response.json();

        expect(response.statusCode, `Validation failure. Expected 404 when deleting a non-existent watchlist item, but got ${response.statusCode}`).toBe(404);
        expect(body.error, 'Expected a specific error message about the movie not being found.').toBe('Movie not found in your watchlist');
    });

    it('7. Should verify the watchlist is now empty', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/watchlist',
            headers: { authorization: `Bearer ${authToken}` }
        });

        const body = response.json();


        expect(response.statusCode, `Fetch watchlist failed. Expected 200, got ${response.statusCode}`).toBe(200);
        expect(body.watchlist.length, 'The watchlist should be completely empty after the deletion test.').toBe(0);
    });
});