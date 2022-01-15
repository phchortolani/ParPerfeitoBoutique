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

    async function getList() {
        setLoadingList(true);
        setFirstRender(false);
        var ret = await axios.post('/api/listTable', { table: "produtos" });
        if (ret.data.result) {
            setProdutos({ data: ret.data.result });
        }
        setLoadingList(false);
    }

    function EditQt(item, qt) {
        if (qt <= 0) qt = 1;
        if (qt > item.quantidade) qt = item.quantidade;
        let temp = cart.data;
        let index = cart.data.findIndex((e) => e.item.codigo == item.codigo);
        if (index != null || index != undefined) {
            temp[index] = { item: item, qt: qt };
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
                    if (quant > prod.quantidade) quant = prod.quantidade;
                    temp[index] = { item: itemexistente.item, qt: quant };
                } else temp.push({ item: prod, qt: quant });
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
                    {cart.data.length > 0 ? <TableSelecionados RemoveItem={addRemoveCart} cart={cart.data} EditQt={EditQt} /> : <p className="text-center text-uppercase text-monospace">Aguardando produtos</p>}
                </DefaultCard>
            </div>
            <div className="col-md-4">
                <DefaultCard title="Produtos" icoTitle="fas fa-shopping-cart" cardBodyClass="p-2">
                    {LoadingList ? <div className="text-center text-primary"><Loading size="2em" /></div> : <AddProdutos AddItem={addRemoveCart} produtos={produtos.data} />}
                </DefaultCard>
                {cart.data.length > 0 ? <DefaultCard title="Pagamento" icoTitle="fas fa-cash-register" cardBodyClass="p-2">
                    <Pagamento clearCart={clearCart} cart={cart.data} />
                </DefaultCard> : ""}

            </div>
        </div>
    )
}