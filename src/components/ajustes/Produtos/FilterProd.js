import { useState } from "react";


export default function FilterProd(props) {
    const [criterio, setCriterio] = useState(true);
    return (<>
        <div className="row">
            <div className="col-md-2">
                <div className="mb-1">
                    <label htmlFor="cat">Categoria</label>
                    <select id="cat" className="form-control form-control-sm border-left-primary" >
                        <option >Todas</option>
                        {props.categorias ? props.categorias?.map((e, i) => { return <option key={i} value={e.descricao}>{e.descricao}</option> }) : ""}
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
    </>)
}