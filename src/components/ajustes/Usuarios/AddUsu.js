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
        tipo: ""
    }

    const [user, setUser] = useState(defaultUser);
    const [ClearList, setClearList] = useState(false);
    const [validatelist, setValidatelist] = useState([]);
    const [validateerros, setValidateErros] = useState('');
    const [loading, setLoading] = useState(false);
    const encrypt = require("md5");

    async function Update() {
        let tempobj = {
            usuario: user.usuario != "" ? user.usuario : props.editar.usuario,
            senha: user.senha != "" ? user.senha : props.editar.senha,
            dataCriacao: new Date(),
            nome: user.nome != "" ? user.nome : props.editar.nome,
            email: user.email != "" ? user.email : props.editar.email,
            tipo: user.tipo != "" ? user.tipo : props.editar.tipo,
            criadoPor: props.editar.criadoPor,
            modificadoPor: login,
            dataModificacao: props.editar ? new Date() : ""
        }

        let erroslist = [];
        for (var prop in tempobj) {
            if (tempobj[prop] == "") {
                erroslist.push(prop);
            }
        }

        if (erroslist.length == 0) setLoading(true);
        setValidatelist(erroslist);

        if (erroslist.length == 0) {
            var ret = await axios.post('/api/saveone', { obj: tempobj, table: "usuarios", login: login, update: true });
            if (ret.data.result) props.editUser(user);
            setValidateErros("Não foi possível alterar");

        } else {
            setValidateErros("Preencha todos os campos obrigatórios.")
        }
        setLoading(false);
    }

    async function Save() {

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
                await axios.post('/api/saveone', { obj: user, table: "usuarios", login: login });
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

        if (props.editar) {
            document.getElementById("email").value = props.editar?.email ?? "";
            document.getElementById("nome").value = props.editar?.nome ?? "";
            document.getElementById("tipo").value = props.editar?.tipo ?? "";
            document.getElementById("senha").value = props.editar?.senha ?? "";
            document.getElementById("senha").placeholder = "Alterar senha";

        } else {
            document.querySelectorAll("input").forEach((e) => e.value = "");
            document.getElementById("tipo").value = "";
        }
    }, [props.editar ? null : ClearList])

    return (<>
        <form>
            {props.editar ? "" : <div className="mb-2">
                <label htmlFor="usuario" className="form-label">Usuário</label>
                <input onChange={(e) => setUser({ ...user, usuario: e.target.value })} maxLength="20" type="text" className={"form-control form-control-sm " + (validatelist.includes(("usuario")) ? "border-danger" : "")} id="usuario" />
            </div>}

            <div className="mb-2">
                <label htmlFor="nome" className="form-label">Nome</label>
                <input onChange={(e) => setUser({ ...user, nome: e.target.value })} maxLength="35" defaultValue={props.editar?.nome ?? ""} type="text" className={"form-control form-control-sm " + (validatelist.includes(("nome")) ? "border-danger" : "")} id="nome" />
            </div>
            <div className="mb-2">
                <label htmlFor="email" className="form-label">E-mail</label>
                <input onChange={(e) => setUser({ ...user, email: e.target.value })} maxLength="45" type="email" className={"form-control form-control-sm " + (validatelist.includes(("email")) ? "border-danger" : "")} id="email" aria-describedby="emailHelp" />
                <div id="emailHelp" className="text-muted small">Este e-mail não será compartilhado com ninguém.</div>
            </div>
            <div className="mb-2">
                <label htmlFor="senha" className="form-label">Senha</label>
                <input onChange={(e) => setUser({ ...user, senha: encrypt(e.target.value) })} maxLength="64" autoComplete="current-password" type="password" className={"form-control form-control-sm " + (validatelist.includes(("senha")) ? "border-danger" : "")} id="senha" />
            </div>
            <div className="mb-2">
                <label htmlFor="tipo" className="form-label">Tipo:</label>
                <select onChange={(e) => setUser({ ...user, tipo: e.target.value })} defaultValue="" className={"form-control form-control-sm " + (validatelist.includes(("tipo")) ? "border-danger" : "")} id="tipo" >
                    <option value="" disabled>Selecione...</option>
                    <option value="administrador">Administrador</option>
                    <option value="colaborador">Colaborador</option>
                </select>

            </div>
            {props.editar ? <button onClick={() => { props.editUser() }} type="button" className="btn btn-outline-primary btn-sm mx-1"><i className="fas fa-arrow-alt-left "></i></button> : ""}
            {
                loading ? <button type="button" className="btn btn-primary btn-sm" disabled> {props.editar ? "Alterando" : "Cadastrando"} <span style={{ height: "17px", width: "17px" }} className="spinner-border"></span></button>
                    :
                    <button onClick={() => { (props.editar ? Update() : Save()) }} type="button" className="btn btn-primary btn-sm">{props.editar ? "Alterar" : "Cadastrar"}</button>
            }

            {validatelist.length > 0 ? <p className="text-danger badge d-flex pt-2 pb-2">{validateerros}</p> : ""}
        </form>
    </>)
}