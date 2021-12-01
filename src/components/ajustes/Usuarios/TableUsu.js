export default function TableUsu(props) {
    return (<>
        {props.list ? <table style={{ whiteSpace: "nowrap" }} className="table table-bordered table-sm table-responsive-sm dataTable" id="dataTable" width="100%" cellSpacing="0" role="grid" >
            <thead>
                <tr>
                    <th scope="col" className="fitCol">Usuário</th>
                    <th scope="col">Nome</th>
                    <th scope="col">E-mail</th>
                    <th scope="col">Tipo</th>
                    <th scope="col" colSpan="2" className="text-center">Ações</th>
                </tr>
            </thead>
            <tbody>
                {props.list.map((e, i) => {
                    return <tr key={i}>
                        <th scope="row">{e.usuario}</th>
                        <td>{e.nome}</td>
                        <td>{e.email}</td>
                        <td>
                            <select defaultValue={e.tipo} className="form-control form-control-sm">
                                <option value="administrador">Administrador</option>
                                <option value="colaborador">Colaborador</option>
                            </select>
                        </td>
                        <td className="text-center align-middle p-0 ">
                            <a style={{ fontSize: 'x-small' }} href="#" className="btn btn-sm btn-secondary">
                                <i className="fas fa-edit"></i>
                            </a>
                        </td>
                        <td className="text-center align-middle p-0 ">
                            <a className="fas fa-times btn btn-sm text-danger"></a>
                        </td>
                    </tr>
                })}
            </tbody>
        </table> : <div className="text-center"><span className="spinner-border text-primary"></span></div>}

    </>)
}