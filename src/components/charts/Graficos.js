
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../load/Loading";
import initDash from "../../js/charts";
export default function Graficos() {

    const [graficos, setGraficos] = useState({
        PorcentagemDoEstoque: {
            categorias: [],
            produtos: [],
            loading: false
        }
    });
    const [firstRender, setFirstRender] = useState(true);

    const [vendas, setVendas] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [CatMaisVendidas, setCatMaisVendidas] = useState(null);

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


    function gerarCor() {
        return '#' + parseInt((Math.random() * 0xFFFFFF))
            .toString(16)
            .padStart(6, '0');
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
        var vend = await axios.post('/api/listTable', { table: "vendas" });
        let temparray = [];
        if (vend.data.result) {

            for (let i = 0; i <= 11; i++) {
                let totalMes = vend.data.result.filter((e) => {
                    if (new Date(`${e.dataCriacao}`).getMonth() == i &&
                        new Date(`${e.dataCriacao}`).getFullYear() == new Date().getFullYear()) {
                        return e;
                    }
                });

                totalMes = totalMes.reduce((previousValue, currentValue) =>
                    Number(previousValue) + Number(currentValue.valorVenda) - Number(currentValue?.desconto?.descontado ?? 0), 0
                )
                temparray.push(totalMes);
            }


            let CategsMaisVendidas = [];

            vend.data.result.forEach(sell => {
                sell.itens.forEach((e) => {

                    let catego = categorias.data.result.find((x) => x.codigo == e.item?.codCategoria)?.descricao.trim();
                    let indexExiste = CategsMaisVendidas.findIndex((y) => y.codCateg.trim() == catego);
                    let cor = gerarCor();
                    if (indexExiste && indexExiste > -1) {
                        CategsMaisVendidas[indexExiste] = { codCateg: catego, qt: indexExiste ? Number(e.qt) + 1 : e.qt, cor };
                    } else {
                        CategsMaisVendidas.push({ codCateg: catego, qt: Number(e.qt), cor })
                    }
                });

            });

            let cats = CategsMaisVendidas?.sort((a, b) => b.qt - a.qt);

            setCatMaisVendidas(cats);
            setVendas([
                temparray[0],
                temparray[1],
                temparray[2],
                temparray[3],
                temparray[4],
                temparray[5],
                temparray[6],
                temparray[7],
                temparray[8],
                temparray[9],
                temparray[10],
                temparray[11]
            ]);
            setFirstRender(false);
        }
    }

    if (!firstRender) {
        initDash();
        // Set new default font family and font color to mimic Bootstrap's default styling
        Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        Chart.defaults.global.defaultFontColor = '#858796';

        // Area Chart Example
        var ctx = document.getElementById("myAreaChart");
        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
                datasets: [{
                    label: "Ganhos",
                    lineTension: 0.3,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: [vendas[0], vendas[1], vendas[2], vendas[3], vendas[4], vendas[5], vendas[6], vendas[7], vendas[8], vendas[9], vendas[10], vendas[11]],
                }],
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    xAxes: [{
                        time: {
                            unit: 'date'
                        },
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 7
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            maxTicksLimit: 5,
                            padding: 10,
                            // Include a dollar sign in the ticks
                            callback: function (value, index, values) {
                                return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
                            }
                        },
                        gridLines: {
                            color: "rgb(234, 236, 244)",
                            zeroLineColor: "rgb(234, 236, 244)",
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineBorderDash: [2]
                        }
                    }],
                },
                legend: {
                    display: false
                },
                tooltips: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    titleMarginBottom: 10,
                    titleFontColor: '#6e707e',
                    titleFontSize: 14,
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    intersect: false,
                    mode: 'index',
                    caretPadding: 10,
                    callbacks: {
                        label: function (tooltipItem, chart) {
                            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                            return datasetLabel + ': ' + tooltipItem.yLabel.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
                        }
                    }
                }
            }
        });

        Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        Chart.defaults.global.defaultFontColor = '#858796';

        // Pie Chart Example
        console.log(CatMaisVendidas);

        if (CatMaisVendidas) {
            var ctx = document.getElementById("myPieChart");
            var myPieChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: CatMaisVendidas.map((e) => e.codCateg),
                    datasets: [{
                        data: CatMaisVendidas.map((e) => e.qt),
                        backgroundColor: CatMaisVendidas.map((e) => e.cor),
                        hoverBackgroundColor: CatMaisVendidas.map((e) => e.cor),
                        hoverBorderColor: "rgba(234, 236, 244, 1)",
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    tooltips: {
                        backgroundColor: "rgb(255,255,255)",
                        bodyFontColor: "#858796",
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        caretPadding: 10,
                    },
                    legend: {
                        display: false
                    },
                    cutoutPercentage: 80,
                },
            });
        }


    }


    useEffect(() => {
        get();
    }, []);

    return (

        <>
            <div className="row">
                <div className="col-xl-8 col-lg-7">
                    <div className="card shadow mb-4">
                        <div
                            className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">Visualização de ganhos</h6>
                        </div>
                        <div className="card-body">
                            <div className="chart-area">
                                <div className="text-center text-primary align-self-center">
                                    {firstRender ? <Loading size={24} /> : ""}
                                </div>

                                <canvas id="myAreaChart"> </canvas>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 col-lg-5">
                    <div className="card shadow mb-4">
                        <div
                            className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">Categorias mais vendidas</h6>
                        </div>
                        <div className="card-body">
                            <div className="chart-pie pt-4 pb-2">
                                <canvas id="myPieChart"></canvas>
                            </div>
                            <div className="mt-4 text-center small">
                                {CatMaisVendidas ? CatMaisVendidas.map((e,i) => {
                                    return   <span className="mr-2">
                                    <i style={{color:e.cor}} className="fas fa-circle"></i> {e.codCateg}
                                </span>
                                }) : ""}
                              
                               
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
                        <div className="card-body" style={{
                            maxHeight: '300px',
                            overflow: "auto"
                        }}>
                            {graficos.PorcentagemDoEstoque.loading ? <div className="text-center text-primary"><Loading size={55} /></div> : ""}
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

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}