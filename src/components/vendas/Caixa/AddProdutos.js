import { useState } from "react";

export default function AddProdutos(props) {
    const [prodSear, setProdSear] = useState(null);

    function AddProd() {
        props.AddItem(prodSear, true);
        setProdSear(null);
    }

    function Real(value) {
        return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    }

    return (<>
        <div className="row">
            {/*     <div className="col-md-12">
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
            </div> */}
            <div className="col-md-12">
                <div onKeyPress={(e) => { `${e.key}` == 'Enter' ? AddProd() : "" }} className="mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                    <div className="input-group">
                        <input placeholder="Adicionar Produto" value={prodSear ? prodSear : ""} onChange={(e) => setProdSear(e.target.value)} className="form-control bg-light border-0 small" list="sear" id="pesq" />
                        <datalist id="sear">
                            {props.produtos ? props.produtos.map((e, i) => {
                                return <option key={i} value={e.codigo}>{e.codigo} - {e.descricao} - {Real(e.valor)} - Qnt. {e.quantidade}</option>
                            }) : ""}
                        </datalist>
                        <div className="input-group-append">
                            <button className="btn btn-primary" onClick={() => AddProd()} type="button">
                                <i className="fas fa-plus-square fa-sm"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}