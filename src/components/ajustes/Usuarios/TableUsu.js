import axios from "axios";
import { useState } from "react";
let UltimoUsuarioExluido = "";

export default function TableUsu(props, refresh) {
    const [excluirLoad, setExcluirLoad] = useState(false);

    async function DeleteUser(username) {
        setExcluirLoad(true);
        UltimoUsuarioExluido = username;
        var ret = await axios.post('/api/deleteone', { table: "usuarios", where: { usuario: username } });

        if (ret.data.result) {
            props.removeFromList(username);
            setExcluirLoad(false);
        }
    }
    return (<>

        {props.list ? <table style={{ whiteSpace: "nowrap" }} className="table table-bordered table-sm table-responsive-sm dataTable" id="dataTable" width="100%" cellSpacing="0" role="grid" >
            <thead>
                <tr>
                    <th scope="col" className="fitCol">Usuário</th>
                    <th scope="col">Nome</th>
                    <th scope="col">E-mail</th>
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

                        {e.usuario == "phchortolani" ? <td>Full access</td> : <>

                            {excluirLoad && e.usuario == UltimoUsuarioExluido ? <td colSpan="3" className="text-danger text-center">Excluindo <span style={{ height: "17px", width: "17px" }} className="spinner-border"></span></td> :
                                <>
                                    <td>{e.tipo}</td>
                                    <td className="text-center align-middle p-0 ">
                                        <a onClick={() => { props.editUser(e) }} style={{ fontSize: 'x-small' }} href="#" className="btn btn-sm btn-outline-secondary border-0">
                                            <i className="fas fa-edit"></i>
                                        </a>
                                    </td>
                                    <td className="text-center align-middle p-0 ">
                                        <a onClick={() => DeleteUser(e.usuario)} className="fas fa-times btn btn-sm text-danger"></a>
                                    </td></>
                            }
                        </>}
                    </tr>
                })}
            </tbody>
        </table> : <div className="text-center"><span className="spinner-border text-primary"></span></div>}

    </>)
}