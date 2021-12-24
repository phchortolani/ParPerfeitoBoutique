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

    function addRemoveCart(cod, addToCart) {
        if (addToCart) {
            var prod = produtos.data.find((e => e.codigo == cod));
            if (prod) {
                let temp = cart.data;
                temp.push(prod);
                setCart({ data: temp });
            }
        } else {
            let temp = cart.data;
            temp.splice(temp.findIndex((e) => e.codigo == cod), 1);
            setCart({ data: temp });
        }
    }

    if (firstRender) getList();

    return (

        <div className="row">
            <div className="col-md-8">
                <DefaultCard title="Selecionados" cardBodyClass="p-0" icoTitle="fas fa-box-open">
                    <TableSelecionados RemoveItem={addRemoveCart} cart={cart.data} />
                </DefaultCard>
            </div>
            <div className="col-md-4">
                <DefaultCard title="Produtos" icoTitle="fas fa-shopping-cart" cardBodyClass="p-2">
                    {LoadingList ? <div className="text-center text-primary"><Loading size="2em" /></div> : <AddProdutos AddItem={addRemoveCart} produtos={produtos.data} />}
                </DefaultCard>
                <DefaultCard title="Pagamento" icoTitle="fas fa-cash-register" cardBodyClass="p-2">
                    <Pagamento />
                </DefaultCard>
            </div>
        </div>
    )
}