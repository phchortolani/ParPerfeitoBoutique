import { useState } from "react";

export default function Pagamento(props) {

    const [tipoPgt, setTipoPgt] = useState("");
    const [valorPago, setvalorPago] = useState(0);
    const [possuiVoucher, setpossuiVoucher] = useState(false);

    const [formaPagamento, setFormaPagamento] = useState({
        debito: false,
        credito: false,
        dinheiro: false,
        boleto: false,
        pix: false
    })

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

    function Limpar() {
        props.clearCart();
    }


    return (<>
        <div className="row">
            <div className="col-6">

                <label>Débito</label>
                <div className="row">
                    <div className="col-md-3">
                        <label className="switch">
                            <input type="checkbox" onClick={() => setFormaPagamento({ ...formaPagamento, debito: !formaPagamento.debito })} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="col-md-9">
                        <input type="text" className={"form-control form-control-sm " + (formaPagamento.debito ? "border-primary shadow-sm" : "disabled")} />
                    </div>
                </div>
                <label>Crédito</label>
                <div className="row">
                    <div className="col-md-3">
                        <label className="switch">
                            <input type="checkbox" onClick={() => setFormaPagamento({ ...formaPagamento, credito: !formaPagamento.credito })} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="col-md-9">
                        <input type="text" className={"form-control form-control-sm " + (formaPagamento.credito ? "border-primary shadow-sm" : "disabled")} />
                    </div>
                </div>
                <label>Dinheiro</label>
                <div className="row">
                    <div className="col-md-3">
                        <label className="switch">
                            <input type="checkbox" onClick={() => setFormaPagamento({ ...formaPagamento, dinheiro: !formaPagamento.dinheiro })} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="col-md-9">
                        <input value={valorPago} onChange={(e) => CalculaValorPago(e.target.value)} maxLength={10} id="vlrpago" className={"form-control form-control-sm " + (formaPagamento.dinheiro ? "border-primary shadow-sm" : "disabled")} />
                    </div>
                </div>
            </div>
            <div className="col-6">
                <label>Boleto</label>
                <div className="row">
                    <div className="col-md-3">
                        <label className="switch">
                            <input type="checkbox" onClick={() => setFormaPagamento({ ...formaPagamento, boleto: !formaPagamento.boleto })} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="col-md-9">
                        <input type="text" className={"form-control form-control-sm " + (formaPagamento.boleto ? "border-primary shadow-sm" : "disabled")} />
                    </div>
                </div>
                <label>Pix</label>
                <div className="row">
                    <div className="col-md-3">
                        <label className="switch">
                            <input onClick={() => setFormaPagamento({ ...formaPagamento, pix: !formaPagamento.pix })} type="checkbox" />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="col-md-9">
                        <input type="text" className={"form-control form-control-sm " + (formaPagamento.pix ? "border-primary shadow-sm" : "disabled")} />
                    </div>
                </div>
                <label>Voucher</label>
                <div className="row">
                    <div className="col-md-3">
                        <label className="switch">
                            <input type="checkbox" />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="col-md-9">
                        <input type="text" className="form-control form-control-sm" placeholder="Código" />
                    </div>
                </div>
            </div>
        </div>

        {/*        <label htmlFor="pgt">Meios de pagamento</label>
        <select name="pgt" value={tipoPgt} onChange={(e) => setTipoPgt(e.target.value)} defaultValue={tipoPgt} className="form-control form-control-sm mb-1" id="pgt">
            <option value="">Selecione...</option>
            <option value="Credito">Crédito</option>
            <option value="Debito">Débito</option>
            <option value="Dinheiro">Dinheiro</option>
        </select> */}
        {
            tipoPgt == "Dinheiro" ? <>
                <label htmlFor="vlrpago">Valor Pago</label>
                <input value={valorPago} onChange={(e) => CalculaValorPago(e.target.value)} maxLength={10} id="vlrpago" className="form-control form-control-sm" />
            </> : ""
        }
        <hr />
        <h6 className="text-center text-gray-900">Desconto: R$ 0</h6>
        {troco > 0 && formaPagamento.dinheiro ? <h5 className="text-center text-gray-900">Troco: {troco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h5> : ""}
        <h4 className="text-center text-gray-900">Total: {total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h4>
        <hr />

        {props.cart.length > 0 ?
            <div className="d-flex justify-content-between">
                <a className="btn btn-danger btn-sm btn-icon-split">
                    <span className="icon text-white-50">
                        <i className="fas fa-ban"></i>
                    </span>
                    <span onClick={() => Limpar()} className="text">Cancelar</span>
                </a>
                <a className="btn btn-primary btn-sm btn-icon-split">
                    <span className="icon text-white-50">
                        <i className="fas fa-people-carry"></i>
                    </span>
                    <span className="text">Reservar</span>
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