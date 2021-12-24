import { useState } from "react"

export default function TableSelecionados(props) {
    const [qtprod, setqtprod] = useState(1);
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
                {props.cart ? props.cart.map((e, i) => {
                    return <tr>
                        <th scope="row">{e.codigo}</th>
                        <td>{e.descricao}</td>
                        <td>R$ {e.valor}</td>
                        <td className="text-center align-middle px-4">
                            <input className="form-control text-center form-control-sm" onChange={(e) => setqtprod(e.target.value)} defaultValue="1" />
                        </td>
                        <td>R$ {e.valor * qtprod}</td>
                        <td className="text-center align-middle p-0 "><a onClick={(e)=> props.RemoveItem(e.codigo)} className="fas fa-times btn btn-sm text-danger"></a></td>
                    </tr>
                }) : ""}

            </tbody>
        </table>
    </>)
}