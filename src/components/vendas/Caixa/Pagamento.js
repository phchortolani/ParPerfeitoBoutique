import { useState } from "react";

export default function Pagamento(props) {

    const [tipoPgt, setTipoPgt] = useState("");
    const [valorPago, setvalorPago] = useState(0);
    const [possuiVoucher, setpossuiVoucher] = useState(false);

    let total = props.cart.reduce((anterior, atual) => anterior + atual.item.valor * atual.qt, 0);
    let troco = 0;
    if (total && valorPago) total -= formataDecimal(valorPago);
    if (total < 0 && valorPago) {
        troco = total * -1;
        total = 0;
    }

    function CalculaValorPago(valor) {
        let getmoney = Number(valor.replace(/[\D]+/g, ''));
        setvalorPago(formatReal(getmoney));
    }
    function formatReal(int) {
        var tmp = int + '';
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if (tmp.length > 6)
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        return tmp;
    }

    function formataDecimal(valorStg) {
        let valorpuro = valorStg.toString().replace(".", '');
        valorpuro = valorpuro.replace(",", ".");
        return parseFloat(valorpuro);
    }

    function Limpar(){
        props.clearCart();
        setpossuiVoucher(false);
    }


    return (<>
        <label htmlFor="pgt">Meio de pagamento</label>
        <select name="pgt" value={tipoPgt} onChange={(e) => setTipoPgt(e.target.value)} defaultValue={tipoPgt} className="form-control form-control-sm mb-1" id="pgt">
            <option value="">Selecione...</option>
            <option value="Credito">Crédito</option>
            <option value="Debito">Débito</option>
            <option value="Dinheiro">Dinheiro</option>
        </select>
        {
            tipoPgt == "Dinheiro" ? <>
                <label htmlFor="vlrpago">Valor Pago</label>
                <input value={valorPago} onChange={(e) => CalculaValorPago(e.target.value)} maxLength={10} id="vlrpago" className="form-control form-control-sm" />
            </> : ""
        }


        {possuiVoucher ? <>
            <label htmlFor="voucher">Cupom de desconto</label>
            <input id="voucher" className="form-control form-control-sm" placeholder="Insira o código promocional" />
        </> : <a onClick={() => setpossuiVoucher(true)} className="btn btn-link text-decoration-none p-0 btn-sm text-primary">Inserir código promocional</a>}


        <hr />
        <h6 className="text-center text-gray-900">Desconto: R$ 0</h6>
        {troco > 0 && tipoPgt == "Dinheiro" ? <h5 className="text-center text-gray-900">Troco: {troco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h5> : ""}
        <h4 className="text-center text-gray-900">Total: {total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h4>
        <hr />

        {props.cart.length > 0 ? <div className="d-flex justify-content-between">
            <a className="btn btn-danger btn-sm btn-icon-split">
                <span className="icon text-white-50">
                    <i className="fas fa-ban"></i>
                </span>
                <span onClick={() => Limpar()} className="text">Cancelar</span>
            </a>
            <a className="btn btn-success btn-sm btn-icon-split">
                <span className="icon text-white-50">
                    <i className="fas fa-check"></i>
                </span>
                <span className="text">Finalizar</span>
            </a>

        </div> : ""}

    </>)
}