import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../../src/app.js';

describe('Person Routes', () => {

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
        expect(body.success, 'Search response did not return success: true.').toBe(true);
        expect(Array.isArray(body.results), 'The server must return an array for search results.').toBe(true);
    });

    it('2. Should fetch a person by their ID', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/people/nm0000151'
        });

        const body = response.json();

        expect(response.statusCode, `Fetch person by ID failed. Expected status 200, but got ${response.statusCode}. If 404, verify that nm0000151 exists in the dataset.`).toBe(200);
        expect(body.person, 'The response body is missing the "person" payload.').toBeDefined();
        expect(body.person.nconst, 'The retrieved nconst ID does not match the requested ID.').toBe('nm0000151');
    });

    it('3. Should return a 404 for a fake person ID', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/people/nm9999999999999'
        });

        expect(response.statusCode, `Validation failure. Expected status 404 for a non-existent ID, but received ${response.statusCode}.`).toBe(404);
        expect(response.json().error, 'The server should return a specific "Person not found" error string.').toBe('Person not found');
    });

    it('4. Should fetch the movie credits for a person', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/people/nm0000151/credits'
        });

        const body = response.json();

        expect(response.statusCode, `Credits query failed. Expected 200, but received ${response.statusCode}. Check the junction table associations.`).toBe(200);
        expect(body.person, 'The response body is missing the "person" payload.').toBeDefined();
        expect(body.credits, 'Association Failure: The Person object is missing the nested Titles array from the CastCrew junction table.').toBeDefined();
        expect(Array.isArray(body.credits), 'The nested Titles property must be formatted as an array.').toBe(true);

        if (body.credits.length > 0){
            expect(body.credits[0].Title, 'The CastCrew row must include the nexted Title object').toBeDefined();
        }
    });
});