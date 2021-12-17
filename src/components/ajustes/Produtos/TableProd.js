import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../../load/Loading";
import Modal from "../../modal/Modal";

export default function TableProd(props) {
    const [modalPrint, setModalPrint] = useState({
        isOpen: false,
        title: "",
        children: ""
    });
    const [ProdSelecionado, setProdSelecionado] = useState();

    const [LoadingRemove, setLoadingRemove] = useState({ loading: false, codigo: 0 });

    function searchCategoria(codigo, index) {
        if (index) return props.categorias.data.findIndex((e) => e.codigo == codigo);
        return props.categorias.data.find((e) => e.codigo == codigo);
    }

    function openModal(produto) {
        setModalPrint({ isOpen: true, title: `Código de Barra: ${produto.codigo} - ${produto.descricao} `, children: produto });
    }

    async function ExcludeProd(codigo) {
        setLoadingRemove({ loading: true, codigo: codigo });
        var ret = await axios.post('/api/deleteone', { table: "produtos", where: { codigo: codigo } });
        if (ret) {
            props.removeFromList(codigo);
        } else {
            console.log(ret);
        }
        setLoadingRemove({ loading: false, codigo: 0 });
    }

    function editProd(produto) {
        if (produto.codigo == ProdSelecionado?.codigo) produto = null;
        setProdSelecionado(produto);
        props.editProd(produto);
    }

    function printPageArea() {
        var printContent = document.getElementById('codigodebarra');
        var WinPrint = window.open('', '', 'width=900,height=650');
        WinPrint.document.write(printContent.innerHTML);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
    }

    useEffect(() => {
        JsBarcode(".barcode").init();
    }, [modalPrint])
  
    return (<>
        <Modal open={modalPrint.isOpen} title={modalPrint.title} closeModal={() => setModalPrint({ ...modalPrint, isOpen: false })}>
            <div className="text-center">
                <div id="codigodebarra" className="d-flex justify-content-around">
                    <svg className="barcode"
                        jsbarcode-format="CODE128"
                        jsbarcode-value={modalPrint.children.codigo + '-' + modalPrint.children.descricao}
                        jsbarcode-textmargin="0"
                        jsbarcode-fontoptions="bold">
                    </svg>
                </div>
                <hr />
                <button className="btn btn-sm btn-primary" onClick={() => printPageArea()}>Imprimir</button>
            </div>
        </Modal>

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
                    return <tr className={"animated--grow-in " + (ProdSelecionado?.codigo == e.codigo ? "shadow text-primary" : "")} key={i}>
                        <th onClick={() => editProd(e)} scope="row" className="text-center"> <a className="btn py-0 btn-sm btn-link font-weight-bolder text-decoration-none" >{e.codigo}</a> </th>
                        <td>{e.descricao}</td>
                        <td>R$ {e.valor}</td>
                        <td>
                            {searchCategoria(e.codCategoria)?.descricao}
                        </td>

                        {LoadingRemove.loading && e.codigo == LoadingRemove.codigo ? <td colSpan="3" className="text-center" ><span className="text-danger badge"><Loading /> Excluindo </span> </td> : <>
                            <td className="text-center">
                                <span className={"badge text-white px-md-2 bg-" + (e.quantidade <= 0 ? "danger" : e.quantidade <= 10 ? "warning" : "success")}>{e.quantidade} </span>
                            </td>
                            <td className="text-center align-middle p-0 ">
                                <a style={{ fontSize: 'x-small' }} onClick={() => openModal(e)} href="#" className="btn btn-sm btn-info btn-icon-split">
                                    <span className="icon text-white-50">
                                        <i className="fas fa-print"></i>
                                    </span>
                                </a>
                            </td>
                            <td className="text-center align-middle p-0 ">
                                <a onClick={() => ExcludeProd(e.codigo)} className="fas fa-times btn btn-sm text-danger"></a>
                            </td>
                        </>}

                    </tr>

                }) : <tr><td colSpan="5"><div className="p-1 text-center">Nenhum produto cadastrado</div></td></tr>}

            </tbody>
        </table>
    </>)
}