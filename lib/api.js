import axios from 'axios';

const UrlBase =  "https://api.dunddermifflin.com";

/**
 * Obtiene todos los libros con paginación o el resultado de una búsqueda.
 * (Sin cambios)
 */
export const fetchBooks = async (page = 1, limit = 12, query = '') => {
    try {
        let url = `${UrlBase}/books`;
        
        if (query) {
            // ESTA es la URL que se ejecuta para la búsqueda. 
            // Los resultados dependen de cómo tu backend procese 'page' y 'limit'.
            url = `${UrlBase}/books/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
        } else {
            url = `${UrlBase}/books?page=${page}&limit=${limit}`; 
        }

        const response = await axios.get(url);
        return response.data; 
    } catch (error) {
        console.error("Error al obtener o buscar libros:", error);
        throw new Error('No se pudieron obtener los libros de la API.');
    }
}

/**
 * Obtiene un libro por su ID o por un slug basado en su título.
 * NOTA: ASUME que el endpoint de tu API puede manejar un slug como ID, 
 * o que tu backend busca por título si el parámetro no es un ObjectId.
 * @param {string} slugOrId
 */
export const fetchBookById = async (slugOrId) => {
    try {
        // En Next.js, el parámetro en [id].js será el slug
        // El endpoint ahora es: /books/el-padrino-mario-puzo
        const response = await axios.get(`${UrlBase}/books/${slugOrId}`); 
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
            return null; 
        }
        console.error(`Error al buscar libro por slug o ID ${slugOrId}:`, error);
        throw new Error(`Error de conexión al obtener el libro.`);
    }
}