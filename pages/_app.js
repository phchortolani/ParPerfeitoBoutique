import Head from "next/head";
//import 'bootstrap/dist/css/bootstrap.css'
import './../src/css/custom.css'

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Par Perfeito | Controle de Estoque</title>
                <link
                    href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
                    rel="stylesheet" />
                <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossOrigin="anonymous" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}
export default MyApp;