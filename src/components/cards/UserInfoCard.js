import axios from "axios";
import { useState } from "react";
import Loading from "../load/Loading";


export default function UserInfoCard(props) {
    const [dados, setDados] = useState(null);
    const [firstRender, setFirstRender] = useState(true);

    let qtMes = 0;
    let porcentagem = 10;
    let valorAReceber = 0;
    let valorMes = 0;
    let qtHoje = 0;
    let valorHoje = 0;
    if(dados){
        let vendas = dados.vendas;
        qtMes = vendas.filter((e) => {
            if (new Date(`${e.dataCriacao}`).getMonth() == new Date().getMonth() &&
                new Date(`${e.dataCriacao}`).getFullYear() == new Date().getFullYear()) {
                return e;
            }
        })
          valorMes = qtMes.reduce((previousValue, currentValue) =>
            Number(previousValue) + Number(currentValue.valorVenda) - Number(currentValue?.desconto?.descontado ?? 0), 0
        );

        qtHoje = vendas.filter((e) => {
            if (new Date(`${e.dataCriacao}`).toLocaleDateString() == new Date().toLocaleDateString()) {
                return e;
            }
        });

        valorHoje = qtHoje.reduce((previousValue, currentValue) =>
        Number(previousValue) + Number(currentValue.valorVenda) - Number(currentValue?.desconto?.descontado ?? 0), 0
    );

        valorAReceber = (valorMes / 100) * (porcentagem / 100) * 100;

    }    

    function Real(value){
        return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    }

    async function get() {
        setFirstRender(false);
        try {
            if (!dados && props.usuario) {
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
        dados ? <div className="col-sm-12 col-md-3 mb-2">
            <div className="cardUserInfo shadow">
                <div className="additional">
                    <div className="user-cardUserInfo">
                        <div style={{ display: "grid", placeContent: "center", height: "100%" }} className="text-center justify-content-center align-content-between p-2">
                            <div className="level center">
                                {new Date().toLocaleString('default', { month: 'long' }).toLocaleUpperCase()}
                            </div>
                            <img height={100} className="img-profile rounded-circle"
                                src="https://www.unifacef.com.br/wp-content/uploads/2018/08/semfoto.png" />
                            <div className="points center">
                               HOJE
                            </div>
                            <div className="points center">
                               {Real(valorHoje)}
                            </div>
                        </div>
                    </div>
                    <div className="more-info">
                        <h4>{dados.userinfo.nome}</h4>
                        <div className="coords">
                            <span>{dados.userinfo.email}</span>
                        </div>
                        <div className="coords">
                            <b>Comissão: {porcentagem}%</b>
                        </div>
                        <div className="coords">
                            <b>Mês: {Real(valorMes)}</b>
                        </div>

                        <div className="coords">
                            <b>Hoje: {Real(valorHoje)}</b>
                        </div>
                   
                        <div className="stats">
                            <div>
                                <div className="title pb-1">Hoje</div>
                                <i className="fa fa-calendar-day"></i>
                                <div className="value pt-2">{qtHoje.length}</div>
                            </div>
                            <div>
                                <div className="title pb-1">Mês</div>
                                <i className="fa fa-calendar-alt"></i>
                                <div className="value pt-2">{qtMes.length}</div>
                            </div>
                            <div>
                                <div className="title pb-1">Comissão</div>
                                <i className="fa fa-dollar-sign"></i>
                                <div className="value pt-2">{Real(valorAReceber)}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="general">
                    <h2>{props.usuario}</h2>
                    <p>Resumo das vendas do(a) {props.usuario}</p>
                    <span className="more">Passe o mouse para mais detalhes</span>
                </div>
            </div>
        </div> : <div className="col-sm-12 col-md-3 mb-2"><Loading size="50" /></div>

    )
}