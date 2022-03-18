import { useState } from "react";


export default function FilterProd(props) {

    const [filters, setFilters] = useState({
        codCategoria: 0,
        criterio: 0,
        qt: 0,
        termo: ""
    });

    function CriterioOnChange(e) {
        setFilters({ ...filters, criterio: Number(e.target.value) })
    }

    return (<>
        <div className="row">
            <div className="col-md-4">
                <div className="mb-1">
                    <label htmlFor="cat">Categoria</label>
                    <select onChange={(e) => setFilters({ ...filters, codCategoria: Number(e.target.value) })} id="cat" className="form-control form-control-sm border-left-primary" >
                        <option value="0">Todas</option>
                        {props.categorias ? props.categorias?.map((e, i) => { return <option key={i} value={e.codigo}>{e.descricao}</option> }) : ""}
                    </select>
                </div>
            </div>
            <div className="col-md-4">
                <div className="row">
                    <div className="col-md-7">
                        <div className="mb-1">
                            <label htmlFor="cat">Critério</label>
                            <select onChange={(e) => { CriterioOnChange(e) }} id="cat" className="form-control form-control-sm border-left-primary">
                                <option value="0">Nenhum</option>
                                <option value="1">Maior que:</option>
                                <option value="2">Igual a:</option>
                                <option value="3">Menor que:</option>
                            </select>
                        </div>
                    </div>
                    <div className={"col-md-5 " + (filters.criterio == 0 ? "d-none" : "")}>
                        <label htmlFor="Quantidade">Qtd.</label>
                        <input id="Quantidade" onChange={(e) => setFilters({ ...filters, qt: Number(e.target.value) })} className="form-control form-control-sm border-left-primary"></input>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div id="search" className="d-inline form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                    <div className="input-group">
                        <input onKeyDown={(e) => e.key == 'Enter' ? props.SearchFilters(filters) : ""} onChange={(e) => setFilters({ ...filters, termo: e.target.value })} type="text" className="form-control bg-light border-0 small" placeholder="Pesquisar código ou descrição" aria-label="Search" aria-describedby="basic-addon2" />
                        <div className="input-group-append">
                            <button className="btn btn-primary" type="button" onClick={() => props.SearchFilters(filters)} >
                                <i className="fas fa-search fa-sm"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </>)
}