// pages/_app.js

import Layout from '../components/Layout';
// Si tienes estilos globales (como Tailwind, Bootstrap o un global.css), impórtalos aquí

export default function MyApp({ Component, pageProps }) {
  // `Component` es la página actual (ej. Home)
  // `pageProps` son los props de getServerSideProps
  
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}