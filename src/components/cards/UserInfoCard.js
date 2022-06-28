import axios from "axios";
import { useState, useContext } from "react";
import Loading from "../load/Loading";
//import { AuthContext } from "../../../context/Auth2Context";


var dataConsultada = new Date();

export default function UserInfoCard(props) {
    const [dados, setDados] = useState(null);
    const [firstRender, setFirstRender] = useState(true);
    //const { isMobile } = useContext(AuthContext);
    const [porcentagem, setPorcentagem] = useState(10);

    let stats = {
        qtMes: 0,
        valorAReceber: 0,
        valorMes: 0,
        qtHoje: 0,
        valorHoje: 0
    }

    let DataConsulta = new Date();
    if (props.dataPeriodo) {
        DataConsulta = new Date(String(props.dataPeriodo[0]), String(props.dataPeriodo[1]));
    }
    if (dados) {
        let vendas = dados.vendas;

        let _qtMes = vendas.filter((e) => {
            if (new Date(`${e.dataCriacao}`).getMonth() == DataConsulta.getMonth() &&
                new Date(`${e.dataCriacao}`).getFullYear() == DataConsulta.getFullYear() && !e.cancelada) {
                return e;
            }
        })

        let _valorMes = _qtMes.reduce((previousValue, currentValue) =>
            Number(previousValue) + Number(currentValue.valorVenda) - Number(currentValue?.desconto?.descontado ?? 0), 0
        );

        let _qtHoje = vendas.filter((e) => {
            if (new Date(`${e.dataCriacao}`).toLocaleDateString() == new Date().toLocaleDateString() && !e.cancelada) {
                return e;
            }
        });

        let _valorHoje = _qtHoje.reduce((previousValue, currentValue) =>
            Number(previousValue) + Number(currentValue.valorVenda) - Number(currentValue?.desconto?.descontado ?? 0), 0
        );

        let _valorAReceber = (_valorMes / 100) * (porcentagem / 100) * 100;

        stats = {
            qtMes: _qtMes,
            valorAReceber: _valorAReceber,
            valorMes: _valorMes,
            qtHoje: _qtHoje,
            valorHoje: _valorHoje
        };

    }


    function Real(value) {
        return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    }

    if (props.dataPeriodo != null) {
        if (dataConsultada != props.dataPeriodo) {
            dataConsultada = props.dataPeriodo;
            get(true);
        }
    }
    async function get(obtemnovadata = false) {
        setFirstRender(false);
        try {
            if (!dados && props.usuario || obtemnovadata) {
                let dataUser = await axios.post('/api/getDataUserInfo', { usuario: props.usuario });
                if (dataUser.data?.result) {
                    var data = dataUser.data.obj;
                    setDados(data);
                }
            }
        } catch (error) {
            console.log(error.message + " in UserInfoCard");
        }
    }

    if (!dados && firstRender) get();
    return (
        dados ?
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-secondary shadow h-100 py-2 ">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <h5 className="text-xs font-weight-bold text-primary text-uppercase mb-1">{dados.userinfo?.nome} - {DataConsulta.toLocaleString('pt-BR', { month: 'long' }).toLocaleUpperCase()}</h5>
                                <ul style={{ listStyle: "none" }} className="d-flex justify-content-between mt-2 pl-0">
                                    <li>Mês: <b className="text-success">{Real(stats.valorMes)}</b> </li>
                                    {DataConsulta.toLocaleString('pt-BR', { month: 'long' }).toLocaleUpperCase() == new Date().toLocaleString('pt-BR', { month: 'long' }).toLocaleUpperCase() ? <li>Hoje:  <b className="text-success">{Real(stats.valorHoje)}</b></li> : ""}

                                </ul>
                                <hr></hr>
                                <ul style={{ listStyle: "none" }} className="d-flex justify-content-between pl-0">
                                    <li><i className="fa fa-calendar-alt"></i> Mês:  <b >{stats.qtMes.length}</b></li>
                                    {DataConsulta.toLocaleString('pt-BR', { month: 'long' }).toLocaleUpperCase() == new Date().toLocaleString('pt-BR', { month: 'long' }).toLocaleUpperCase() ? <li><i className="fa fa-calendar-day"></i> Hoje:  <b >{stats.qtHoje.length}</b></li> : ""}
                                </ul>
                                <hr></hr>
                                <ul style={{ listStyle: "none" }} className="d-flex justify-content-between pl-0">
                                    <li><b>Comissão: </b> </li>
                                    <li><input type="range" min={0} max={100} onChange={(e) => setPorcentagem(e.target.value)} value={porcentagem} /></li>
                                    <li><b>{porcentagem}%</b></li>
                                </ul>
                                <hr />
                                <ul style={{ listStyle: "none" }} className=" pl-0 mb-0 pl-0">
                                    <li> Comissão: <b className="text-success text-lg"> {Real(stats.valorAReceber)} </b> </li>
                                </ul>




                                {/*  <div className="h5 mb-0 font-weight-bold text-gray-800">{<Loading size={23} />}</div> */}
                            </div>

                        </div>
                    </div>
                </div>
            </div> : <div className="col-sm-12 col-md-3 mb-2"><Loading size="50" /></div>

        /* dados ? <div className="col-sm-12 col-md-3 mb-2">
            <div className="cardUserInfo shadow ">
                <div className={"additional " + (isMobile ? "w-100" : "")}>
                    <div className={"user-cardUserInfo " + (isMobile ? "d-none" : "")}>
                        <div style={{ display: "grid", placeContent: "center", height: "100%" }} className="text-center justify-content-center align-content-between p-2">
                            <div className="level center">
                                {DataConsulta.toLocaleString('default', { month: 'long' }).toLocaleUpperCase()}
                            </div>
                            <img height={100} className="img-profile rounded-circle"
                                src="https://www.unifacef.com.br/wp-content/uploads/2018/08/semfoto.png" />
                            <div className="points center">
                                HOJE
                            </div>
                            <div className="points center">
                                {Real(stats.valorHoje)}
                            </div>
                        </div>
                    </div>
                    <div className={"more-info" + (isMobile ? "position-static" : "")} >
                        <h4 className="elipsar">{dados.userinfo.nome}</h4>
                        <div className="coords">
                            <b>Comissão: {porcentagem}%</b>
                        </div>
                        <div className="coords">
                            <b>Mês: {Real(stats.valorMes)}</b>
                        </div>

                        <div className="coords">
                            <b>Hoje: {Real(stats.valorHoje)}</b>
                        </div>

                        <div className="stats">
                            <div>
                                <div className="title pb-1">Hoje</div>
                                <i className="fa fa-calendar-day"></i>
                                <div className="value pt-2">{stats.qtHoje.length}</div>
                            </div>
                            <div>
                                <div className="title pb-1">Mês</div>
                                <i className="fa fa-calendar-alt"></i>
                                <div className="value pt-2">{stats.qtMes.length}</div>
                            </div>
                            <div>
                                <div className="title pb-1">Comissão</div>
                                <i className="fa fa-dollar-sign"></i>
                                <div className="value pt-2">{Real(stats.valorAReceber)}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="general pt-2">
                    <h3 style={{ textTransform: "capitalize" }}>{props.usuario}</h3>
                    <p>Resumo das vendas do(a) {props.usuario}</p>
                    <span className="more">Passe o mouse para mais detalhes</span>
                </div>
            </div>
        </div> : <div className="col-sm-12 col-md-3 mb-2"><Loading size="50" /></div> */

    )
}