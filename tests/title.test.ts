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
            url: '/titles/search?q=superman',
        })
        const body = response.json();
        expect(response.statusCode, `Expected to get a status code 200 but got this ${response.statusCode}`).toBe(200);
        expect(body.success, `Expected it to be true`).toBe(true);
    })
    it('2. Should be able to find a title using its id', async () =>{
        const response = await app.inject({
            method: 'GET',
            url: '/titles/tt1056948'
        })
        const body = response.json();
        expect(response.statusCode, `Expected to get a status code 200 but got this ${response.statusCode}`)
        expect(body.title, `Expected to return the requested title`).toBeDefined();
    })
    it('3. Should be able to find the top rated titles', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/titles/top-rated'
        })
        const body = response.json();
        const titles = body.topRatedTitles;
        const ratings = titles.map(title => ({
            id: title.tconst,
            rating: title.Rating.averageRating
        }))
        ratings.filter(rate => rate.rating >= 8);
        expect(ratings.length === titles.length, `Expected all items returned to be titles with ratings above 8`)
        
    }) 

})