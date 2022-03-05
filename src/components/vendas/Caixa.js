import DefaultCard from "../cards/DefaultCard";
import AddProdutos from "./Caixa/AddProdutos";
import Pagamento from "./Caixa/Pagamento";
import TableSelecionados from "./Caixa/TableSelecionados";
import axios from "axios";
import { useState } from "react";
import Loading from "../load/Loading";

export default function Caixa() {
    const [produtos, setProdutos] = useState({ data: [] });
    const [firstRender, setFirstRender] = useState(true);
    const [LoadingList, setLoadingList] = useState(false);
    const [cart, setCart] = useState({ data: [] });
    const [cuponsIndividuais, setCuponsIndividuais] = useState({ data: [] });

    async function getList() {
        setLoadingList(true);
        setFirstRender(false);
        var ret = await axios.post('/api/listTable', { table: "produtos" });
        var retVouchers = await axios.post('/api/listTable', { table: "vouchers" });
        if (ret.data.result) {
            setProdutos({ data: ret.data.result });
        }
        if (retVouchers.data.result) setCuponsIndividuais({ data: retVouchers.data.result })
        setLoadingList(false);
    }
    let msgVoucherindividual = "";

    function EditQt(item, qt) {
        if (qt <= 0) qt = 1;
        if (qt > item.quantidade) qt = parseInt(item.quantidade);
        let temp = cart.data;
        let index = cart.data.findIndex((e) => e.item.codigo == item.codigo);
        if (index != null || index != undefined) {
            temp[index] = { item: item, qt: qt };
            setCart({ data: temp });
        }
    }

    function EditVoucher(value, codproduto) {
        let temp = cart.data;
        let index = cart.data.findIndex((e) => e.item.codigo == codproduto);
        if (index != null || index != undefined) {
            temp[index] = { ...temp[index], voucher: { ...temp[index].voucher, codigo: value } };
            setCart({ data: temp });
        }

    }
    function TestVoucher(value, produto, DescontoJaAplicado) {
        let temp = cart.data;
        let index = temp.findIndex((e) => e.item.codigo == produto.codigo);


        if (index != null || index != undefined) {

            let cupom = cuponsIndividuais.data.find((e) => e.codigo.toUpperCase() == value && e.individual);

            if (cupom) {
                if (!DescontoJaAplicado) {

                    let periodoinicial = new Date(cupom.periodoini.split("T")[0]);
                    let periodofinal = new Date(cupom.periodofim.split("T")[0]);
                    let dataatual = new Date(new Date().toISOString().split("T")[0]);

                    if (periodoinicial <= dataatual && periodofinal >= dataatual) {
                        let desconto = 0;
                        if (cupom.tipoPorcentagem) {
                            if (cupom.minimoCompra > temp[index].item.valor) {
                                Swal.fire('Atenção!'
                                    , `O valor de compra mínimo do cupom ${cupom.codigo} é de ${cupom.minimoCompra.toLocaleString('pt-BR', { style: 'currency', currency: "BRL" })}.`, 'warning');
                            } else {
                                desconto = (cupom.valorDesconto * (temp[index].item.valor / 100));
                            }

                        }
                        else {

                            if (cupom.minimoCompra > temp[index].item.valor) {
                                Swal.fire('Atenção!'
                                    , `O valor de compra mínimo do cupom ${cupom.codigo} é de ${cupom.minimoCompra.toLocaleString('pt-BR', { style: 'currency', currency: "BRL" })}.`, 'warning');
                            } else if (temp[index].item.valor >= cupom.valorDesconto) {
                                desconto = cupom.valorDesconto;
                            } else Swal.fire('Atenção!'
                                , `O valor individual deste produto é inferior ao desconto de ${cupom.valorDesconto.toLocaleString('pt-BR', { style: 'currency', currency: "BRL" })} do cupom ${cupom.codigo}.`, 'warning');

                        }
                        temp[index] = { ...temp[index], voucher: cupom, VoucherDescontado: desconto, item: { ...temp[index].item, valor: temp[index].item.valor - desconto } };
                    } else {
                        Swal.fire('Atenção!'
                            , `Este cupom está fora do período de utilização!`, 'warning')
                    }
                }
            }
            else {
                let desconto = temp[index].VoucherDescontado ? temp[index].VoucherDescontado : 0;
                temp[index] = { ...temp[index], voucher: null, VoucherDescontado: 0, item: { ...temp[index].item, valor: temp[index].item.valor + desconto } };
            }

            setCart({ data: temp });
        }
    }

    function clearCart() {
        setCart({ data: [] });
    }
    function addRemoveCart(cod, addToCart) {
        if (addToCart) {
            var prod = produtos.data.find((e => e.codigo == cod));
            if (prod) {
                let temp = cart.data;
                let quant = 1;
                const itemexistente = cart.data.find(e => e.item.codigo == cod);
                if (itemexistente) {
                    let index = cart.data.findIndex(e => e.item.codigo == cod);
                    quant += Number(itemexistente.qt);
                    if (quant > prod.quantidade) quant = parseInt(prod.quantidade);
                    temp[index] = { item: itemexistente.item, qt: quant };

                } else {
                    if (parseInt(prod.quantidade) > 0) temp.push({ item: prod, qt: quant });
                    else return Swal.fire(
                        'Atenção!',
                        `O produto ${prod.codigo} - ${prod.descricao} está em falta, reponha o estoque!`,
                        'warning'
                    );
                }

                setCart({ data: temp });
            }
        } else {
            let temp = cart.data;
            temp.splice(temp.findIndex((e) => e.item.codigo == cod), 1);
            setCart({ data: temp });
        }
    }

    if (firstRender) getList();


    return (

        <div className="row">
            <div className="col-md-8">
                <DefaultCard title="Selecionados" cardBodyClass="p-0" icoTitle="fas fa-box-open">
                    {cart.data.length > 0 ? <TableSelecionados TestVoucher={TestVoucher} RemoveItem={addRemoveCart} cart={cart.data} EditVoucher={EditVoucher} EditQt={EditQt} /> : <p className="text-center text-uppercase text-monospace">Aguardando produtos</p>}
                </DefaultCard>
            </div>
            <div className="col-md-4">
                <DefaultCard title="Produtos" icoTitle="fas fa-shopping-cart" cardBodyClass="p-2">
                    {LoadingList ? <div className="text-center text-primary"><Loading size="2em" /></div> : <AddProdutos AddItem={addRemoveCart} produtos={produtos.data} />}
                </DefaultCard>
                {cart.data.length > 0 ? <DefaultCard title="Pagamento" icoTitle="fas fa-cash-register" cardBodyClass="p-2">
                    <Pagamento clearCart={clearCart} GetList={getList} cart={cart.data} />
                </DefaultCard> : ""}

            </div>
        </div>
    )
}