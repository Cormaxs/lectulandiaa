import { fetchBookById } from '../../lib/api';
import Head from 'next/head'; 
import Link from 'next/link';

export default function SeeBookPage({ book }) {
    
    // 🎨 Definición de Colores y Variables de Estilo
    // Usamos las mismas variables que en el componente Catálogo (Home)
    const colors = {
        background: '#141414', // Fondo principal oscuro
        textPrimary: '#fff', // Texto principal (blanco)
        textSecondary: '#e5e5e5', // Texto secundario (gris claro)
        accentBlue: '#5DADE2', // Azul para enlaces (Volver)
        ctaRed: '#E50914', // Rojo de Netflix para el botón de acción
        ratingGreen: '#2ECC71', // Verde brillante para ratings
        borderColor: '#333', // Borde sutil para separadores
        cardShadow: '0 10px 30px rgba(0, 0, 0, 0.6)', // Sombra dramática
    };

    // 🖼️ Estilos para la Portada (Poster Look)
    const coverStyle = {
        width: '300px',
        height: 'auto',
        objectFit: 'cover',
        borderRadius: '8px',
        boxShadow: colors.cardShadow,
        marginRight: '40px', 
    };

    // Estilos del Botón de Descarga (CTA)
    const downloadButtonStyle = {
        backgroundColor: colors.ctaRed,
        color: 'white',
        padding: '12px 25px',
        borderRadius: '6px',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '1.1em',
        display: 'inline-block',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
        transition: 'background-color 0.2s, transform 0.2s',
        cursor: 'pointer',
    };

    return (
        <main className="main-content" style={{
            fontFamily: 'Inter, system-ui, sans-serif', 
            maxWidth: '1200px', // Más ancho para un look de plataforma
            margin: '0 auto',
            padding: '50px 3vw',
        }}>
            
            <Head>
                <title>{book.titulo} | Lectulandiaa</title>
                <meta name="description" content={book.sinopsis.substring(0, 150) + '...'} />
            </Head>
            
            {/* ENLACE DE NAVEGACIÓN */}
            <Link href="/" legacyBehavior>
                <a className="back-link" style={{
                    color: colors.accentBlue, 
                    textDecoration: 'none', 
                    marginBottom: '30px', // Mayor espacio
                    display: 'inline-block', 
                    fontWeight: 'bold',
                    fontSize: '1.1em',
                }}>
                    &larr; Volver al Catálogo
                </a>
            </Link>

            {/* Contenedor Principal de Detalles (Flex) */}
            <div className="detail-flex-container">
                
                {/* IMAGEN */}
                {book.portada && (
                    <img 
                        src={book.portada} 
                        alt={`Portada de ${book.titulo}`} 
                        style={coverStyle} 
                        className="book-cover-large"
                    />
                )}

                {/* DETALLES */}
                <div className="detail-content">
                    <h1 style={{fontSize: '2.5em', color: colors.textPrimary, marginBottom: '5px', lineHeight: '1.1'}}>{book.titulo}</h1>
                    
                    <p style={{fontStyle: 'italic', color: colors.textSecondary, fontSize: '1.1em', marginBottom: '25px'}}>
                        **Autor:** <span style={{color: colors.textPrimary}}>{book.autor}</span>
                    </p>
                    
                    {/* Calificación Destacada */}
                    <div style={{marginBottom: '30px', padding: '10px 10px', borderLeft: `5px solid ${colors.ratingGreen}`, backgroundColor: '#1e1e1e', borderRadius: '4px'}}>
                        <p style={{fontWeight: 'bold', color: colors.ratingGreen, fontSize: '1.2em', margin: 0}}>
                            ⭐ Calificación Promedio: <span style={{color: colors.textPrimary}}>{book.averageRating || 'Sin calificaciones'}</span>
                        </p>
                    </div>

                    {/* Sinopsis */}
                    <div style={{marginTop: '40px'}}>
                        <h2 style={{borderBottom: `1px solid ${colors.borderColor}`, paddingBottom: '8px', color: colors.textPrimary, fontSize: '1.6em'}}>Sinopsis</h2>
                        <p style={{lineHeight: '1.7', color: colors.textSecondary, fontSize: '1.1em'}}>{book.sinopsis}</p>
                    </div>

                    {/* ENLACE DE DESCARGA: El CTA destacado */}
                    {book.link && (
                        <div className="download-cta-wrapper">
                            <a 
                                href={book.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={downloadButtonStyle}
                            >
                                Descargar Libro ({book.fileType || 'PDF'})
                            </a>
                        </div>
                    )}

                </div>
            </div>

            {/* Estilos locales para el Dark Mode unificado y Responsive */}
            <style jsx global>{`
                /* Aplicar estilos globales de Dark Mode */
                body {
                    margin: 0;
                    padding: 0;
                    background-color: ${colors.background};
                    color: ${colors.textSecondary};
                    font-family: 'Inter', system-ui, sans-serif;
                }
            `}</style>
            <style jsx>{`
                /* Estilos del Componente */
                .detail-flex-container {
                    display: flex;
                    margin-top: 30px;
                    gap: 40px;
                    width: 100%;
                    min-height: 400px; /* Altura mínima para mejor apariencia */
                }
                .detail-content {
                    flex-grow: 1;
                    min-width: 0; /* Permite que el contenido se encoja correctamente */
                }
                .download-cta-wrapper {
                    margin-top: 40px;
                }

                /* Responsive para que la imagen y los detalles se apilen */
                @media (max-width: 900px) {
                    .detail-flex-container {
                        flex-direction: column;
                        align-items: center;
                    }
                    .book-cover-large {
                        margin-right: 0 !important; /* Eliminar margen lateral */
                        margin-bottom: 30px;
                        max-width: 250px; /* Reducir un poco en tablet */
                        width: 100%;
                        min-height: 300px;
                    }
                }
                @media (max-width: 600px) {
                    .main-content {
                        padding: 30px 15px;
                    }
                    .book-cover-large {
                        max-width: 180px; /* Tamaño de póster en móvil */
                    }
                }

                /* Simulación del hover para el botón (ya que no podemos usar :hover en style) */
                .download-cta-wrapper :global(a) {
                    /* Ya definido en downloadButtonStyle, pero si se pudiera, se añadiría el hover aquí */
                }
                /* Nota: En un proyecto real con CSS externo/módulos, se usaría:
                .download-cta-wrapper a:hover {
                    background-color: #ff3847; 
                    transform: translateY(-2px);
                }
                */
            `}</style>
        </main>
    );
}

// Next.js: Se ejecuta en el servidor. Captura el 'id' de la ruta.
export async function getServerSideProps(context) {
    // La lógica de servidor permanece sin cambios, solo se asegura
    // de que el libro exista o maneja el error.
    const { id } = context.params; 
    const bookId = id.split('-').pop(); // Extrae el ID real del slug
    let book = null;

    try {
        book = await fetchBookById(bookId);
    } catch (e) {
        console.error("Error grave al obtener el libro:", e.message);
        return { notFound: true };
    }

    if (!book) {
        return {
            notFound: true, 
        };
    }

    return {
        props: {
            book,
        },
    };
}