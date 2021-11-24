import { useState } from "react";
import ControlPanel from "../src/components/dashboard/ControlPanel";
import Nav from "../src/components/navbar/Nav";
import SideBar from "../src/components/sidebar/SideBar";


export default function Index() {
    const [SideBarMini, setSideBarMini] = useState(true);

    return (

        <div id="wrapper">
            <SideBar SideBarMini={SideBarMini} />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <Nav SetSideBarMini={setSideBarMini} SideBarMini={SideBarMini} />
                    <div className="container-fluid">
                        <ControlPanel />
                    </div>
                </div>
            </div>
        </div>
    );
}