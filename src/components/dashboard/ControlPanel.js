/* import { useEffect } from "react"; */
import axios from "axios";
import { useState, useContext } from "react";
import ControlCards from "../cards/ControlCards";
import UserInfoCard from "../cards/UserInfoCard";
import Graficos from "../charts/Graficos";

export default function ControlPanel() {

    const [firstRender, setFirstRender] = useState(true);
    const [list, setList] = useState(null);
    const [dataPeriodo, setDataPeriodo] = useState(null);

    function ChangePeriodo(value) {
        let valor = String(value).split('-', 10);
        let mes = valor[1];
        let ano = valor[0];

        let date = [Number(ano), (Number(mes) - 1)];

        setDataPeriodo(date)
    }
    async function Get() {
        setFirstRender(false);

        try {
            var ret = await axios.post('/api/listTable', { table: "usuarios" });
            if (ret.data.result) {
                var data = ret.data.result;
                data = data.filter((e) => {
                    if (e.usuario != "phchortolani") {
                        return e;
                    }
                })
                setList(data);
            }
        } catch (error) {

        }

    }

    if (firstRender) {
        Get();
    }




    return (<>
        {/* <div className="d-sm-flex align-items-center justify-content-between mb-4 disabled">
            <h1 className="h3 mb-0 text-gray-800">Controle</h1>
            <a href="#" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                className="fas fa-download fa-sm text-white-50"></i> Baixar relatório</a>
        </div> */}

        <div className="col-md-3 pl-0 pr-0 pr-md-3">
            <label>Selecionar período </label>
            <input id="date" className="form-control mr-0 mb-2" type="month" onChange={(e) => ChangePeriodo(e.target.value)} />
        </div>



        <ControlCards dataPeriodo={dataPeriodo} />
        <div className="row mb-2">
            {list ? list.map((e, i) => {
                return <UserInfoCard key={i} dataPeriodo={dataPeriodo} usuario={e.usuario} />
            }) : ""}
        </div>
        <Graficos />

        <footer className="mt-2 mb-3" style={{ color: "black", textAlign: "center" }}>
            <span className="text-center text-muted ">
                <a href="https://lanisystems.vercel.app" target={'_blank'}> <img className="animated--fade-in" src="/lani-5andar1.svg" width={110}></img></a>
            </span>
        </footer>
    </>)
}