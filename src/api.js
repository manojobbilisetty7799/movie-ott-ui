import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export async function searchMovies(query) {
    const response = await axios.get(`${API_BASE_URL}/movies/search`, {
        params: { query },
    });
    return response.data;
}

export async function getMovieDetails(tmdbId) {
    const response = await axios.get(`${API_BASE_URL}/movies/${tmdbId}`);
    return response.data;
}
