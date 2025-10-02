// components/Header.js

import Link from 'next/link';
// Importamos Image si en el futuro decides usar un logo de imagen
// import Image from 'next/image';

export default function Header() {
    return (
        // Utilizamos la etiqueta <header> que ya es semánticamente correcta.
        <header className="main-header">
            <div className="header-content">
                {/* Mejora SEO 1: Usar la etiqueta <h1> o un contenedor de alto valor semántico.
                  El logo de la web debe ser el elemento más importante de la página.
                  Lo convertimos en un <h1> para indicar que es el encabezado principal del sitio.
                  El <a> dentro del <h1> garantiza que sigue siendo un enlace navegable.
                */}
                <h1>
                    <Link href="/" legacyBehavior>
                        {/* Mejora SEO 2: Añadimos un atributo 'title' al enlace.
                          Esto es bueno para la accesibilidad y proporciona texto ancla adicional.
                        */}
                        <a className="logo" title="Volver a la página de inicio de Lectulandiaa.com">
                            Lectulandiaa.com
                        </a>
                    </Link>
                </h1>
                
                {/* Mejora SEO 3: Usamos <nav> para la navegación, lo cual ya es correcto.
                  Añadimos el atributo aria-label para describir el propósito de la navegación.
                  Esto es crucial para la accesibilidad.
                */}
                <nav className="main-nav" aria-label="Navegación principal del sitio">
                    <ul>
                        <li>
                            <Link href="/" legacyBehavior>
                                <a>Inicio</a>
                            </Link>
                        </li>
                        {/** <li>
                                
                                <Link href="/sobre-nosotros" legacyBehavior>
                                    <a>Saber más</a>
                                </Link>
                            </li>*/}
                    </ul>
                </nav>
            </div>
            <style jsx>{`
                .main-header {
                    background-color: #0d0d0d; /* Fondo muy oscuro, armonizando con el catálogo */
                    border-bottom: 3px solid #e50914; /* Línea de color de acento */
                    padding: 0 3vw;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
                    position: sticky; /* Se mantiene visible al hacer scroll */
                    top: 0;
                    z-index: 20; /* Asegura que esté por encima de otros elementos */
                }
                .header-content {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 70px; /* Altura fija */
                }
                /* Estilos para el nuevo <h1> que contiene el logo */
                h1 {
                    margin: 0; /* Quitamos el margen por defecto del h1 */
                }
                .logo {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #fff;
                    text-decoration: none;
                    transition: color 0.2s;
                    display: block; /* Aseguramos que el logo ocupe todo el espacio del <h1> */
                }
                .logo:hover {
                    color: #ff3847;
                }
                .main-nav ul {
                    list-style: none;
                    display: flex;
                    margin: 0;
                    padding: 0;
                    gap: 30px;
                }
                .main-nav a {
                    color: #e5e5e5;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 1.1rem;
                    padding: 5px 0;
                    position: relative;
                    transition: color 0.2s;
                }
                .main-nav a:hover {
                    color: #e50914;
                }
                /* Responsive */
                @media (max-width: 768px) {
                    .header-content {
                        flex-direction: column;
                        height: auto;
                        padding: 15px 0;
                    }
                    .logo {
                        margin-bottom: 10px;
                        font-size: 1.5rem;
                    }
                    .main-nav ul {
                        gap: 15px;
                    }
                }
            `}</style>
        </header>
    );
}
