export default function TableCatg(props) {
 
    return (<table style={{ whiteSpace: "nowrap" }} className="table table-bordered table-sm table-responsive-sm dataTable" id="dataTable" width="100%" cellSpacing="0" role="grid" >
        <thead>
            <tr>
                <th scope="col" className="fitCol">Código</th>
                <th scope="col">Descricao</th>
                <th scope="col fitCol">Valor</th>
                <th scope="col" className="text-center" style={{ width: "6rem" }}>Quantidade</th>
                <th scope="col" className="text-center">Etiqueta</th>
            </tr>
        </thead>
        <tbody>
            {props.list.length > 0 ? props.list.map((e, i) => {
                return <tr key={i}>
                    <th scope="row">{e.codigo}</th>
                    <td>{e.descricao}</td>
                    <td>{e.valorPadrao}</td>
                    <td className="text-center">
                        90
                    </td>
                    <td className="text-center align-middle p-0 ">
                        <a style={{ fontSize: 'x-small' }} href="#" className="btn btn-sm btn-info btn-icon-split">
                            <span className="icon text-white-50">
                                <i className="fas fa-barcode"></i>
                            </span>
                            <span className="text d-none d-md-block">Imprimir</span>
                        </a>
                    </td>
                </tr>

            }) : <tr><td colSpan="5"><div className="p-1 text-center">Nenhuma categoria cadastrada</div></td></tr>}

        </tbody>
    </table>)
}