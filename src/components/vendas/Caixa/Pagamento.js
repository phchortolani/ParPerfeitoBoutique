import { AuthContext } from "../../../../context/Auth2Context";
import axios from "axios";
import { useState, useContext } from "react";

export default function Pagamento(props) {

    const { login } = useContext(AuthContext);

    const [VoucherUpper, setVoucherUpper] = useState("");

    const [valorPago, setvalorPago] = useState({
        debito: 0,
        credito: 0,
        dinheiro: 0,
        boleto: 0,
        pix: 0
    });
    const [Voucher, setVoucher] = useState(null);

    const [formaPagamento, setFormaPagamento] = useState({
        debito: false,
        credito: false,
        dinheiro: false,
        boleto: false,
        pix: false
    })

    let totalCarrinho = props.cart.reduce((anterior, atual) => anterior + atual.item.valor * atual.qt, 0);
    let total = totalCarrinho;

    let troco = 0;
    let desconto = 0;
    let msgVoucher = "";

    if (total) {
        if (formaPagamento.debito) total -= formataDecimal(valorPago.debito);
        if (formaPagamento.credito) total -= formataDecimal(valorPago.credito);
        if (formaPagamento.dinheiro) total -= formataDecimal(valorPago.dinheiro);
        if (formaPagamento.boleto) total -= formataDecimal(valorPago.boleto);
        if (formaPagamento.pix) total -= formataDecimal(valorPago.pix);
    }
    if (Voucher) {

        let periodoinicial = new Date(Voucher.periodoini.split("T")[0]);
        let periodofinal = new Date(Voucher.periodofim.split("T")[0]);
        let dataatual = new Date(new Date().toISOString().split("T")[0]);

        if (periodoinicial <= dataatual && periodofinal >= dataatual) {
            let itensDesc = totalCarrinho;
            if (Voucher.codCategoria > 0) {
                let itensSelecionados = props.cart?.filter((e) => { if (e.item?.codCategoria == Voucher.codCategoria) return e });
                itensDesc = itensSelecionados.reduce((anterior, atual) => anterior + atual.item.valor * atual.qt, 0);
            }

            if (Voucher.tipoPorcentagem) {
                desconto = (Voucher.valorDesconto * itensDesc / 100);
                total -= desconto;
            }
            else {
                if (Voucher.minimoCompra > itensDesc) {
                    msgVoucher = `Valor mínimo de ${Voucher.minimoCompra.toLocaleString('pt-BR', { style: 'currency', currency: "BRL" })}`;
                } else if (itensDesc >= Voucher.valorDesconto) {
                    total -= desconto = Voucher.valorDesconto;
                } else msgVoucher = "O total é inferior ao desconto.";

            }
        } else msgVoucher = "Cupom fora de período.";

    }

    if (total < 0) {
        troco = total * -1;
        total = 0;
    }

    function CalculaValorPago(valor, tipo) {
        let getmoney = Number(valor.replace(/[\D]+/g, ''));
        let obj = { ...valorPago, [tipo]: formatReal(getmoney) };
        setvalorPago(obj);
    }

    async function checkVoucher(e) {
        if (e.trim().length > 0) {
            var ret = await axios.post('/api/checkVoucher', { codigoVoucher: e });
            if (ret.data.result) {
                if (!ret.data.result.individual) return setVoucher(ret.data.result);
            }
        }
        setVoucher(null);
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

    function Real(value) {
        return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    }

    async function Finalizar() {

        /*  var printContent = document.getElementById('teste'); */
        Swal.fire({
            title: 'Confirmar venda',
            /*  html: printContent.innerHTML, */
            html: "<b>Imprimir: </b><a href='#' class='text-decoration-none'>Recibo - (não fiscal)</a>",
            icon: 'question',
            showCancelButton: true,
            cancelButtonColor: '#e74a3b',
            confirmButtonColor: '#1cc88a',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                BaixaNoEstoque(props.cart);
                Limpar();
                MsgFinalizado();
            }
        })

    }


    async function BaixaNoEstoque(carrinho) {

        let venda = {
            itens: carrinho,
            pagamentos: {
                ...valorPago,
                debito: formataDecimal(valorPago.debito),
                credito: formataDecimal(valorPago.credito),
                dinheiro: formataDecimal(valorPago.dinheiro),
                boleto: formataDecimal(valorPago.boleto),
                pix: formataDecimal(valorPago.pix)
            },
            desconto: Voucher ? {
                cupom: Voucher.codigo ?? "",
                descontado: parseFloat(desconto.toFixed(2)),
                tipo: Voucher.tipoPorcentagem ? "Porcentagem" : "Reais"
            } : "",
            valorVenda: totalCarrinho,
            troco: parseFloat(troco.toFixed(2)),
            total: formataDecimal(total)
        }
        var vendaSave = await axios.post('/api/saveone', { obj: venda, table: "vendas", login: login });

        if (vendaSave.data.result) {
            await carrinho.forEach(e => {
                let vlr = e.VoucherDescontado ? e.item.valor + e.VoucherDescontado : e.item.valor;
                var ret = axios.post('/api/saveone', { obj: { ...e.item, quantidade: e.item.quantidade - parseInt(e.qt), valor: vlr }, table: "produtos", login: login, update: true });
            });

            if (props.numberReserva > 0) {
                var deletereserv = await axios.post('/api/deleteone', { table: "reservas", where: { reserva: Number(props.numberReserva) } });
            }
        }

        await props.GetList();
    }


    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    async function saveReserv(numDaReserva, nome, telefone) {
        try {

            let cart = await props.cart.map(e => {
                return { item: e.item, qt: Number(e.qt) }
            })

            let ret = await axios.post('/api/saveone', {
                obj:
                {
                    carrinho: cart, reserva: numDaReserva, nome, telefone
                },
                table: "reservas",
                login: login,
                update: false
            });

            await props.cart.forEach(e => {
                let retor = axios.post('/api/saveone', { obj: { ...e.item, quantidade: e.item.quantidade - parseInt(e.qt) }, table: "produtos", login: login, update: true });
            });

            if (ret.data.result) return numDaReserva;
            else return false;
        } catch (e) {
            return false;
        }
    }

    async function ReservarProdutos() {
        const { value: reserva } = await Swal.fire({
            title: 'Reservar itens do carrinho',
            html:
                '<hr/><input id="swal-input1" placeholder="Nome" class="swal2-input">' +
                '<input id="swal-input2" placeholder="Telefone" maxLength="15" class="swal2-input">' +
                `<p>Obs.:  Os itens desse carrinho serão removidos do estoque até que seja efetuada a venda ou cancelada a reserva.</p>`
            ,
            focusConfirm: false,
            confirmButtonText: "Reservar",
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            preConfirm: () => {
                var Nome = document.getElementById("swal-input1").value;
                var Telefone = document.getElementById("swal-input2").value;

                if (Nome && Telefone) {
                    let numreserva = getRandomInt(0, 5000);

                    return saveReserv(numreserva, Nome, Telefone);

                }
                else return false;
            }
        })

        if (reserva) {
            Swal.fire("Reserva Nº " + reserva);
            Limpar();
        }

    }


    function MsgFinalizado() {
        const Toast = Swal.mixin({
            toast: false,
            position: 'center',
            showConfirmButton: false,
            timer: 1700,
            timerProgressBar: true,
            didOpen: (toast) => {
                /* toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer) */
            }
        })
        Toast.fire({
            icon: 'success',
            title: 'Venda efetuada!'
        })
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
                        <input value={valorPago.debito} maxLength={10} type="text" onChange={(e) => CalculaValorPago(e.target.value, "debito")} className={"form-control form-control-sm " + (formaPagamento.debito ? "border-primary shadow-sm" : "disabled")} />
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
                        <input maxLength={10} value={valorPago.credito} type="text" onChange={(e) => CalculaValorPago(e.target.value, "credito")} className={"form-control form-control-sm " + (formaPagamento.credito ? "border-primary shadow-sm" : "disabled")} />
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
                        <input maxLength={10} value={valorPago.dinheiro} onChange={(e) => CalculaValorPago(e.target.value, "dinheiro")} id="vlrpago" className={"form-control form-control-sm " + (formaPagamento.dinheiro ? "border-primary shadow-sm" : "disabled")} />
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
                        <input maxLength={10} value={valorPago.boleto} type="text" onChange={(e) => CalculaValorPago(e.target.value, "boleto")} className={"form-control form-control-sm " + (formaPagamento.boleto ? "border-primary shadow-sm" : "disabled")} />
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
                        <input maxLength={10} value={valorPago.pix} type="text" onChange={(e) => CalculaValorPago(e.target.value, "pix")} className={"form-control form-control-sm " + (formaPagamento.pix ? "border-primary shadow-sm" : "disabled")} />
                    </div>
                </div>
                <label>Voucher</label>
                <div className="row">
                    <div className="col-md-12">
                        <input type="text" value={VoucherUpper} onChange={(e) => setVoucherUpper(e.target.value.toUpperCase())} onBlur={(e) => checkVoucher(e.target.value)} maxLength={11} className={"form-control  form-control-sm " + (Voucher ? "text-success border-success shadow-sm" : "")} />
                        <span className="text-danger pl-0 badge">{msgVoucher != "" ? msgVoucher : ""}</span>
                    </div>
                </div>
            </div>
        </div>
        <hr />

        <h6 className="text-center text-gray-900">Sub-total: {Real(totalCarrinho)} </h6>
        {desconto ? <>
            <h6 className="text-center"><span>Desconto: {Voucher.codigo}</span> <span className="text-success"> - {Real(desconto)}</span> </h6></> : ""}

        {troco > 0 ? <h5 className="text-center text-gray-900">Troco: {Real(troco)}</h5> : ""}
        <h4 className="text-center text-gray-900">Total: {Real(totalCarrinho - desconto)}</h4>
        <h4 className="text-center text-gray-900">Total Restante: {Real(total)}</h4>
        <hr />

        {props.cart.length > 0 ?
            <div className="d-flex justify-content-between">
                <a className="btn btn-danger btn-sm btn-icon-split">
                    <span className="icon text-white-50">
                        <i className="fas fa-ban"></i>
                    </span>
                    <span onClick={() => Limpar()} className="text">Cancelar</span>
                </a>
                <a onClick={() => ReservarProdutos()} className="btn btn-primary btn-sm btn-icon-split">
                    <span className="icon text-white-50">
                        <i className="fas fa-people-carry"></i>
                    </span>
                    <span className="text">Reservar</span>
                </a>
                <a onClick={() => Finalizar()} className={"btn btn-success btn-sm btn-icon-split " + (Number(total.toFixed(2)) == 0 ? "" : "disabled")}>
                    <span className="icon text-white-50">
                        <i className="fas fa-check"></i>
                    </span>
                    <span className="text">Finalizar</span>
                </a>

            </div> : ""}

    </>)
}