export default function AddProd() {
    return (<>
        <label htmlFor="desc">Descrição</label>
        <input type="text" id="desc" className="form-control mb-3 border-left-primary" placeholder="Ex.: Sapatilha" />

        <label htmlFor="valor">Valor</label>
        <input type="text" id="valor" className="form-control mb-3 border-left-primary" placeholder="Ex.: R$49,99" />

        <label htmlFor="cate">Categoria</label>
        <select id="cate" className="form-control mb-3 form-control-sm border-left-primary">
            <option disabled>Selecione...</option>
            <option >Brincos</option>
            <option >Sapatilhas</option>
        </select>

        <label htmlFor="qt">Quantidade</label>
        <input type="text" id="qt" className="form-control mb-3 border-left-primary w-50" placeholder="Ex.: 23" />
        <hr />
        <button type="button" className="btn btn-sm btn-primary">Adicionar</button>
    </>)
}