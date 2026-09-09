import { describe, it, expect, beforeAll, afterAll} from 'vitest';
import { app } from '../src/app.js';

describe('Title routes', ()=> {
    beforeAll(async () => {
        await app.ready();
    });
    afterAll( async ()=> {
        await app.close();
    })
    it('1. Should be able to search for a title using its name', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/title/search?q=The+Dark+Knight',
        })
        const body = response.json();
        expect(response.statusCode, `Expected to get a 200 status code but got this ${response.statusCode}`).toBe(200);
        expect(body.sucess, `Expected it to be true`).toBe(true);
    })

})