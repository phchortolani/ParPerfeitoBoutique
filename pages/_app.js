import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.css'

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Par Perfeito | Controle de Estoque</title>
                <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossOrigin="anonymous" />

            </Head>
            <Component {...pageProps} />
        </>
    );
}
export default MyApp;