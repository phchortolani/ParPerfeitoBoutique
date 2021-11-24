export default function TableCatg() {
    return (<table className="table table-bordered table-sm table-responsive-sm dataTable" id="dataTable" width="100%" cellSpacing="0" role="grid" >
        <thead>
            <tr>
                <th scope="col" className="fitCol">Código</th>
                <th scope="col">Descricao</th>
                <th scope="col">Valor</th>
                <th scope="col" className="text-center fitCol">Etiqueta</th>
                <th scope="col" className="text-center fitCol">Ação</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th scope="row">12598</th>
                <td>Sapatilhas</td>
                <td>R$ 25,98</td>
                <td className="text-center align-middle p-0 ">
                    <a style={{ fontSize: 'x-small' }} href="#" className="btn btn-sm btn-info btn-icon-split">
                        <span className="icon text-white-50">
                            <i className="fas fa-barcode"></i>
                        </span>
                        <span className="text d-none d-md-block">Imprimir</span>
                    </a>
                </td>
                <td className="text-center align-middle p-0 "><a className="fas fa-times btn btn-sm text-danger"></a></td>
            </tr>
            <tr>
                <th scope="row">2999</th>
                <td>Brincos</td>
                <td>R$ 9,99</td>
                <td className="text-center align-middle p-1">
                    <a style={{ fontSize: 'x-small' }} href="#" className="btn btn-sm btn-info btn-icon-split">
                        <span className="icon text-white-50">
                            <i className="fas fa-barcode"></i>
                        </span>
                        <span className="text d-none d-md-block">Imprimir</span>
                    </a>
                </td>
                <td className="text-center align-middle p-0 "><a className="fas fa-times btn btn-sm text-danger"></a></td>
            </tr>
        </tbody>
    </table>)
}