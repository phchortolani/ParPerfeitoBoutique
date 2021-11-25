export default function TableSelecionados() {
    return (<>
        <table style={{ whiteSpace: "nowrap" }} className="table text-monospace small text-uppercase table-sm table-responsive-sm dataTable" id="dataTable" width="100%" cellSpacing="0" role="grid" >
            <thead>
                <tr>
                    <th scope="col" className="fitCol">Código</th>
                    <th scope="col">Produto</th>
                    <th scope="col" className="fitCol">Valor </th>
                    <th scope="col" className="text-center" style={{ width: "6rem" }}>Quantidade</th>
                    <th scope="col" className="fitCol">Total</th>
                    <th scope="col" className="text-center fitCol">Ação</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">12598</th>
                    <td>Sapatilha Comum</td>
                    <td>R$ 25,98</td>
                    <td className="text-center align-middle px-4">
                        <input className="form-control text-center form-control-sm" defaultValue="1" />
                    </td>
                    <td>R$ 25,98</td>
                    <td className="text-center align-middle p-0 "><a className="fas fa-times btn btn-sm text-danger"></a></td>
                </tr>
                <tr>
                    <th scope="row">2999</th>
                    <td>Brinco Rubi</td>
                    <td>R$ 9,99</td>
                    <td className="text-center align-middle px-4">
                        <input className="form-control  text-center form-control-sm" defaultValue="2" />
                    </td>
                    <td>R$ 19,98</td>
                    <td className="text-center align-middle p-0 "><a className="fas fa-times btn btn-sm text-danger"></a></td>
                </tr>
            </tbody>
        </table>
    </>)
}