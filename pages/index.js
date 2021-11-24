import { useState } from "react";
import Categorias from "../src/components/ajustes/Categorias";
import ControlPanel from "../src/components/dashboard/ControlPanel";
import Nav from "../src/components/navbar/Nav";
import SideBar from "../src/components/sidebar/SideBar";


export default function Index() {
    const [SideBarMini, setSideBarMini] = useState(true);

    const [ActualPanel, setActualPanel] = useState("Painel");

    return (
        <div id="wrapper">
            <SideBar SideBarMini={SideBarMini} SetActualPanel={setActualPanel} />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <Nav SetSideBarMini={setSideBarMini} SideBarMini={SideBarMini} />
                    <div className="container-fluid">
                        {ActualPanel == "Painel" ? <ControlPanel /> : ""}
                        {ActualPanel == "Categorias" ? <Categorias /> : ""}
                    </div>
                </div>
            </div>
        </div>
    );
}