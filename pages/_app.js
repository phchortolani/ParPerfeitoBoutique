import Head from "next/head";
import './../src/css/custom.css'
import { AuthProvider } from '../context/Auth2Context';

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Par Perfeito | Controle de Estoque</title>
                <link
                    href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
                    rel="stylesheet" />
                <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossOrigin="anonymous" />
                <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"></script>
                <link href="https://cdn.jsdelivr.net/npm/sweetalert2@9.17.2/dist/sweetalert2.min.css" rel="stylesheet" />
                <script src="//cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js" />
            </Head>
            <Component {...pageProps} />
        </AuthProvider>
    );
}
export default MyApp;