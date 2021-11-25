import { useState } from "react";
import Categorias from "../src/components/ajustes/Categorias";
import Produtos from "../src/components/ajustes/Produtos";
import ControlPanel from "../src/components/dashboard/ControlPanel";
import Nav from "../src/components/navbar/Nav";
import SideBar from "../src/components/sidebar/SideBar";
import Caixa from "../src/components/vendas/caixa";


export default function Index() {
    const [SideBarMini, setSideBarMini] = useState(true);
    const [ActualPanel, setActualPanel] = useState("Painel");

    return (
        <div id="wrapper">
            <SideBar SideBarMini={SideBarMini} SetActualPanel={setActualPanel} />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <Nav SetSideBarMini={setSideBarMini} SideBarMini={SideBarMini} />
                    <div className="container-fluid pl-2 pr-2 pl-md-4 pr-md-4">
                        {ActualPanel == "Painel" ? <ControlPanel /> : ""}
                        {ActualPanel == "Categorias" ? <Categorias /> : ""}
                        {ActualPanel == "Produtos" ? <Produtos /> : ""}
                        {ActualPanel == "Vendas" ? <Caixa /> : ""}
                    </div>
                </div>
            </div>
        </div>
    );
}