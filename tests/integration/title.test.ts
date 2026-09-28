import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../../src/app.js';

describe('Title Routes (TMDB-backed)', () => {

    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('1. Should be able to search for a title using its name', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/titles/search?q=superman',
        });

        const body = response.json();

        expect(response.statusCode, `Title search failed. Expected status 200, but received ${response.statusCode}. Check TMDB_ACCESS_TOKEN and network access.`).toBe(200);
        expect(Array.isArray(body.results), 'TMDB search response should include a results array.').toBe(true);
        expect(body.results.length, 'Expected at least one result for "superman".').toBeGreaterThan(0);
        expect(body.results[0].id, 'Each result should have a TMDB numeric id.').toBeDefined();
    });

    it('2. Should be able to find a title using its TMDB ID', async () => {
        // 278 = The Shawshank Redemption
        const response = await app.inject({
            method: 'GET',
            url: '/titles/278'
        });

        const body = response.json();

        expect(response.statusCode, `Fetch by ID failed. Expected status 200, but got ${response.statusCode}.`).toBe(200);
        expect(body.id, 'The response body is missing the movie id.').toBe(278);
        expect(body.title, 'Expected the movie title to be returned.').toContain('Shawshank');
        expect(body.credits, 'Movie details should include appended credits.').toBeDefined();
    });

    it('3. Should return a 404 for a non-existent TMDB movie ID', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/titles/999999999'
        });

        expect(response.statusCode, `Expected 404 for a non-existent TMDB ID, but received ${response.statusCode}.`).toBe(404);
    });

    it('4. Should be able to find the top rated titles', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/titles/top-rated'
        });

        const body = response.json();
        const results = body.results;

        expect(response.statusCode, `Top-rated query failed. Expected 200, but received ${response.statusCode}.`).toBe(200);
        expect(results.length, 'The top-rated query returned an empty results array.').toBeGreaterThan(0);

        const allRated = results.every((m: any) => typeof m.vote_average === 'number' && m.vote_average > 0);
        expect(allRated, 'Every top-rated result should include a numeric vote_average.').toBe(true);
    });
});