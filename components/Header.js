// components/Header.js

import Link from 'next/link';

export default function Header() {
    return (
        <header className="main-header">
            <div className="header-content">
                <Link href="/" legacyBehavior>
                    <a className="logo">
                    Lectulandiaa.com
                    </a>
                </Link>
                <nav className="main-nav">
                    <ul>
                        <li>
                            <Link href="/" legacyBehavior>
                                <a>Inicio</a>
                            </Link>
                        </li>
                       {/**  <li>
                            
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
                .logo {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #fff;
                    text-decoration: none;
                    transition: color 0.2s;
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