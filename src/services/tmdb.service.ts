import TmdbError from '../errors/Tmdb.error.js';


const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

async function tmdbFetch<T>(path: string, params: Record<string, string| number> = {}): Promise<T>{
    const token = process.env.TMDB_ACCESS_TOKEN;
    if (!token){
        throw new Error('TMDB_ACCESS_TOKEN is not set');

    }
    const url = new URL(`${TMDB_BASE_URL}${path}`);
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
    }
    const response = await fetch(url, {
        headers:{
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        }
    });

    if (!response.ok){
        if (response.status === 404){
            throw new TmdbError(404, 'Not found');
        }
        const body = await response.text();
        throw new TmdbError(response.status, `TMDB request failed: ${body}`);

    }
    const data = response.json() as Promise<T>

    return data;

}

export const tmdb = {
    searchMovies: (query: string, page: number) =>
        tmdbFetch('/search/movie', { query, page, include_adult: 'false' }),

    getMovieById: (id: string) =>
        tmdbFetch(`/movie/${id}`, { append_to_response: 'credits' }),

    getTopRatedMovies: (page: number) =>
        tmdbFetch('/movie/top_rated', { page }),

    searchPeople: (query: string, page: number) =>
        tmdbFetch('/search/person', { query, page, include_adult: 'false' }),

    getPersonById: (id: string) =>
        tmdbFetch(`/person/${id}`),

    getPersonMovieCredits: (id: string) =>
        tmdbFetch(`/person/${id}/movie_credits`)
};