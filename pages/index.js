import { fetchBooks } from '../lib/api';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo, useCallback } from 'react';

// ⭐️ CONSTANTE CLAVE para Session Storage
const PAGE_STORAGE_KEY = 'last_catalog_page';

// Función para crear un slug (sin cambios)
const createSlug = (text) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

// FUNCIÓN DE RANGO DE PAGINACIÓN (Sin cambios)
const getPaginationRange = (currentPage, totalPages, maxVisibleButtons = 5) => {
    if (totalPages <= 1) return [];

    const pages = [];
    const sideButtons = Math.floor((maxVisibleButtons - 1) / 2);

    let startPage = Math.max(1, currentPage - sideButtons);
    let endPage = Math.min(totalPages, currentPage + sideButtons);

    if (endPage - startPage + 1 < maxVisibleButtons) {
        startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }
    if (endPage - startPage + 1 < maxVisibleButtons) {
        endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
    }

    if (currentPage > 1) {
        pages.push({ type: 'prev', number: currentPage - 1, label: '← Anterior' });
    }

    if (startPage > 1) {
        pages.push({ type: 'page', number: 1 });
        if (startPage > 2) {
            pages.push({ type: 'ellipsis', label: '...' });
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push({ type: 'page', number: i });
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pages.push({ type: 'ellipsis', label: '...' });
        }
        pages.push({ type: 'page', number: totalPages });
    }

    if (currentPage < totalPages) {
        pages.push({ type: 'next', number: currentPage + 1, label: 'Siguiente →' });
    }

    return pages;
};

// ---
// Componente del Loader (Adaptado a CSS-in-JS con nuevos estilos)
const Loader = () => (
    <div className="loading-overlay">
        <div className="spinner" />
        <p>Cargando títulos...</p>

        <style jsx>{`
            .loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                /* Fondo semitransparente oscuro para simular el look de carga en un Dark Mode */
                background-color: rgba(18, 18, 18, 0.95); 
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.5rem;
                color: #e50914; /* Color rojo de Netflix */
                z-index: 10;
                transition: opacity 0.5s ease;
                flex-direction: column;
            }
            .spinner {
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid #e50914; /* Rojo de carga */
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin-bottom: 10px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}</style>
    </div>
);

// ---
// COMPONENTE SearchBar MEJORADO (Estilos centrados y oscuros)
const SearchBar = ({ initialQuery }) => {
    const router = useRouter();
    const [query, setQuery] = useState(initialQuery);

    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        const newQuery = query.trim();

        if (newQuery === initialQuery) return;

        // Limpiar el query si está vacío, ir a la página 1
        const newPath = newQuery
            ? `/?q=${encodeURIComponent(newQuery)}&page=1`
            : '/?page=1';

        sessionStorage.removeItem(PAGE_STORAGE_KEY);
        router.push(newPath);
    }, [query, router, initialQuery]);

    const handleClearSearch = useCallback(() => {
        setQuery('');
        sessionStorage.removeItem(PAGE_STORAGE_KEY);
        router.push('/?page=1');
    }, [router]);


    return (
        <div className="search-bar-wrapper">
            <form
                onSubmit={handleSearch}
                className="search-form"
                role="search"
            >
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar por título, autor o ISBN..."
                    aria-label="Término de búsqueda"
                    className="search-input"
                />
                <button
                    type="submit"
                    aria-label="Iniciar búsqueda"
                    className="search-button"
                >
                    Buscar
                </button>

                {initialQuery && (
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        aria-label="Limpiar búsqueda"
                        className="clear-button"
                    >
                        Limpiar (X)
                    </button>
                )}
            </form>
            <style jsx>{`
                .search-bar-wrapper {
                    display: flex;
                    justify-content: center; /* Centrar el formulario */
                    width: 100%;
                }
                .search-form {
                    margin-bottom: 30px;
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    max-width: 800px;
                    width: 100%;
                }
                .search-input {
                    padding: 12px 15px;
                    font-size: 1rem;
                    border-radius: 8px;
                    border: 1px solid #424242; /* Borde oscuro */
                    background-color: #2a2a2a; /* Fondo oscuro */
                    color: #f1f1f1; /* Texto claro */
                    flex-grow: 1;
                    min-width: 150px;
                    transition: border-color 0.3s, box-shadow 0.3s;
                }
                .search-input::placeholder {
                    color: #888;
                }
                .search-input:focus {
                    border-color: #e50914; /* Borde de enfoque rojo */
                    box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.3);
                    outline: none;
                    background-color: #1e1e1e; /* Fondo más oscuro al enfocar */
                }
                .search-button {
                    padding: 12px 20px;
                    font-size: 1rem;
                    border-radius: 8px;
                    border: none;
                    background-color: #e50914; /* Botón principal, estilo Netflix */
                    color: white;
                    cursor: pointer;
                    min-width: 100px;
                    font-weight: bold;
                    transition: background-color 0.2s, transform 0.1s;
                }
                .search-button:hover {
                    background-color: #ff3847; /* Rojo más claro al hacer hover */
                    transform: translateY(-1px);
                }
                .clear-button {
                    padding: 12px 15px;
                    font-size: 1rem;
                    border-radius: 8px;
                    border: 1px solid #555;
                    background-color: #333;
                    color: #fff;
                    cursor: pointer;
                    font-weight: normal;
                    min-width: 120px;
                    transition: background-color 0.2s, border-color 0.2s;
                }
                .clear-button:hover {
                    background-color: #444;
                    border-color: #888;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .search-form {
                        flex-wrap: wrap;
                    }
                    .search-input {
                        order: 1; 
                        flex-basis: 100%;
                        max-width: 100%;
                        margin-bottom: 10px;
                    }
                    .search-button {
                        order: 2; 
                        flex-basis: calc(50% - 5px); 
                        min-width: auto;
                    }
                    .clear-button {
                        order: 3; 
                        flex-basis: calc(50% - 5px); 
                        min-width: auto;
                        margin-left: 0; 
                    }
                }
            `}</style>
        </div>
    );
}

// ---

export default function Home({ booksData, currentPage, totalPages, error, currentQuery }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const books = booksData?.data || [];
    
    // EFECTO 1: Monitorear cambios de ruta (Loading State & Guardar Pág.)
    useEffect(() => {
        const handleStart = (url) => {
            if (url.startsWith('/?page=') || url.startsWith('/?q=')) {
                setIsLoading(true);
            }
        };
        const handleComplete = () => setIsLoading(false);
        
        // Guardar la página actual al hacer clic en una tarjeta de libro
        const savePageAndNavigate = (e) => {
            if (e.target.closest('a[href^="/seeBook/"]')) {
                sessionStorage.setItem(PAGE_STORAGE_KEY, currentPage.toString());
            }
        }

        const grid = document.getElementById('books-grid');
        if (grid) {
            grid.addEventListener('click', savePageAndNavigate);
        }

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
            if (grid) {
                grid.removeEventListener('click', savePageAndNavigate);
            }
        };
    }, [router, currentPage]);

    // EFECTO 2: Redirección al volver a la raíz y Guardar Query
    useEffect(() => {
        if (router.isReady && router.pathname === '/' && !router.query.page && !router.query.q) {
            const lastPage = sessionStorage.getItem(PAGE_STORAGE_KEY);
            
            if (lastPage && parseInt(lastPage, 10) > 1) {
                // Redirigir a la última página con el query de búsqueda si existía
                const lastQuery = sessionStorage.getItem('last_catalog_query') || '';
                const newUrl = lastQuery 
                    ? `/?q=${encodeURIComponent(lastQuery)}&page=${lastPage}`
                    : `/?page=${lastPage}`;

                router.replace(newUrl, undefined, { shallow: false });
                sessionStorage.removeItem(PAGE_STORAGE_KEY);
            }
        }
        
        // Guardar el query actual en sessionStorage al montar o cambiar
        if (currentQuery) {
             sessionStorage.setItem('last_catalog_query', currentQuery);
        } else {
             sessionStorage.removeItem('last_catalog_query');
        }

    }, [router, currentQuery]);

    // OPTIMIZACIÓN: Memoizar el rango de paginación
    const paginationRange = useMemo(() => getPaginationRange(currentPage, totalPages, 5), [currentPage, totalPages]);

    if (error) {
        return (
            <div className="error-container">
                <h1>Error de Carga</h1>
                <p>{error}</p>
                <style jsx>{`
                    .error-container {
                        padding: 50px 30px;
                        color: #e50914;
                        font-family: 'Inter', system-ui, sans-serif;
                        background-color: #141414;
                        min-height: 100vh;
                        color: white;
                    }
                `}</style>
            </div>
        );
    }
    
    return (
        <>
            <Head>
                <title>{currentQuery ? `Resultados: ${currentQuery}` : `lectulandiaa - Pagina  ${currentPage}`}</title>
                <meta name="description" content={currentQuery ? `Resultados de búsqueda para ${currentQuery}.` : `Explora el catálogo de libros, página ${currentPage}.`} />
            </Head>

            <main className="main-content">
                <h1 className="header">
                    Lectulandiaa V2.0
                </h1>

<p style={{ 
    fontSize: '1.1rem', 
    lineHeight: '1.7', 
    color: '#f1f1f1', 
    marginBottom: '20px', 
    textAlign: 'center' // Añadido para centrar el bloque de texto
}}>
    Estamos en desarrollo de la nueva web, colaborando con  
    <a 
        href='https://www.dunddermifflin.com/' 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{
            color: '#e50914', 
            textDecoration: 'underline', 
            fontWeight: '600'
        }}
    > dunddermifflin.com
    </a>. 
    <br/>
    Si gustas unirte a la comunidad podes hacerlo entrando al canal de 
    <a 
        href="https://whatsapp.com/channel/0029Vb6uzDs4dTnIbA3tJU0P" 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{
            color: '#25d366', // Usando el verde de WhatsApp para hacerlo distintivo
            textDecoration: 'underline', 
            fontWeight: '600'
        }}
    > WhatsApp
    </a>.
</p>
                <SearchBar initialQuery={currentQuery} />

                <div className="page-info-container">
                    <p className="page-info">
                        {currentQuery ? 
                            `${booksData?.metadata?.totalCount || 0} resultados para "${currentQuery}". ` : 
                            `Explora ${booksData?.metadata?.totalCount || 0} libros disponibles. `} 
                        Página {currentPage} de {totalPages}.
                    </p>
                </div>
                
                {isLoading && <Loader />}
                
                <div 
                    id="books-grid" 
                    className={`books-grid ${isLoading ? 'loading' : ''}`}
                >
                    {books.length > 0 ? (
                        books.map((book) => {
                            const slug = createSlug(book.titulo);
                            const uniqueSlug = `${slug}-${book._id}`; 

                            return (
                                <Link 
                                    key={book._id} 
                                    href={`/seeBook/${uniqueSlug}`} 
                                    legacyBehavior
                                    prefetch={!isLoading}
                                >
                                    <a className="book-card" aria-label={`Ver detalles de ${book.titulo}`}>
                                        <div className="book-cover-wrapper">
                                            {book.portada && (
                                                <img 
                                                    src={book.portada} 
                                                    alt={`Portada del libro: ${book.titulo}`} 
                                                    className="book-cover"
                                                    loading="lazy" 
                                                    width="260" 
                                                    height="350"
                                                />
                                            )}
                                        </div>
                                        
                                        <div className="card-content">
                                            <h2 className="card-title" title={book.titulo}>
                                                {book.titulo}
                                            </h2>
                                            <p className="card-author">
                                                {book.autor}
                                            </p>
                                        </div>
                                    </a>
                                </Link>
                            )
                        })
                    ) : (
                        <p className="no-results">
                            No se encontraron títulos que coincidan con la búsqueda {currentQuery}. Intenta con otros términos.
                        </p>
                    )}
                </div>

                <div className="pagination-container">
                    {paginationRange.map((item, index) => {
                        const key = `${item.type}-${item.number || index}`;
                        
                        if (item.type === 'ellipsis') {
                            return <span key={key} className="ellipsis" aria-hidden="true">{item.label}</span>;
                        }
                        
                        const isCurrent = item.number === currentPage;
                        const isNavigation = item.type === 'prev' || item.type === 'next';

                        const isDisabled = (item.type === 'prev' && currentPage === 1) || 
                                             (item.type === 'next' && currentPage === totalPages);

                        const newHref = currentQuery 
                            ? `/?q=${encodeURIComponent(currentQuery)}&page=${item.number}`
                            : `/?page=${item.number}`;
                        
                        if (isDisabled) {
                            return (
                                <span 
                                    key={key} 
                                    className={`pagination-link ${isNavigation ? 'navigation' : ''} disabled`}
                                    aria-disabled="true"
                                >
                                    {item.label || item.number}
                                </span>
                            );
                        }

                        return (
                            <Link 
                                key={key} 
                                href={newHref} 
                                legacyBehavior
                                prefetch={!isCurrent && item.type === 'page'}
                            >
                                <a 
                                    onClick={(e) => isLoading ? e.preventDefault() : null}
                                    className={`pagination-link ${isCurrent ? 'current' : ''} ${isNavigation ? 'navigation' : ''} ${isLoading ? 'loading-link' : ''}`}
                                    aria-current={isCurrent ? "page" : undefined}
                                >
                                    {item.label || item.number}
                                </a>
                            </Link>
                        )
                    })}
                </div>
            </main>

            {/* Estilos Globales y de Componente */}
            <style jsx global>{`
                /* Dark Mode Base */
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #141414; /* Fondo oscuro, similar a Netflix */
                    color: #e5e5e5; /* Texto claro */
                    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
                /* Para que los strong en page-info sean visibles en dark mode */
                .page-info :global(strong) {
                    color: #fff !important; 
                }
            `}</style>
            <style jsx>{`
                /* --- Contenedor Principal --- */
                .main-content {
                    padding: 50px 3vw; /* Usar vista de ancho para responsive */
                    max-width: 1400px;
                    margin: 0 auto;
                    background-color: #141414; 
                    min-height: 100vh;
                    position: relative;
                }

                /* --- Títulos y Mensajes --- */
                .header {
                    color: #fff; 
                    margin-bottom: 40px;
                    font-size: clamp(2.5rem, 5vw, 3.5rem); /* Título responsive */
                    font-weight: 700; 
                    text-align: center; /* Centrado para un look más moderno/plataforma */
                    line-height: 1.1;
                    padding-top: 10px;
                }
                .page-info-container {
                    display: flex;
                    justify-content: center;
                    width: 100%;
                    margin-bottom: 50px;
                }
                .page-info {
                    font-size: 1.1rem;
                    color: #aaa; 
                    font-weight: 400;
                    text-align: center;
                    max-width: 800px;
                    line-height: 1.6;
                }
                .no-results {
                    text-align: center;
                    grid-column: 1 / -1; /* Ocupar todo el ancho en el grid */
                    padding: 50px 20px;
                    color: #e5e5e5;
                    font-style: italic;
                    border: 1px solid #333;
                    border-radius: 12px;
                    background-color: #1e1e1e;
                    margin-top: 30px;
                }

                /* --- Grid de Libros (Responsive y Estético) --- */
                .books-grid { 
                    display: grid;
                    /* Grid más compacto para simular la vista de streaming */
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); 
                    gap: clamp(15px, 2vw, 30px); /* Espacio responsive */
                    justify-items: center;
                    transition: opacity 0.5s ease; 
                    position: relative;
                }
                .books-grid.loading {
                    opacity: 0.3;
                    pointer-events: none;
                }

                /* --- Tarjeta de Libro (Estilo Hover y Clean) --- */
                .book-card {
                    width: 100%; 
                    border: none;
                    padding: 0; 
                    border-radius: 8px; /* Bordes sutiles */
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start; 
                    background-color: transparent; /* Fondo transparente para el dark mode */
                    box-shadow: none; 
                    transition: transform 0.3s ease, box-shadow 0.3s ease, z-index 0.3s;
                    cursor: pointer;
                    text-decoration: none;
                    color: inherit;
                    overflow: visible; /* Permitir que el hover se extienda */
                    max-width: 250px; 
                }
                /* Efecto de elevación tipo Netflix al hacer hover */
                .book-card:hover {
                    transform: scale(1.1) translateY(-5px); 
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5); /* Sombra dramática */
                    z-index: 5; /* Asegurar que esté por encima de las tarjetas vecinas */
                }

                .book-cover-wrapper {
                    width: 100%;
                    padding-top: 135%; /* Ratio de aspecto para portada vertical (aprox 2:3) */
                    position: relative;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .book-cover {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: opacity 0.3s;
                }

                .card-content {
                    padding: 10px 0; /* Menos padding, solo texto */
                    width: 100%;
                    text-align: center; /* Centrar el texto en la card */
                }
                .card-title {
                    font-size: 1rem; 
                    margin: 0 0 4px; 
                    color: #fff; 
                    font-weight: 600;
                    line-height: 1.3;
                    /* Limitar a dos líneas */
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .card-author {
                    font-size: 0.9rem;
                    color: #888; 
                    font-style: normal; 
                    font-weight: 400;
                    margin-top: 5px;
                }

                /* --- Paginación (Estilo Moderno) --- */
                .pagination-container {
                    margin-top: 80px; 
                    text-align: center;
                    padding: 25px 0;
                    border-top: 1px solid #333; /* Borde de separación sutil */
                }

                .pagination-link {
                    margin: 0 5px;
                    padding: 8px 13px;
                    border: 1px solid #333; 
                    background-color: #1e1e1e; 
                    border-radius: 6px; 
                    text-decoration: none;
                    font-weight: 500;
                    color: #e5e5e5; 
                    cursor: pointer;
                    transition: background-color 0.2s, border-color 0.2s, color 0.2s;
                    display: inline-block;
                    min-width: 30px; 
                    text-align: center;
                }
                .pagination-link.navigation {
                    padding: 8px 15px;
                    min-width: 80px;
                    font-weight: 400;
                    background-color: #333;
                    border-color: #333;
                }
                .pagination-link:hover {
                    background-color: #3a3a3a;
                    border-color: #555;
                    color: #fff;
                }

                .pagination-link.current {
                    background-color: #e50914; /* Rojo de enfoque */
                    color: white;
                    font-weight: 600;
                    border-color: #e50914;
                }
                .pagination-link.current:hover {
                    background-color: #ff3847;
                    color: white;
                }
                .pagination-link.disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                    color: #888;
                    background-color: #1e1e1e;
                }
                .pagination-link.loading-link {
                    opacity: 0.6;
                    cursor: not-allowed;
                    pointer-events: none;
                }

                .ellipsis {
                    margin: 0 5px;
                    padding: 8px 0;
                    color: #888;
                    display: inline-block;
                    width: 20px;
                    text-align: center;
                }

                /* Responsive Ajustes Finos */
                @media (max-width: 600px) {
                    .main-content {
                        padding: 30px 15px;
                    }
                    .header {
                        font-size: 2rem;
                        margin-bottom: 20px;
                    }
                    .page-info {
                        font-size: 0.9rem;
                        margin-bottom: 30px;
                        text-align: left;
                    }
                    .books-grid {
                        /* 2 columnas sólidas en móviles */
                        grid-template-columns: 1fr 1fr; 
                        gap: 15px;
                    }
                    .book-card {
                         max-width: 100%; /* Permitir que ocupe el ancho de la columna */
                    }
                    .book-card:hover {
                        transform: scale(1.05); /* Menos exagerado en móvil */
                    }
                    .pagination-link.navigation {
                        min-width: 40px;
                        font-size: 0.8rem;
                        padding: 8px 10px;
                    }
                }
            `}</style>
        </>
    );
}

// getServerSideProps (Sin cambios, ya está optimizado)
export async function getServerSideProps(context) {
    const page = context.query.page ? parseInt(context.query.page, 10) : 1;
    const query = context.query.q || ''; 
    const limit = 12; 

    let booksData = null;
    let error = null;
    let totalPages = 1;

    try {
        // Asumiendo que fetchBooks utiliza 'query' para filtrar
        booksData = await fetchBooks(page, limit, query);
        totalPages = booksData?.metadata?.totalPages || 1; 

    } catch (e) {
        console.error("Error al obtener libros:", e.message);
        error = "No se pudieron cargar los datos del catálogo. Por favor, inténtalo de nuevo más tarde.";
    }

    return {
        props: {
            booksData: booksData || { data: [], metadata: { totalPages: 1, totalCount: 0 } }, 
            currentPage: page,
            totalPages: totalPages, 
            error,
            currentQuery: query, 
        },
    };
}