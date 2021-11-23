import { useState } from "react";

export default function SideBar() {

    const [SideBarMini, setSideBarMini] = useState(false);
    const [AccordionCadastros, setAccordionCadastros] = useState(false);

    return (


        <ul className={"navbar-nav bg-gradient-primary sidebar sidebar-dark accordion " + (SideBarMini ? "toggled" : "")} id="accordionSidebar">
            <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                <div className="sidebar-brand-text mx-3">Par Perfeito</div>
            </a>
            <hr className="sidebar-divider my-0" />
            <li className="nav-item active">
                <a className="nav-link" href="index.html">
                    <i className="fas fa-fw fa-tachometer-alt"></i>
                    <span>Painel</span></a>
            </li>
            <hr className="sidebar-divider" />

            <div className="sidebar-heading">
                Ajustes
            </div>
            <li className="nav-item">
                <a onClick={() => setAccordionCadastros(!AccordionCadastros)} className={"nav-link " + (AccordionCadastros ? "" : "collapsed")} href="#"
                    aria-expanded={AccordionCadastros}>
                    <i className="fas fa-fw fa-plus-square"></i>
                    <span>Cadastros</span>
                </a>
                <div id="collapseTwo" className={"collapse " + (AccordionCadastros ? "show" : "")} aria-labelledby="headingTwo" data-bs-parent="#accordionSidebar">
                    <div className="bg-white py-2 collapse-inner rounded">
                        <h6 className="collapse-header">Cadastros disponíveis</h6>
                        <a className="collapse-item" href="cards.html">Categorias</a>
                        <a className="collapse-item" href="buttons.html">Usuários</a>
                        <a className="collapse-item" href="cards.html">Mercadorias</a>
                    </div>
                </div>
            </li>
            <hr className="sidebar-divider" />
            <div className="sidebar-heading">
                Serviços
            </div>

            <li className="nav-item">
                <a className="nav-link" href="charts.html">
                    <i className="fas fa-fw fa-chart-area"></i>
                    <span>Venda</span></a>
            </li>

            <li className="nav-item">
                <a className="nav-link" href="tables.html">
                    <i className="fas fa-fw fa-table"></i>
                    <span>Tables</span></a>
            </li>

            <hr className="sidebar-divider d-none d-md-block" />

            <li className="nav-item">
                <div className="text-center d-none d-md-inline">
                    <i style={{ cursor: 'pointer' }} onClick={() => { setSideBarMini(!SideBarMini) }}
                        className={"fas fa-arrow-left nav-link text-center " + (SideBarMini ? "fas fa-arrow-right" : "fas fa-arrow-left")}></i>
                </div>
            </li>
        </ul >)
}