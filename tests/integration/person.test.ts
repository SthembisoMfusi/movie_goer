import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../../src/app.js';

describe('Person Routes (TMDB-backed)', () => {

    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('1. Should search for an actor by name', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/people/search?q=morgan freeman',
        });

        const body = response.json();

        expect(response.statusCode, `Person search failed. Expected status 200, but received ${response.statusCode}.`).toBe(200);
        expect(Array.isArray(body.results), 'The server must return an array for search results.').toBe(true);
        expect(body.results.length, 'Expected at least one result for "morgan freeman".').toBeGreaterThan(0);
    });

    it('2. Should fetch a person by their TMDB ID', async () => {
        // 192 = Morgan Freeman
        const response = await app.inject({
            method: 'GET',
            url: '/people/192'
        });

        const body = response.json();

        expect(response.statusCode, `Fetch person by ID failed. Expected status 200, but got ${response.statusCode}.`).toBe(200);
        expect(body.id, 'The response is missing the TMDB person id.').toBe(192);
        expect(body.name, 'Expected the person\'s name to be returned.').toContain('Morgan Freeman');
    });

    it('3. Should return a 404 for a fake person ID', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/people/999999999'
        });

        expect(response.statusCode, `Expected status 404 for a non-existent ID, but received ${response.statusCode}.`).toBe(404);
        expect(response.json().error, 'The server should return a specific "Person not found" error string.').toBe('Person not found');
    });

    it('4. Should fetch the movie credits for a person', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/people/192/credits'
        });

        const body = response.json();

        expect(response.statusCode, `Credits query failed. Expected 200, but received ${response.statusCode}.`).toBe(200);
        expect(body.person, 'The response body is missing the "person" payload.').toBeDefined();
        expect(body.credits, 'The response body is missing the "credits" payload.').toBeDefined();
        expect(Array.isArray(body.credits.cast), 'credits.cast must be an array.').toBe(true);

        if (body.credits.cast.length > 0) {
            expect(body.credits.cast[0].title, 'Each cast credit should include the movie title.').toBeDefined();
        }
    });
});