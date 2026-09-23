// Static TMDB-shaped fixtures used by the mocked fetch in tests.
// IDs match real TMDB IDs so the data reads sensibly, but nothing here
// makes a live network call.

export const movie278 = {
    id: 278,
    title: 'The Shawshank Redemption',
    original_title: 'The Shawshank Redemption',
    overview: 'Framed for a murder he did not commit, a banker is sent to a corrupt prison.',
    release_date: '1994-09-23',
    poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    backdrop_path: '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    genre_ids: [18, 80],
    genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
    vote_average: 8.7,
    vote_count: 26000,
    popularity: 90.2,
    adult: false,
    original_language: 'en',
    runtime: 142,
    status: 'Released',
    tagline: 'Fear can hold you prisoner. Hope can set you free.',
    budget: 25000000,
    revenue: 16000000,
    credits: {
        cast: [
            { id: 504, name: 'Tim Robbins', character: 'Andy Dufresne', profile_path: null, order: 0 },
            { id: 192, name: 'Morgan Freeman', character: "Ellis Boyd 'Red' Redding", profile_path: '/oIciQWr8VwKoR8TmAw1owaiZFyb.jpg', order: 1 }
        ],
        crew: [
            { id: 578, name: 'Frank Darabont', job: 'Director', department: 'Directing', profile_path: null }
        ]
    }
};

export const movie603 = {
    id: 603,
    title: 'The Matrix',
    original_title: 'The Matrix',
    overview: 'A computer hacker learns the shocking truth about his reality.',
    release_date: '1999-03-30',
    poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdrop_path: null,
    genre_ids: [28, 878],
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }],
    vote_average: 8.2,
    vote_count: 24000,
    popularity: 80.1,
    adult: false,
    original_language: 'en',
    runtime: 136,
    status: 'Released',
    tagline: 'Welcome to the Real World.',
    budget: 63000000,
    revenue: 463517383,
    credits: { cast: [], crew: [] }
};

export const moviesSearchSuperman = {
    page: 1,
    results: [
        {
            id: 1924,
            title: 'Superman',
            original_title: 'Superman',
            overview: 'An alien orphan is sent from his dying planet to Earth.',
            release_date: '1978-12-15',
            poster_path: '/gxJRLxWLbfxbaBM3aTKr7yWLKJ0.jpg',
            backdrop_path: null,
            genre_ids: [878, 12],
            vote_average: 7.1,
            vote_count: 3500,
            popularity: 30.4,
            adult: false,
            original_language: 'en'
        }
    ],
    total_pages: 1,
    total_results: 1
};

export const moviesSearchMatrix = {
    page: 1,
    results: [
        {
            id: movie603.id,
            title: movie603.title,
            original_title: movie603.original_title,
            overview: movie603.overview,
            release_date: movie603.release_date,
            poster_path: movie603.poster_path,
            backdrop_path: movie603.backdrop_path,
            genre_ids: movie603.genre_ids,
            vote_average: movie603.vote_average,
            vote_count: movie603.vote_count,
            popularity: movie603.popularity,
            adult: false,
            original_language: 'en'
        }
    ],
    total_pages: 1,
    total_results: 1
};

export const movieTopRated = {
    page: 1,
    results: [
        { id: 278, title: 'The Shawshank Redemption', vote_average: 8.7, vote_count: 26000, popularity: 90.2, release_date: '1994-09-23', overview: '', poster_path: null, backdrop_path: null, genre_ids: [18], adult: false, original_language: 'en', original_title: 'The Shawshank Redemption' },
        { id: 238, title: 'The Godfather', vote_average: 8.7, vote_count: 20000, popularity: 85.0, release_date: '1972-03-14', overview: '', poster_path: null, backdrop_path: null, genre_ids: [18, 80], adult: false, original_language: 'en', original_title: 'The Godfather' }
    ],
    total_pages: 1,
    total_results: 2
};

export const personSearchMorgan = {
    page: 1,
    results: [
        { id: 192, name: 'Morgan Freeman', profile_path: '/oIciQWr8VwKoR8TmAw1owaiZFyb.jpg', known_for_department: 'Acting', popularity: 45.2 }
    ],
    total_pages: 1,
    total_results: 1
};

export const person192 = {
    id: 192,
    name: 'Morgan Freeman',
    profile_path: '/oIciQWr8VwKoR8TmAw1owaiZFyb.jpg',
    known_for_department: 'Acting',
    popularity: 45.2,
    biography: 'Morgan Freeman is an American actor and film narrator.',
    birthday: '1937-06-01',
    deathday: null,
    place_of_birth: 'Memphis, Tennessee, USA'
};

export const person192Credits = {
    id: 192,
    cast: [
        { id: 278, title: 'The Shawshank Redemption', character: "Ellis Boyd 'Red' Redding", release_date: '1994-09-23', vote_average: 8.7, overview: '', poster_path: null, backdrop_path: null, genre_ids: [18, 80], adult: false, original_language: 'en', original_title: 'The Shawshank Redemption', vote_count: 26000, popularity: 90.2 }
    ],
    crew: []
};

export const notFound = {
    success: false,
    status_code: 34,
    status_message: 'The resource you requested could not be found.'
};