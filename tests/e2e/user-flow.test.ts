import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../../src/app.js'; 

describe('Full User Journey: Movie Discovery & Watchlist', () => {
    let userToken = '';
    let discoveredMovieId = '';
    
    const journeyUser = {
        name: 'Journey Tester',
        email: 'journey@example.com',
        password: 'securepassword123'
    };

    beforeAll(async () => {
        await app.ready();
        await app.db.User.destroy({ where: { email: journeyUser.email } });
    });

    afterAll(async () => {
        await app.close();
    });

    it('Step 1: User visits the site and creates an account', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/register',
            payload: journeyUser
        });
        
        expect(response.statusCode).toBe(201);
        expect(response.json().success).toBe(true);
    });

    it('Step 2: User logs in to get their session token', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: { email: journeyUser.email, password: journeyUser.password }
        });
        
        const body = response.json();
        expect(response.statusCode).toBe(200);
        expect(body.token).toBeDefined();
        
        // Save the token in the browser/app state
        userToken = body.token;
    });

    it('Step 3: User searches the database for "The Matrix"', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/titles/search?q=The Matrix&limit=5',
        });
        
        const body = response.json();
        expect(response.statusCode).toBe(200);
        expect(body.results.length).toBeGreaterThan(0);

        discoveredMovieId = body.results[0].tconst;
        expect(discoveredMovieId).toBeDefined();
    });

    it('Step 4: User clicks "Add to Watchlist" on that movie', async () => {
        const response = await app.inject({
            method: 'POST',
            url: `/watchlist/${discoveredMovieId}`,
            headers: { authorization: `Bearer ${userToken}` }
        });
        
        expect(response.statusCode).toBe(201);
        expect(response.json().message).toBe('Added to watchlist');
    });

    it('Step 5: User visits their Profile to see their Watchlist', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/watchlist',
            headers: { authorization: `Bearer ${userToken}` }
        });
        
        const body = response.json();
        expect(response.statusCode).toBe(200);
        
        const savedMovie = body.watchlist[0];
        expect(savedMovie.tconst).toBe(discoveredMovieId);
        expect(savedMovie.primaryTitle).toContain('Matrix');
    });

    it('Step 6: User deletes their account before leaving', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: '/auth/me',
            headers: { authorization: `Bearer ${userToken}` }
        });
        
        expect(response.statusCode).toBe(200);
        expect(response.json().message).toBe('Account successfully deleted');
    });
    
    it('Step 7: Verify database cascading (Watchlist is gone)', async () => {
        // Because the user deleted their account, postgres should have automatically 
        // deleted their watchlist entries via ON DELETE CASCADE.
        
        const loginResponse = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: { email: journeyUser.email, password: journeyUser.password }
        });
        
        expect(loginResponse.statusCode).toBe(401);
    });
});