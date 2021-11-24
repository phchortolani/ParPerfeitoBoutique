import { useState } from "react";
import DefaultCard from "../cards/DefaultCard";

export default function Produtos() {

    const [criterio, setCriterio] = useState(true);

    return (<>
        <DefaultCard title="Inclusões">
            <div className="row">
                <div className="col-6">

                </div>
            </div>
        </DefaultCard>
        <DefaultCard title="Lista de produtos">
            <div className="row">
                <div className="col-md-2">
                    <div className="mb-1">
                        <label htmlFor="cat">Categoria</label>
                        <select id="cat" className="form-control form-control-sm border-left-primary" defaultValue="87" >
                            <option >Todas</option>
                            <option >Brincos</option>
                            <option >Sapatilhas</option>
                        </select>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="row">
                        <div className="col-9">
                            <div className="mb-1">
                                <label htmlFor="cat">Critério</label>
                                <select onChange={(e) => { setCriterio((e.target.value == "")) }} id="cat" className="form-control form-control-sm border-left-primary">
                                    <option value=""> Nenhum</option>
                                    <option value="maior">Maior que:</option>
                                    <option value="igual">Igual a:</option>
                                    <option value="menor">Menor que:</option>
                                </select>
                            </div>
                        </div>
                        <div className={"col-3 " + (criterio ? "d-none" : "")}>
                            <label htmlFor="Quantidade">Qtd.</label>
                            <input id="Quantidade" className="form-control form-control-sm border-left-primary"></input>
                        </div>
                    </div>
                </div>
                <div className="col-md-7">
                    <form id="search" className="d-inline form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                        <div className="input-group">
                            <input type="text" className="form-control bg-light border-0 small" placeholder="Pesquisar" aria-label="Search" aria-describedby="basic-addon2" />
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="button">
                                    <i className="fas fa-search fa-sm"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

            </div>
            <hr />
            <table style={{ whiteSpace: "nowrap" }} className="table table-bordered table-sm table-responsive-sm dataTable" id="dataTable" width="100%" cellSpacing="0" role="grid" >
                <thead>
                    <tr>
                        <th scope="col" className="fitCol">Código</th>
                        <th scope="col">Descrição</th>
                        <th scope="col" style={{ width: "7rem" }}>Valor</th>
                        <th scope="col" style={{ width: "12rem" }}>Categoria</th>
                        <th scope="col" style={{ width: "6rem" }}>Quantidade</th>
                        <th scope="col" className="text-center fitCol">Etiqueta</th>
                        <th scope="col" className="text-center fitCol">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">112598</th>
                        <td>Sapatilha Comum</td>
                        <td>R$ 25,98</td>
                        <td>
                            <select className="form-control form-control-sm">
                                <option>Sapatilhas</option>
                            </select>
                        </td>
                        <td>
                            <input className="form-control form-control-sm border-left-success" defaultValue="87" />
                        </td>
                        <td className="text-center align-middle p-0 ">
                            <a style={{ fontSize: 'x-small' }} href="#" className="btn btn-sm btn-info btn-icon-split">
                                <span className="icon text-white-50">
                                    <i className="fas fa-barcode"></i>
                                </span>
                                {/*                                 <span className="text d-none d-md-block">Imprimir</span>
 */}                            </a>
                        </td>
                        <td className="text-center align-middle p-0 ">
                            <a className="fas fa-times btn btn-sm text-danger"></a>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">122598</th>
                        <td>Sapatilha Mule</td>
                        <td>R$ 25,98</td>
                        <td><select className="form-control form-control-sm">
                            <option>Sapatilhas</option>
                            <option>Brincos</option>
                        </select>
                        </td>
                        <td>
                            <input className="form-control form-control-sm border-left-success" defaultValue="2" />
                        </td>
                        <td className="text-center align-middle p-0 ">
                            <a style={{ fontSize: 'x-small' }} href="#" className="btn btn-sm btn-info btn-icon-split">
                                <span className="icon text-white-50">
                                    <i className="fas fa-barcode"></i>
                                </span>
                                {/*                                 <span className="text d-none d-md-block">Imprimir</span>
 */}                            </a>
                        </td>
                        <td className="text-center align-middle p-0 ">
                            <a className="fas fa-times btn btn-sm text-danger"></a>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">132598</th>
                        <td>Brinco Rubi</td>
                        <td>R$ 9,99</td>
                        <td><select className="form-control form-control-sm">
                            <option>Brincos</option>
                            <option>Sapatilhas</option>
                        </select>
                        </td>
                        <td>
                            <input className="form-control form-control-sm border-left-danger" defaultValue="0" />
                        </td>
                        <td className="text-center align-middle p-0 ">
                            <a style={{ fontSize: 'x-small' }} href="#" className="btn btn-sm btn-info btn-icon-split">
                                <span className="icon text-white-50">
                                    <i className="fas fa-barcode"></i>
                                </span>
                                {/*                                 <span className="text d-none d-md-block">Imprimir</span>
 */}                            </a>
                        </td>
                        <td className="text-center align-middle p-0 ">
                            <a className="fas fa-times btn btn-sm text-danger"></a>
                        </td>
                    </tr>

                </tbody>
            </table>
        </DefaultCard>
    </>)
}