
import { useEffect, useState } from "react";
import InitDash from "../../js/charts";
import axios from "axios";
import Loading from "../load/Loading";
export default function Graficos() {

    const [graficos, setGraficos] = useState({
        PorcentagemDoEstoque: {
            categorias: [],
            produtos: [],
            loading: false
        }
    });

    function CalculaPorcentagem(codCateg) {

        if (graficos.PorcentagemDoEstoque.produtos.length > 0) {

            let produtos = graficos.PorcentagemDoEstoque.produtos.filter((e) => {
                if (e.codCategoria == Number(codCateg)) {
                    return e;
                }
            });

            if (produtos.length > 0) {
                let totalEstoque = produtos.reduce((previousValue, currentValue) => Number(previousValue) + Number(currentValue.qtEstoque), 0);
                let totalQuantidade = produtos.reduce((previousValue, currentValue) => Number(previousValue) + Number(currentValue.quantidade), 0);
                return Math.floor(totalQuantidade / totalEstoque * 100);
            }

        }
        return 0;
    }
    async function get() {
        setGraficos({
            PorcentagemDoEstoque: { loading: true }
        });
        var categorias = await axios.post('/api/listTable', { table: "categorias" });
        var produtos = await axios.post('/api/listTable', { table: "produtos" });
        if (categorias.data.result && produtos.data.result) {
            setGraficos({
                PorcentagemDoEstoque: { categorias: categorias.data.result, produtos: produtos.data.result, loading: false }
            });
        }

    }
    useEffect(() => {
        get();
        InitDash();
    }, []);

    return (

        <>
            <div className="row disabled">
                <div className="col-xl-8 col-lg-7">
                    <div className="card shadow mb-4">
                        <div
                            className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">Visualização de ganhos</h6>
                            <div className="dropdown no-arrow">
                                <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                    aria-labelledby="dropdownMenuLink">
                                    <div className="dropdown-header">Dropdown Header: </div>
                                    <a className="dropdown-item" href="#">Action</a>
                                    <a className="dropdown-item" href="#">Another action</a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="#">Something else here</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="chart-area">
                                <canvas id="myAreaChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 col-lg-5">
                    <div className="card shadow mb-4">
                        <div
                            className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">Categorias mais vendidas</h6>
                            <div className="dropdown no-arrow">
                                <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                    aria-labelledby="dropdownMenuLink">
                                    <div className="dropdown-header">Dropdown Header: </div>
                                    <a className="dropdown-item" href="#">Action</a>
                                    <a className="dropdown-item" href="#">Another action</a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="#">Something else here</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="chart-pie pt-4 pb-2">
                                <canvas id="myPieChart"></canvas>
                            </div>
                            <div className="mt-4 text-center small">
                                <span className="mr-2">
                                    <i className="fas fa-circle text-primary"></i> Sapatilhas
                                </span>
                                <span className="mr-2">
                                    <i className="fas fa-circle text-success"></i> Roupas
                                </span>
                                <span className="mr-2">
                                    <i className="fas fa-circle text-info"></i> Bolsas
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Porcentagem do estoque</h6>
                        </div>
                        <div className="card-body">
                            {graficos.PorcentagemDoEstoque.loading ? <div className="text-center text-primary"><Loading size={55}/></div> : ""}
                                {graficos.PorcentagemDoEstoque?.categorias?.length > 0 ?
                                    graficos.PorcentagemDoEstoque.categorias.map((e, i) => {
                                        let porcentagem = CalculaPorcentagem(e.codigo);
                                        let cor = porcentagem <= 20 ? "bg-danger" :
                                            porcentagem <= 40 ? " bg-warning" :
                                                porcentagem <= 60 ? "bg-primary" :
                                                    porcentagem <= 80 ? "bg-info" :
                                                        porcentagem <= 100 ? "bg-success" : "";
                                        return <div key={i}>
                                            <h4 className="small font-weight-bold">{e.descricao} <span
                                                className="float-right">{porcentagem}%</span></h4>
                                            <div className="progress mb-4">
                                                <div className={"progress-bar " + (cor)} role="progressbar" style={{ width: porcentagem + "%" }}
                                                    aria-valuenow={porcentagem} aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    }) : ""}
                                {/* 
                            <h4 className="small font-weight-bold">Acessórios <span
                                className="float-right">40%</span></h4>
                            <div className="progress mb-4">
                                <div className="progress-bar bg-warning" role="progressbar" style={{ width: "40%" }}
                                    aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <h4 className="small font-weight-bold">Chinelos <span
                                className="float-right">60%</span></h4>
                            <div className="progress mb-4">
                                <div className="progress-bar" role="progressbar" style={{ width: "60%" }}
                                    aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <h4 className="small font-weight-bold">Bolsas <span
                                className="float-right">80%</span></h4>
                            <div className="progress mb-4">
                                <div className="progress-bar bg-info" role="progressbar" style={{ width: "80%" }}
                                    aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <h4 className="small font-weight-bold">Roupas  <span
                                className="float-right">50%</span></h4>
                            <div className="progress">
                                <div className="progress-bar bg-success" role="progressbar" style={{ width: "50%" }}
                                    aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                            </div> */}
                            </div>
                            </div>
                </div>
                    </div>
                </>
                )
}