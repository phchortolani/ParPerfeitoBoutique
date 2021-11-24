export default function AddCatg() {
    return (<>
        <label htmlFor="codigo">Código</label>
        <input type="text" id="codigo" className="form-control mb-3 border-left-primary" placeholder="Ex.: 23" />

        <label htmlFor="desc">Descrição</label>
        <input type="text" id="desc" className="form-control mb-3 border-left-primary" placeholder="Ex.: Sapatilha" />

        <label htmlFor="valor">Valor padrão</label>
        <input type="text" id="valor" className="form-control mb-3 border-left-primary" placeholder="Ex.: R$49,99" />
        <hr />
        <button type="button" className="btn btn-sm btn-primary">Adicionar</button>
    </>)
}