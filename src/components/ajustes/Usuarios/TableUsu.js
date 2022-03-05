import axios from "axios";
import { useState, useContext } from "react";
let UltimoUsuarioExluido = "";
import { AuthContext } from "../../../../context/Auth2Context";

export default function TableUsu(props, refresh) {
    const [excluirLoad, setExcluirLoad] = useState(false);
    const { login, tipoUsuario } = useContext(AuthContext);

    async function DeleteUser(username) {
        setExcluirLoad(true);
        UltimoUsuarioExluido = username;
        var ret = await axios.post('/api/deleteone', { table: "usuarios", where: { usuario: username } });

        if (ret.data.result) {
            props.removeFromList(username);
            setExcluirLoad(false);
        }
    }

    async function ChangeAlterPass(e) {
        var ret = await axios.post('/api/requestAlterPass', { user: e });
        if (ret.data) {
            if (ret.data.result) {
                Swal.fire("", ret.data.msg, "success");
            } else {
                Swal.fire("Atenção!", ret.data.msg, "error");
            }
        }
    }
    return (<>

        {props.list ? <table style={{ whiteSpace: "nowrap" }} className="table table-bordered table-sm table-responsive-sm dataTable" id="dataTable" width="100%" cellSpacing="0" role="grid" >
            <thead>
                <tr>
                    <th scope="col" className="fitCol">Usuário</th>
                    <th scope="col">Nome</th>
                    <th scope="col">E-mail</th>
                    <th scope="col" className="fitCol">Redefinir senha</th>
                    <th scope="col" className="fitCol">Tipo</th>

                    <th scope="col" colSpan="2" className="text-center">Ações</th>
                </tr>
            </thead>
            <tbody>
                {props.list.map((e, i) => {
                    return <tr className="animated--grow-in" key={i}>
                        <th scope="row">{e.usuario}</th>
                        <td>{e.nome}</td>
                        <td>{e.email}</td>

                        {e.usuario == "phchortolani" ? <td colSpan="4"></td> : <>
                            {excluirLoad && e.usuario == UltimoUsuarioExluido ? <td colSpan="3" className="text-danger text-center">Excluindo <span style={{ height: "17px", width: "17px" }} className="spinner-border"></span></td> :
                                <>
                                    <td className="text-center align-middle p-0"><input type="checkbox" className="text-center" onChange={() => ChangeAlterPass(e)} defaultChecked={e.redefinirSenha} /></td>
                                    <td>{e.tipo}</td>
                                    <td className="text-center align-middle p-0 ">
                                        <a onClick={() => { props.editUser(e) }} style={{ fontSize: 'x-small' }} href="#" className={"btn btn-sm btn-outline-secondary border-0  " + (tipoUsuario == "colaborador" ? "disabled" : "")}>
                                            <i className="fas fa-edit"></i>
                                        </a>
                                    </td>
                                    <td className="text-center align-middle p-0 ">
                                        <a onClick={() => DeleteUser(e.usuario)} className={"fas fa-times btn btn-sm text-danger " + (login == e.usuario || tipoUsuario == "colaborador" ? "disabled" : "")}></a>
                                    </td></>
                            }
                        </>}
                    </tr>
                })}
            </tbody>
        </table> : <div className="text-center"><span className="spinner-border text-primary"></span></div>}

    </>)
}