import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../../src/app.js';

describe('Title Routes', () => {

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

        expect(response.statusCode, `Title search failed. Expected status 200, but received ${response.statusCode}. Check database connection or Trigram index.`).toBe(200);
        expect(body.success, 'Search response did not return success: true.').toBe(true);
        expect(Array.isArray(body.results), 'The results property should be returned as an array, even if empty.').toBe(true);
    });

    it('2. Should be able to find a title using its ID', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/titles/tt0111161'
        });

        const body = response.json();

        expect(response.statusCode, `Fetch by ID failed. Expected status 200, but got ${response.statusCode}. If 404, ensure movie tt0111161 exists in the dataset.`).toBe(200);
        expect(body.title, 'The response body is missing the "title" object payload.').toBeDefined();
        expect(body.title.tconst, 'The retrieved title ID does not match the requested ID.').toBe('tt0111161');
    });

    it('3. Should be able to find the top rated titles', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/titles/top-rated'
        });

        const body = response.json();
        const titles = body.topRatedTitles;

        expect(response.statusCode, `Top-rated query failed. Expected 200, but received ${response.statusCode}.`).toBe(200);
        expect(titles.length, 'The top-rated query returned an empty array. Ensure the ratings table is populated.').toBeGreaterThan(0);

        const allHighlyRated = titles.every((t: any) => t.Rating && t.Rating.averageRating >= 8.0);
        expect(allHighlyRated, 'Query logic failure: One or more titles returned in the top-rated list had a rating below 8.0 or lacked a Rating object entirely.').toBe(true);
    });
});