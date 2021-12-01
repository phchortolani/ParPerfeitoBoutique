import { useState } from "react";

export default function SideBar(props) {

    const [SideBarMini, setSideBarMini] = useState(true);
    const [AccordionCadastros, setAccordionCadastros] = useState(false);

    function updateMenu(menu) {
        props.SetActualPanel(menu);
        setAccordionCadastros(false);
        props.SetSideBarMini(true);
    }

    return (
        <ul className={"navbar-nav bg-gradient-primary sidebar sidebar-dark accordion " + (SideBarMini && props.SideBarMini ? "toggled" : "")} id="accordionSidebar">
            <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                <div className="sidebar-brand-text mx-3">Par Perfeito</div>
            </a>
            <hr className="sidebar-divider my-0" />
            <li className="nav-item active">
                <a className="nav-link" onClick={() => updateMenu("Painel")}>
                    <i className="fas fa-fw fa-tachometer-alt"></i>
                    <span>Controle</span></a>
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
                        <a className="collapse-item" onClick={() => updateMenu("Categorias")} href="#">Categorias</a>
                        {/*      <a className="collapse-item" onClick={() => updateMenu("Usuários")} href="#">Usuários</a> */}
                        <a className="collapse-item" onClick={() => updateMenu("Produtos")} href="#">Produtos</a>
                        <a className="collapse-item" onClick={() => updateMenu("Usuários")} href="#">Usuários</a>
                    </div>
                </div>
            </li>
            <hr className="sidebar-divider" />
            <div className="sidebar-heading">
                Serviços
            </div>

            <li onClick={() => props.SetSideBarMini(true)} className="nav-item">
                <a className="nav-link" onClick={() => updateMenu("Vendas")}>
                    <i className="fas fa-fw fa-cash-register"></i>
                    <span>Vendas</span></a>
            </li>

            {/*    <li className="nav-item">
                <a className="nav-link" href="tables.html">
                    <i className="fas fa-fw fa-table"></i>
                    <span>Tables</span></a>
            </li> */}

            <hr className="sidebar-divider d-none d-md-block" />

            <li className="nav-item">
                <div className="text-center d-none d-md-inline">
                    <i style={{ cursor: 'pointer' }} onClick={() => { setSideBarMini(!SideBarMini) }}
                        className={"fas fa-arrow-left nav-link text-center " + (SideBarMini ? "fas fa-arrow-right" : "fas fa-arrow-left")}></i>
                </div>
            </li>
        </ul >)
}