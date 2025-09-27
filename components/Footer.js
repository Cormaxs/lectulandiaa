// components/Footer.js

export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="main-footer">
            <div className="footer-content">
                <p>&copy; {currentYear} Biblioteca Digital. Todos los derechos reservados.</p>
                <div className="footer-links">
                    <a href="/privacy" className="footer-link">Política de Privacidad</a>
                    <span className="separator">|</span>
                    <a href="/terms" className="footer-link">Términos de Servicio</a>
                </div>
            </div>
            <style jsx>{`
                .main-footer {
                    background-color: #0d0d0d;
                    color: #aaa;
                    padding: 30px 3vw;
                    margin-top: 50px; /* Separación del contenido principal */
                    border-top: 1px solid #333;
                    text-align: center;
                    font-size: 0.9rem;
                }
                .footer-content {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .footer-links {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }
                .footer-link {
                    color: #aaa;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .footer-link:hover {
                    color: #fff;
                }
                .separator {
                    color: #555;
                }

                @media (max-width: 600px) {
                    .footer-content {
                        flex-direction: column;
                        gap: 15px;
                    }
                }
            `}</style>
        </footer>
    );
}