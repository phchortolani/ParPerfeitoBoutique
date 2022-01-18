import axios from "axios";
import { useState, useEffect } from "react";

export default function ControlCards(props) {

    const [cardsInfo, setCardsInfo] = useState({
        ganhosMensais: 0,
        caixa: {
            totalhoje: 0,
            totalMes: 0
        },
        estoque: {
            estoqueTotal: 0,
            quantidadeProd: 0,
            porcentagem: 0
        },
        itensEmFalta: {
            itens: [],
            count: 0
        }
    });

    async function get() {
        var estoque = await axios.post('/api/listTable', { table: "produtos" });
        var vendas = await axios.post('/api/listTable', { table: "vendas" });
        if (estoque.data.result && vendas.data.result) {
            let TotalEstoque = estoque.data.result.reduce((previousValue, currentValue) => Number(previousValue) + Number(currentValue.qtEstoque), 0);
            let TotalQuantidade = estoque.data.result.reduce((previousValue, currentValue) => Number(previousValue) + Number(currentValue.quantidade), 0);

            vendas = vendas.data.result.filter((e) => {
                if (new Date(`${e.dataCriacao}`).toLocaleDateString() == new Date().toLocaleDateString()) {
                    return e;
                }
            })

            let totalVenda = vendas.reduce((previousValue, currentValue) =>
                Number(previousValue) + Number(currentValue.valorVenda) - Number(currentValue?.desconto?.descontado ?? 0), 0
            );


            let itensEmFalta = [];

            estoque.data.result.forEach(e => {
                if (e.quantidade == 0) itensEmFalta.push(e);
            });

            setCardsInfo({
                estoque: { TotalEstoque: 0, TotalQuantidade: 0, porcentagem: Math.floor(TotalQuantidade / TotalEstoque * 100), },
                itensEmFalta: {
                    itens: itensEmFalta,
                    count: itensEmFalta.length
                },
                caixa: {
                    totalhoje: totalVenda
                }
            });
        }

    }

    useEffect(() => {
        get();
    }, []);

    return (<>

        <div className="row">

            <div className="col-xl-3 col-md-6 mb-4 disabled">
                <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    Ganhos Mensais</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">R$ 40,000</div>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-calendar fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4 ">
                <div className="card border-left-success shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                    Caixa (Hoje)</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">{cardsInfo.caixa.totalhoje.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</div>
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
                                        <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{cardsInfo.estoque.porcentagem}%</div>
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
                                <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-warning shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                    Itens em falta</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">{cardsInfo.itensEmFalta.count}</div>
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