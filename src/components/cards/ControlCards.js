import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "../modal/Modal";
import Loading from "../load/Loading";

var dataConsultada = new Date();

export default function ControlCards(props) {

    const [modalCards, setmodalCards] = useState({
        isOpen: false,
        title: "",
        children: ""
    });

    function openModal(card) {
        setmodalCards({ isOpen: true, title: card });
    }

    const [cardsInfo, setCardsInfo] = useState({
        ganhosMensais: 0,
        caixa: {
            totalhoje: 0,
            totalMes: 0,
            itensHoje: [],
            loading: false
        },
        estoque: {
            estoqueTotal: 0,
            quantidadeProd: 0,
            porcentagem: 0,
            loading: false
        },
        itensEmFalta: {
            itens: [],
            count: 0,
            loading: false
        }
    });

    let DataConsulta = new Date();
    if (props.dataPeriodo) {
        DataConsulta = new Date(String(props.dataPeriodo[0]), String(props.dataPeriodo[1]));
    }

    if (props.dataPeriodo != null) {
        if (dataConsultada != props.dataPeriodo) {
            dataConsultada = props.dataPeriodo;
            get();
        }
    }

    async function get() {
        setCardsInfo({
            estoque: { loading: true }, itensEmFalta: { loading: true }, caixa: { loading: true }
        });
        var estoque = await axios.post('/api/listTable', { table: "produtos" });
        var vendas = await axios.post('/api/listTable', { table: "vendas" });
        if (estoque.data.result && vendas.data.result) {
            let TotalEstoque = estoque.data.result.reduce((previousValue, currentValue) => Number(previousValue) + Number(currentValue.qtEstoque), 0);
            let TotalQuantidade = estoque.data.result.reduce((previousValue, currentValue) => Number(previousValue) + Number(currentValue.quantidade), 0);

            let totalMes = vendas.data.result.filter((e) => {
                if (new Date(`${e.dataCriacao}`).getMonth() == DataConsulta.getMonth() &&
                    new Date(`${e.dataCriacao}`).getFullYear() == DataConsulta.getFullYear()) {
                    return e;
                }
            })

            let totalItensMes = totalMes;
            totalMes = totalMes.reduce((previousValue, currentValue) =>
                Number(previousValue) + Number(currentValue.valorVenda) - Number(currentValue?.desconto?.descontado ?? 0), 0
            );

            vendas = vendas.data.result.filter((e) => {
                if (new Date(`${e.dataCriacao}`).toLocaleDateString() == new Date().toLocaleDateString()) {
                    return e;
                }
            });
            let totalhj = vendas;

            let totalVenda = vendas.reduce((previousValue, currentValue) =>
                Number(previousValue) + Number(currentValue.valorVenda) - Number(currentValue?.desconto?.descontado ?? 0), 0
            );


            let itensEmFalta = [];

            estoque.data.result.forEach(e => {
                if (e.quantidade == 0) itensEmFalta.push(e);
            });

            setCardsInfo({
                estoque: {
                    TotalEstoque: 0,
                    TotalQuantidade: 0,
                    porcentagem: Math.floor(TotalQuantidade / TotalEstoque * 100),
                    loading: false,
                },
                itensEmFalta: {
                    itens: itensEmFalta,
                    count: itensEmFalta.length,
                    loading: false,
                },
                caixa: {
                    totalhoje: totalVenda,
                    totalMes: totalMes,
                    itensHoje: totalhj,
                    itensMes: totalItensMes,
                    loading: false,
                }
            });
        }

    }

    function ordenarPorData(arr = []) {

        if (arr.length > 0) {
            return arr.sort(function (a, b) {
                return new Date(a.dataCriacao).getTime() - new Date(b.dataCriacao).getTime()
            }).reverse();
        }

    }

    function MostrarMaisPagamento(pagamentos) {
        Swal.fire({
            title: '<strong>Pagamentos</strong>',
            icon: 'info',
            html:
                `<div class="text-center"><p class="mb-1">Débito: ${pagamentos.debito.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>` +
                `<p class="mb-1">Crédito: ${pagamentos.credito.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>` +
                `<p class="mb-1">Dinheiro: ${pagamentos.dinheiro.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>` +
                `<p class="mb-1">Boleto: ${pagamentos.boleto.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>` +
                `<p class="mb-1">Pix: ${pagamentos.pix.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p> </div>`
            ,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText:
                '<i class="fa fa-thumbs-up"></i> Ok!',
            confirmButtonAriaLabel: 'Thumbs up, great!'
        })
    }

    useEffect(() => {
        get();
    }, []);

    return (<>

        <Modal open={modalCards.isOpen} title={modalCards.title} onTop={true} overflowY={true} ModalBodyClass="p-0 max-modal-tela" closeModal={() => setmodalCards({ ...modalCards, isOpen: false })}>
            {modalCards.title == "Itens em falta" ? <>
                <ul className="list-group list-group-flush p-0">
                    {cardsInfo.itensEmFalta.itens.map((e, i) => {
                        return <li key={i} className="list-group-item">{e.codigo} - {e.descricao} - {e.valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</li>
                    })}

                </ul>

            </> : modalCards.title == "Caixa" ? <>
                <div className="list-group p-3">

                    {cardsInfo?.caixa?.itensHoje.length > 0 ? ordenarPorData(cardsInfo?.caixa?.itensHoje).map((e, i) => {
                        return <a key={i} href="#" className="list-group-item list-group-item-action border-0 shadow mb-2 p-3 levitation" onClick={() => MostrarMaisPagamento(e.pagamentos)}>
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1 text-success">{(Number(e.valorVenda) - Number(e.desconto?.descontado ?? 0)).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h5>
                                <small>{new Date(e.dataCriacao).toTimeString().split(' ')[0]}</small>
                            </div>
                            <p style={{ textTransform: "capitalize" }} className="mb-1">Vendedor: <b>{e.criadoPor}</b></p>
                            <hr className="mt-1 mb-1" />

                            {e.itens.length > 0 ? e.itens.map((itens, ikey) => {
                                let valortotal = itens.VoucherDescontado ? itens.VoucherDescontado + itens.item.valor : null;
                                let voucherdescont = null;
                                if (valortotal) voucherdescont = itens.voucher.codigo;
                                let valor = itens.item.valor;
                                return <p key={ikey} className="small mb-0"><b>{itens.qt}x</b> - {itens.item.codigo} - {itens.item.descricao}
                                    {voucherdescont ? <> (Cupom: <b className="text-primary">{voucherdescont}</b>)</> : ""}  {valortotal ? <b className="sublinhar"> {valortotal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</b> : ""}  - <b className="text-success">{valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</b> </p>;
                            }) : ""}
                            <hr className="mb-1 mt-1" />
                            <p className="small mb-0"><b>Sub-Total: </b> {e.valorVenda.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
                            {e.desconto != "" ? <p className="small mb-0">
                                <b>Desconto: </b>
                                <span className="text-danger">{e.desconto.descontado.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>  - {e.desconto.cupom}</p>
                                : ""}

                            <p className="small mb-0"><b>Total: </b> <span className="text-success font-weight-bold">{(Number(e.valorVenda) - Number(e.desconto?.descontado ?? 0)).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span></p>
                            <p className="small mb-0"><b>Valor Pago: </b> <span >{(Number(e.troco) + Number(e.valorVenda) - Number(e.desconto?.descontado ?? 0)).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span></p>
                            <p className="small mb-0"><b>Troco: </b> <span >{e.troco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span></p>
                        </a>

                    }) : ""}


                </div>

            </>
                : modalCards.title == "Ganhos mensais" ? <>
                    <div className="list-group p-3">

                        {cardsInfo?.caixa?.itensMes.length > 0 ? ordenarPorData(cardsInfo?.caixa?.itensMes).map((e, i) => {
                            return <a key={i} href="#" className="list-group-item list-group-item-action border-0 shadow mb-2 p-3 levitation" onClick={() => MostrarMaisPagamento(e.pagamentos)}>
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1 text-success">{(Number(e.valorVenda) - Number(e.desconto?.descontado ?? 0)).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h5>
                                    <small>{new Date(e.dataCriacao).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })} - {new Date(e.dataCriacao).toTimeString().split(' ')[0]}</small>
                                </div>
                                <p style={{ textTransform: "capitalize" }} className="mb-1">Vendedor: <b>{e.criadoPor}</b></p>
                                <hr className="mt-1 mb-1" />

                                {e.itens.length > 0 ? e.itens.map((itens, ikey) => {
                                    let valortotal = itens.VoucherDescontado ? itens.VoucherDescontado + itens.item.valor : null;
                                    let voucherdescont = null;
                                    if (valortotal) voucherdescont = itens.voucher.codigo;
                                    let valor = itens.item.valor;
                                    return <p key={ikey} className="small mb-0"><b>{itens.qt}x</b> - {itens.item.codigo} - {itens.item.descricao}
                                        {voucherdescont ? <> (Cupom: <b className="text-primary">{voucherdescont}</b>)</> : ""}  {valortotal ? <b className="sublinhar"> {valortotal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</b> : ""}  - <b className="text-success">{valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</b> </p>;
                                }) : ""}
                                <hr className="mb-1 mt-1" />
                                <p className="small mb-0"><b>Sub-Total: </b> {e.valorVenda.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
                                {e.desconto != "" ? <p className="small mb-0">
                                    <b>Desconto: </b>
                                    <span className="text-danger">{e.desconto.descontado.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>  - {e.desconto.cupom}</p>
                                    : ""}

                                <p className="small mb-0"><b>Total: </b> <span className="text-success font-weight-bold">{(Number(e.valorVenda) - Number(e.desconto?.descontado ?? 0)).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span></p>
                                <p className="small mb-0"><b>Valor Pago: </b> <span >{(Number(e.troco) + Number(e.valorVenda) - Number(e.desconto?.descontado ?? 0)).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span></p>
                                <p className="small mb-0"><b>Troco: </b> <span >{e.troco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span></p> </a>

                        }) : ""}


                    </div>

                </>
                    : ""}
        </Modal>
        <div className="row">
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2 levitation" onClick={() => cardsInfo.caixa.totalMes > 0 ? openModal("Ganhos mensais") : ""}>
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    Ganhos Mensais- {DataConsulta.toLocaleString('pt-BR', { month: 'long', year: "2-digit" }).toLocaleUpperCase()}</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">{!cardsInfo.caixa.loading ? cardsInfo.caixa.totalMes.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : <span className="text-primary"><Loading size={23} /></span>}</div>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-calendar fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4 ">
                <div className="card border-left-success shadow h-100 py-2 levitation" onClick={() => cardsInfo.caixa.totalhoje > 0 ? openModal("Caixa") : ""}>
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                    Caixa (Hoje)</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">{!cardsInfo.caixa.loading ? cardsInfo.caixa.totalhoje.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : <span className="text-success"><Loading size={23} /></span>}</div>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-info shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Estoque total
                                </div>
                                <div className="row no-gutters align-items-center">
                                    <div className="col-auto">
                                        <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{!cardsInfo.estoque.loading ? cardsInfo.estoque.porcentagem + '%' : <span className="text-info"><Loading size={23} /></span>}</div>
                                    </div>
                                    <div className="col">
                                        <div className="progress progress-sm mr-2">
                                            <div className="progress-bar bg-info" role="progressbar"
                                                style={{ width: cardsInfo.estoque.porcentagem + "%" }} aria-valuenow="50" aria-valuemin="0"
                                                aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-clipboard-list fa-2x text-gray-300 "></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4 ">
                <div className="card border-left-warning shadow h-100 py-2 levitation" onClick={() => cardsInfo.itensEmFalta.count > 0 ? openModal("Itens em falta") : ""}>
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs  mb-1">
                                    <a style={{ cursor: "pointer" }} className="font-weight-bold text-warning text-uppercase text-decoration-none"> Itens em falta </a>
                                </div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">{!cardsInfo.itensEmFalta.loading ? cardsInfo.itensEmFalta.count : <span className="text-warning"><Loading size={23} /></span>}</div>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-exclamation-triangle fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>)
}