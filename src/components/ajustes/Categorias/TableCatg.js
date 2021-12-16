import { useState } from "react";

export default function TableCatg(props) {
    let produtos = props.produtos;
    const [categSelecionada, setCategSelecionada] = useState(0);

    function editarCateg(cod) {
        if (categSelecionada == cod) cod = 0;
        setCategSelecionada(cod);
        props.refreshQueryCateg(cod)
    }

    function ObterQtd(codigo) {
        let total = 0;
        produtos.forEach((e) => {
            if (e.codCategoria == codigo) {
                total += e.quantidade;
            }
        });
        return total;
    }

    return (<table style={{ whiteSpace: "nowrap" }} className="table table-bordered table-sm table-responsive-sm dataTable" width="100%" cellSpacing="0" role="grid" >
        <thead>
            <tr>
                <th scope="col" className="fitCol">Código</th>
                <th scope="col">Descricao</th>
                <th scope="col fitCol">Valor Padrão</th>
                <th scope="col" className="text-center" style={{ width: "6rem" }}>Quantidade</th>
            </tr>
        </thead>
        <tbody>
            {props.list.length > 0 ? props.list.map((e, i) => {
                return <tr style={{cursor:"pointer"}} onClick={() => editarCateg(e.codigo)} className={"animated--grow-in " + (categSelecionada == e.codigo ? "shadow text-primary" : "")} key={i}>
                    <th scope="row" className="text-center"> <a className="btn py-0 btn-sm btn-link font-weight-bolder text-decoration-none" >{e.codigo}</a> </th>
                    <td>{e.descricao}</td>
                    <td>R$ {e.valorPadrao}</td>
                    <td className="text-center">
                        {produtos ? ObterQtd(e.codigo) : 0}
                    </td>
                </tr>

            }) : <tr><td colSpan="5"><div className="p-1 text-center">Nenhuma categoria cadastrada</div></td></tr>}

        </tbody>
    </table>)
}