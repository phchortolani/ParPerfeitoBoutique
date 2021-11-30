import React, { useEffect, useState } from "react";
import axios from "axios";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import Router from "next/router";
import jwt from 'jsonwebtoken';

export const AuthContext = React.createContext({});

export const AuthProvider = (props) => {
    const [login, setLogin] = useState(undefined);
    const [isMobile, setisMobile] = useState(false);
    const isAuthenticated = !!login;

    useEffect(() => {
        const { token } = parseCookies();
        setisMobile(window.innerWidth <= 768);
        if (token) {
            var user = jwt.decode(token);
            setLogin(user.username);
            if (Router.asPath == "/login") {
                Router.push("./Sistema");
            }
        } 
    }, []);

    async function signIn(user, pass) {
        var ret = await axios.post('/api/login', { user: user, pass: pass });
        if (ret.data) {
            setCookie(null, 'token', ret.data.token, { maxAge: 68 * 68 * 1, path: '/' });
        }
        setLogin(ret.data.login);

        if (ret.data.login) {
            Router.push("./Sistema");
        } else return "Usuário não encontrado.";

    }

    async function signOut() {
        destroyCookie(null, "token", { path: '/' });
        setLogin(undefined);
        Router.push("./");
    }

    return (
        <AuthContext.Provider value={{ signIn, isAuthenticated, login, signOut, isMobile }}>
            {props.children}
        </AuthContext.Provider>
    )

}
