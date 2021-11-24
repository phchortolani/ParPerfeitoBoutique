export default function TableProd() {
    return (<>
        <table style={{ whiteSpace: "nowrap" }} className="table table-bordered table-sm table-responsive-sm dataTable" id="dataTable" width="100%" cellSpacing="0" role="grid" >
            <thead>
                <tr>
                    <th scope="col" className="fitCol">Código</th>
                    <th scope="col">Descrição</th>
                    <th scope="col" style={{ width: "7rem" }}>Valor</th>
                    <th scope="col" style={{ width: "12rem" }}>Categoria</th>
                    <th scope="col" style={{ width: "6rem" }}>Quantidade</th>
                    <th scope="col" className="text-center fitCol">Etiqueta</th>
                    <th scope="col" className="text-center fitCol">Ação</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">112598</th>
                    <td>Sapatilha Comum</td>
                    <td>R$ 25,98</td>
                    <td>
                        <select className="form-control form-control-sm">
                            <option>Sapatilhas</option>
                        </select>
                    </td>
                    <td>
                        <input className="form-control form-control-sm border-left-success" defaultValue="87" />
                    </td>
                    <td className="text-center align-middle p-0 ">
                        <a style={{ fontSize: 'x-small' }} href="#" className="btn btn-sm btn-info btn-icon-split">
                            <span className="icon text-white-50">
                                <i className="fas fa-print"></i>
                            </span>
                            {/*                                 <span className="text d-none d-md-block">Imprimir</span>
 */}                            </a>
                    </td>
                    <td className="text-center align-middle p-0 ">
                        <a className="fas fa-times btn btn-sm text-danger"></a>
                    </td>
                </tr>
                <tr>
                    <th scope="row">122598</th>
                    <td>Sapatilha Mule</td>
                    <td>R$ 25,98</td>
                    <td><select className="form-control form-control-sm">
                        <option>Sapatilhas</option>
                        <option>Brincos</option>
                    </select>
                    </td>
                    <td>
                        <input className="form-control form-control-sm border-left-success" defaultValue="2" />
                    </td>
                    <td className="text-center align-middle p-0 ">
                        <a style={{ fontSize: 'x-small' }} href="#" className="btn btn-sm btn-info btn-icon-split">
                            <span className="icon text-white-50">
                                <i className="fas fa-print"></i>
                            </span>
                            {/*                                 <span className="text d-none d-md-block">Imprimir</span>
 */}                            </a>
                    </td>
                    <td className="text-center align-middle p-0 ">
                        <a className="fas fa-times btn btn-sm text-danger"></a>
                    </td>
                </tr>
                <tr>
                    <th scope="row">132598</th>
                    <td>Brinco Rubi</td>
                    <td>R$ 9,99</td>
                    <td><select className="form-control form-control-sm">
                        <option>Brincos</option>
                        <option>Sapatilhas</option>
                    </select>
                    </td>
                    <td>
                        <input className="form-control form-control-sm border-left-danger" defaultValue="0" />
                    </td>
                    <td className="text-center align-middle p-0 ">
                        <a style={{ fontSize: 'x-small' }} href="#" className="btn btn-sm btn-info btn-icon-split">
                            <span className="icon text-white-50">
                                <i className="fas fa-print"></i>
                            </span>
                            {/*                                 <span className="text d-none d-md-block">Imprimir</span>
 */}                            </a>
                    </td>
                    <td className="text-center align-middle p-0 ">
                        <a className="fas fa-times btn btn-sm text-danger"></a>
                    </td>
                </tr>

            </tbody>
        </table>
    </>)
}