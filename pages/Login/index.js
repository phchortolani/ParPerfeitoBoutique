import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/Auth2Context";
import { parseCookies } from "nookies";
import Par_Perfeito from './../../public/Par_Perfeito.svg';

export default function login() {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [authError, setAuthError] = useState('');
    const { signIn } = useContext(AuthContext);

    async function handleSignIn() {
        setAuthError("");
        if (usuario != "" && senha != "") {
            setAuthError(await signIn(usuario, senha));
        } else {
            setAuthError("Insira o usuário e a senha.")
        }

    }

    return (<div className="login">
        <img src={Par_Perfeito} className="w-100"></img>
        <hr />
        <form >
            <input onChange={(e) => setUsuario(e.target.value)} autoComplete="username" className="loginbtns form-control mb-3" type="text" name="u" placeholder="Usuário" required="required" />
            <input onChange={(e) => setSenha(e.target.value)} className="loginbtns form-control mb-3" type="password" name="p" autoComplete="current-password" placeholder="Senha" required="required" />
            <hr />
            <button onClick={() => handleSignIn()} type="button" className="btn btn-primary btn-block btn-large w-100">Entrar</button>
            <p className="text-danger text-center badge">{authError}</p>
        </form>
    </div>
    )

}

export async function getServerSideProps(ctx) {

    const { token } = parseCookies(ctx);

    if (token) {
        return {
            redirect: {
                destination: '/Sistema',
                permanent: false
            }
        }
    }


    return {
        props: {}, // will be passed to the page component as props
    }
}