const tap = require('tap');
const supertest = require('supertest');
const app = require('../app');
const server = supertest(app);

// Generate unique email and name per test run to avoid conflicts
const uniqueId = Date.now();
const mockUser = {
    name: `Clark Kent ${uniqueId}`,
    email: `clark${uniqueId}@superman.com`,
    password: 'Krypt()n8',
    preferences:['movies', 'comics']
};

let token = '';

// Auth tests

tap.test('POST /api/auth/register', async (t) => {
    const response = await server.post('/api/auth/register').send(mockUser);
    t.equal(response.status, 200);
    t.end();
});

tap.test('POST /api/auth/register with missing email', async (t) => {
    const response = await server.post('/api/auth/register').send({
        name: mockUser.name,
        password: mockUser.password
    });
    t.equal(response.status, 400);
    t.end();
});

tap.test('POST /api/auth/login', async (t) => {
    const response = await server.post('/api/auth/login').send({
        email: mockUser.email,
        password: mockUser.password
    });
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'token');
    token = response.body.token;
    t.end();
});

tap.test('POST /api/auth/login with wrong password', async (t) => {
    const response = await server.post('/api/auth/login').send({
        email: mockUser.email,
        password: 'wrongpassword'
    });
    t.equal(response.status, 401);
    t.end();
});

// Preferences tests

tap.test('GET /api/users/preferences', async (t) => {
    const response = await server.get('/api/users/preferences').set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'preferences');
    t.same(response.body.preferences, mockUser.preferences);
    t.end();
});

tap.test('GET /api/users/preferences without token', async (t) => {
    const response = await server.get('/api/users/preferences');
    t.equal(response.status, 401);
    t.end();
});

tap.test('PUT /api/users/preferences', async (t) => {
    const response = await server.put('/api/users/preferences').set('Authorization', `Bearer ${token}`).send({
        preferences: ['movies', 'comics', 'games']
    });
    t.equal(response.status, 200);
});

tap.test('Check PUT /api/users/preferences', async (t) => {
    const response = await server.get('/api/users/preferences').set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.same(response.body.preferences, ['movies', 'comics', 'games']);
    t.end();
});

// News tests

tap.test('GET /api/news', async (t) => {
    const response = await server.get('/api/news').set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'news');
    t.end();
});

tap.test('GET /api/news without token', async (t) => {
    const response = await server.get('/api/news');
    t.equal(response.status, 401);
    t.end();
});



tap.teardown(() => {
    process.exit(0);
});