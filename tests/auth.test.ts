import { describe, it, expect, beforeAll, afterAll} from 'vitest';
import { app } from '../src/app.js';


describe('Authentication Routes', () =>{
    let authToken = '';
    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    };
    beforeAll( async () =>{
        await app.ready();
        await app.db.User.destroy({ where: { email: testUser.email}});

    });

    afterAll( async () => {
        await app.close();
    });

    it('1. Should register a new user', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/register',
            payload: testUser
        })
        const body = response.json()
        expect(response.statusCode, `Expected 201, but got ${response.statusCode}. Error: ${body.error}`).toBe(201);

        expect(body.success, 'The response should have success: true').toBe(true);
        
        expect(body.userId, 'The database should have returned a new userId').toBeDefined();
        })
    it('2. Should prevent duplicate email registration', async () =>{
        const response = await app.inject({
            method: 'POST',
            url: '/auth/register',
            payload: testUser 
        });

        const body = response.json();

        expect(response.statusCode, `Expected 409 but got ${response.statusCode}`).toBe(409); 
        expect(body.error,'Expected to recieve an error body').toBe('Email is already in use');
    })
    it('3. Should login the user and return a JWT', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: {
                email: testUser.email,
                password: testUser.password
            }
        });

        const body = response.json();

        expect(response.statusCode, `Expected to get 200 for successful log in but got ${response.statusCode}: Error ${body.error}`).toBe(200);
        expect(body.success, `Expected success to be true but recieved false.`).toBe(true);
        expect(body.token, `Expected to recieve a JWT token.`).toBeDefined();

        authToken = body.token;
    });
     it('4. Should fail to login with wrong password', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: {
                email: testUser.email,
                password: 'wrongpassword'
            }
        });

        expect(response.statusCode, `Expected to fail to log in.`).toBe(401);
        expect(response.json().error, `Expected an error message`).toBe('Invalid email or password');
    });

    it('5. Should fetch /auth/me with a valid token', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/auth/me',
            headers: {
                
                authorization: `Bearer ${authToken}`
            }
        });

        const body = response.json();

        expect(response.statusCode, `Expected status code to be 200 but got ${response.statusCode}: Error ${body.error}`).toBe(200);
        expect(body.success, `Expected success to be true`).toBe(true);
        expect(body.user.email, `Expected the fetched email to match the users email`).toBe(testUser.email);
        expect(body.user.password,`Expected the result to not come with the users password in the object`).toBeUndefined(); 
    });
});