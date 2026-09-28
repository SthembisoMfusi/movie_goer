import { vi, beforeAll, afterAll } from 'vitest';
import {
    movie278,
    movie603,
    moviesSearchSuperman,
    moviesSearchMatrix,
    movieTopRated,
    personSearchMorgan,
    person192,
    person192Credits,
    notFound
} from '../fixtures/tmdb.js';

function jsonResponse(body: unknown, status = 200): Response {
    return {
        ok: status >= 200 && status < 300,
        status,
        json: async () => body,
        text: async () => JSON.stringify(body)
    } as Response;
}

const NOT_FOUND = () => Promise.resolve(jsonResponse(notFound, 404));

async function mockFetch(input: string | URL): Promise<Response> {
    const url = new URL(typeof input === 'string' ? input : input.toString());
    const path = url.pathname; // e.g. /3/movie/278
    const query = (url.searchParams.get('query') ?? '').toLowerCase();

    if (path === '/3/search/movie') {
        if (query.includes('superman')) return jsonResponse(moviesSearchSuperman);
        if (query.includes('matrix')) return jsonResponse(moviesSearchMatrix);
        return jsonResponse({ page: 1, results: [], total_pages: 0, total_results: 0 });
    }

    if (path === '/3/movie/top_rated') {
        return jsonResponse(movieTopRated);
    }

    if (path === `/3/movie/${movie278.id}`) return jsonResponse(movie278);
    if (path === `/3/movie/${movie603.id}`) return jsonResponse(movie603);
    if (path.startsWith('/3/movie/')) return NOT_FOUND();

    if (path === '/3/search/person') {
        if (query.includes('morgan')) return jsonResponse(personSearchMorgan);
        return jsonResponse({ page: 1, results: [], total_pages: 0, total_results: 0 });
    }

    if (path === `/3/person/${person192.id}`) return jsonResponse(person192);
    if (path === `/3/person/${person192.id}/movie_credits`) return jsonResponse(person192Credits);
    if (path.startsWith('/3/person/')) return NOT_FOUND();

    throw new Error(`Unmocked TMDB request in tests: ${url.toString()}`);
}

let originalFetch: typeof fetch;

beforeAll(() => {
    originalFetch = global.fetch;
    process.env.TMDB_ACCESS_TOKEN ??= 'test-token';
    vi.stubGlobal('fetch', vi.fn(mockFetch));
});

afterAll(() => {
    vi.unstubAllGlobals();
    global.fetch = originalFetch;
});