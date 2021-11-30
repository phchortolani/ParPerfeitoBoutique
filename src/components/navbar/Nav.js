import { useState, useContext } from "react"
import { AuthContext } from '../../../context/Auth2Context';

export default function Nav(props) {
    const [OpenNotific, setOpenNotific] = useState(false);
    const [LoginOption, setLoginOption] = useState(false);
    const { login, signOut } = useContext(AuthContext);

    return (
        <>
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <button id="sidebarToggleTop" onClick={() => props.SetSideBarMini(!props.SideBarMini)} className="btn btn-link d-md-none rounded-circle mr-3">
                    <i className="fa fa-bars"></i>
                </button>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item dropdown no-arrow mx-1">
                        <a onClick={() => { setOpenNotific(!OpenNotific) }} className={"nav-link " + (OpenNotific ? "" : "dropdown-toggle")} href="#" id="alertsDropdown">
                            <i className="fas fa-bell fa-fw"></i>
                            <span className="badge badge-danger badge-counter">3+</span>
                        </a>
                        <div className={"dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in " + (OpenNotific ? "show" : "")}
                            aria-labelledby="alertsDropdown">
                            <h6 className="dropdown-header">
                                Notificações
                            </h6>
                            <a className="dropdown-item d-flex align-items-center" href="#">
                                <div className="mr-3">
                                    <div className="icon-circle bg-primary">
                                        <i className="fas fa-file-alt text-white"></i>
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-gray-500">{new Date().toLocaleDateString("pt-BR")}</div>
                                    <span className="font-weight-bold">Nova categoria SAPATILHA adicionada.</span>
                                </div>
                            </a>
                            <a className="dropdown-item d-flex align-items-center" href="#">
                                <div className="mr-3">
                                    <div className="icon-circle bg-success">
                                        <i className="fas fa-donate text-white"></i>
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-gray-500">{new Date().toLocaleDateString("pt-BR")}</div>
                                    Uma venda foi efetuada no valor de R$234,00.
                                </div>
                            </a>
                            <a className="dropdown-item d-flex align-items-center" href="#">
                                <div className="mr-3">
                                    <div className="icon-circle bg-warning">
                                        <i className="fas fa-exclamation-triangle text-white"></i>
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-gray-500">{new Date().toLocaleDateString("pt-BR")}</div>
                                    O estoque de Acessórios está chegando ao fim.
                                </div>
                            </a>
                            <a className="dropdown-item text-center small text-gray-500" href="#">Mostrar todas as notificações</a>
                        </div>
                    </li>

                    <div className="topbar-divider d-none d-sm-block"></div>

                    <li className="nav-item dropdown no-arrow">
                        <a onClick={() => setLoginOption(!LoginOption)} className={"nav-link " + (LoginOption ? "" : "dropdown-toggle")} href="#" id="userDropdown">
                            <span className="mr-2 d-none d-lg-inline text-gray-600 small">{login}</span>
                            <img className="img-profile rounded-circle"
                                src="https://www.unifacef.com.br/wp-content/uploads/2018/08/semfoto.png" />
                        </a>
                        <div className={"dropdown-menu dropdown-menu-right shadow animated--grow-in " + (LoginOption ? "show" : "")}>
                            <a className="dropdown-item" href="#">
                                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                Perfil
                            </a>
                            <a className="dropdown-item" href="#">
                                <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                                Configurações
                            </a>
                            <div className="dropdown-divider"></div>
                            <a onClick={() => signOut()} className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                Sair
                            </a>
                        </div>
                    </li>

                </ul>

            </nav>
        </>
    )
}
