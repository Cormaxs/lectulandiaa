// pages/_app.js

import Script from 'next/script'; // ¡Importante! Importamos el componente Script
import Layout from '../components/Layout';
// Si tienes estilos globales (como Tailwind, Bootstrap o un global.css), impórtalos aquí

// Tu ID de seguimiento de Google Analytics
const GA_TRACKING_ID = 'G-15C4M5XHTZ';

export default function MyApp({ Component, pageProps }) {
  // `Component` es la página actual (ej. Home)
  // `pageProps` son los props de getServerSideProps

  return (
    <>

    <head>
    <meta name="google-adsense-account" content="ca-pub-5933305559914134"></meta>
    </head>
      {/*
        1. SCRIPT PRINCIPAL (Cargador de gtag.js)
        La estrategia "afterInteractive" le dice a Next.js que espere hasta que
        la página sea interactiva para cargar este script, mejorando la métrica LCP.
      */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />

      {/*
        2. SCRIPT DE CONFIGURACIÓN (Inicialización)
        Aquí se define la función gtag() y se llama a gtag('config').
      */}
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname, // Asegura el seguimiento correcto en las rutas de Next.js
            });
          `,
        }}
      />

      {/* Tu estructura de aplicación original */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
