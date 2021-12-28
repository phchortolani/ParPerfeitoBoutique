export default function Pagamento(props) {

    let total = props.cart.reduce((anterior, atual) => anterior + atual.item.valor * atual.qt, 0);

    return (<>
        <label htmlFor="pgt">Meio de pagamento</label>
        <select name="pgt" className="form-control form-control-sm mb-3" id="pgt">
            <option value="">Selecione...</option>
            <option value="debito">Crédito</option>
            <option value="credito">Débito</option>
            <option value="credito">Dinheiro</option>
        </select>

        <label htmlFor="voucher">Cupom de desconto</label>
        <input id="voucher" className="form-control form-control-sm" placeholder="Voucher" />


        <hr />
        <h6 className="text-center text-gray-900">Desconto: R$ 0</h6>
        <h4 className="text-center text-gray-900">Total: {total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</h4>
        <hr />

        <div className="d-flex justify-content-between">
            <a className="btn btn-danger btn-sm btn-icon-split">
                <span className="icon text-white-50">
                    <i className="fas fa-check"></i>
                </span>
                <span className="text">Cancelar</span>
            </a>
            <a className="btn btn-success btn-sm btn-icon-split">
                <span className="icon text-white-50">
                    <i className="fas fa-check"></i>
                </span>
                <span className="text">Finalizar</span>
            </a>

        </div>
    </>)
}