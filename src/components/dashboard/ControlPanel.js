/* import { useEffect } from "react"; */
import axios from "axios";
import { useState, useContext } from "react";
import ControlCards from "../cards/ControlCards";
import UserInfoCard from "../cards/UserInfoCard";
import Graficos from "../charts/Graficos";

export default function ControlPanel() {

    const [firstRender, setFirstRender] = useState(true);
    const [list, setList] = useState(null);


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

    if (firstRender) Get();

    return (<>
        {/* <div className="d-sm-flex align-items-center justify-content-between mb-4 disabled">
            <h1 className="h3 mb-0 text-gray-800">Controle</h1>
            <a href="#" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                className="fas fa-download fa-sm text-white-50"></i> Baixar relatório</a>
        </div> */}

        <ControlCards />

        <div className="row mb-2">
            {list ? list.map((e) => {
                return <UserInfoCard usuario={e.usuario} />
            }) : ""}
        </div>

        <Graficos />
    </>)
}