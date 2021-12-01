import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../../../context/Auth2Context";

export default function AddUsu(props) {
    const { login } = useContext(AuthContext);

    const defaultUser = {
        usuario: "",
        senha: "",
        dataCriacao: new Date(),
        nome: "",
        email: "",
        tipo: "administrador",
        criadoPor: login
    }

    const [user, setUser] = useState(defaultUser);
    const [ClearList, setClearList] = useState(false);
    const [validatelist, setValidatelist] = useState([]);
    const [validateerros, setValidateErros] = useState('');
    const [loading, setLoading] = useState(false);
    const encrypt = require("md5");

    async function CadastrarNovo() {

        let erroslist = [];
        for (var prop in user) {
            if (user[prop] == "") {
                erroslist.push(prop);
            }
        }
        if (erroslist.length == 0) setLoading(true);
        setValidatelist(erroslist);
        setUser({ ...user, dataCriacao: new Date() });

        var ret = await axios.post('/api/findone', { obj: { usuario: user.usuario }, table: "usuarios" });

        if (ret.data.result) {
            setValidateErros(`O usuário ${ret.data.result.usuario} já existe.`);
            setValidatelist('usuario');
        } else {
            if (erroslist.length == 0) {
                await axios.post('/api/saveone', { obj: user, table: "usuarios" });
                props.addIntoList(user);
                setUser(defaultUser);
                setClearList(!ClearList);
            } else {
                setValidateErros("Preencha todos os campos obrigatórios.")
            }
        }
        setLoading(false);

    }
    useEffect(() => {
        document.querySelectorAll("input").forEach((e) => e.value = "");
        document.getElementById("tipo").value = "administrador";

    }, [ClearList])

    return (<>
        <form>
            <div className="mb-2">
                <label htmlFor="usuario" className="form-label">Usuário</label>
                <input onChange={(e) => setUser({ ...user, usuario: e.target.value })} type="text" className={"form-control form-control-sm " + (validatelist.includes(("usuario")) ? "border-danger" : "")} id="usuario" />
            </div>
            <div className="mb-2">
                <label htmlFor="nome" className="form-label">Nome</label>
                <input onChange={(e) => setUser({ ...user, nome: e.target.value })} type="text" className={"form-control form-control-sm " + (validatelist.includes(("nome")) ? "border-danger" : "")} id="nome" />
            </div>
            <div className="mb-2">
                <label htmlFor="email" className="form-label">E-mail</label>
                <input onChange={(e) => setUser({ ...user, email: e.target.value })} type="email" className={"form-control form-control-sm " + (validatelist.includes(("email")) ? "border-danger" : "")} id="email" aria-describedby="emailHelp" />
                <div id="emailHelp" className="text-muted small">Este e-mail não será compartilhado com ninguém.</div>
            </div>
            <div className="mb-2">
                <label htmlFor="senha" className="form-label">Senha</label>
                <input onChange={(e) => setUser({ ...user, senha: encrypt(e.target.value) })} autoComplete="current-password" type="password" className={"form-control form-control-sm " + (validatelist.includes(("senha")) ? "border-danger" : "")} id="senha" />
            </div>
            <div className="mb-2">
                <label htmlFor="tipo" className="form-label">Tipo</label>
                <select onChange={(e) => setUser({ ...user, tipo: e.target.value })} className="form-control form-control-sm" id="tipo" >
                    <option value="administrador">Administrador</option>
                    <option value="colaborador">Colaborador</option>
                </select>

            </div> {

                loading ? <button type="button" className="btn btn-primary btn-sm" disabled>Cadastrando <span style={{ height: "17px", width: "17px" }} className="spinner-border"></span></button>
                    :
                    <button onClick={() => { CadastrarNovo() }} type="button" className="btn btn-primary btn-sm" >Cadastrar</button>
            }

            {validatelist.length > 0 ? <p className="text-danger badge d-flex pt-2 pb-2">{validateerros}</p> : ""}
        </form>
    </>)
}