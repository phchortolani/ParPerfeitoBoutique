import axios from "axios";
import { useState } from "react";

export default function TableProd(props) {
    const [LoadingRemove, setLoadingRemove] = useState(false);

    function searchCategoria(codigo, index) {
        if (index) return props.categorias.data.findIndex((e) => e.codigo == codigo);
        return props.categorias.data.find((e) => e.codigo == codigo);
    }

    async function ExcludeProd(codigo) {
        setLoadingRemove(true);
        var ret = await axios.post('/api/deleteone', { table: "produtos", where: { codigo: codigo } });
        if (ret) {
            props.removeFromList(codigo);
        } else {
            console.log(ret);
        }
        setLoadingRemove(false);
    }

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
                {props.list.length > 0 ? props.list.map((e, i) => {
                    return <tr key={i}>
                        <th scope="row">{e.codigo}</th>
                        <td>{e.descricao}</td>
                        <td>R$ {e.valor}</td>
                        <td>
                            {searchCategoria(e.codCategoria)?.descricao}
                        </td>
                        <td>
                            <input className="form-control form-control-sm border-left-success" defaultValue={e.quantidade} />
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
                            <a onClick={() => ExcludeProd(e.codigo)} className="fas fa-times btn btn-sm text-danger"></a>
                        </td>
                    </tr>

                }) : <tr><td colSpan="5"><div className="p-1 text-center">Nenhum produto cadastrado</div></td></tr>}

            </tbody>
        </table>
    </>)
}