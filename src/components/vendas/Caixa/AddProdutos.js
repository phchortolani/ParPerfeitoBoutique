export default function addProdutos() {
    return (<>
        <div className="row">
            <div className="col-md-2">
                <label htmlFor="codig">Cód. Produto</label>
                <input type="text" id="codig" className="form-control form-control-sm mb-3 border-left-primary" />
            </div>

            <div className="col-md-4">
                <label htmlFor="sele">Produtos</label>
                <select className="form-control form-control-sm" id="sele">
                    <option value="">Selecione...</option>
                    <optgroup label="Brincos">
                        <option value="132598">132598 - Brinco Rubi R$ 9,99</option>
                    </optgroup>
                    <optgroup label="Sapatilhas">
                        <option value="112598">112598 - Sapatilha Comum - R$ 25,98</option>
                        <option value="122598">122598 - Sapatilha Mule - R$ 25,98</option>
                    </optgroup>
                </select>
            </div>

            <div className="col-md-6">
                <form className="d-inline form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">

                    <div className="input-group">
                        <input placeholder="Pesquisar" className="form-control bg-light border-0 small" list="sear" id="pesq" />
                        <datalist id="sear">
                            <option value="132598">132598 - Brinco Rubi R$ 9,99</option>
                            <option value="112598">112598 - Sapatilha Comum - R$ 25,98</option>
                            <option value="122598">122598 - Sapatilha Mule - R$ 25,98</option>
                        </datalist>


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