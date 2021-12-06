import { useState } from "react";
import DefaultCard from "../cards/DefaultCard";
import AddCatg from "./Categorias/AddCatg";
import TableCatg from "./Categorias/TableCatg";
import axios from "axios";

export default function Categorias() {

    const [list, setList] = useState({ data: [] });
    const [firstRender, setFirstRender] = useState(true);

    async function getList() {
        setFirstRender(false);
        var ret = await axios.post('/api/listTable', { table: "categorias" });
        if (ret.data.result) {

            setList({ data: orderByCodigo(ret.data.result)});
        }
    }

    function atualizalista(lista) {
        let listaordernada = orderByCodigo(lista);
        setList({ data: listaordernada });
    }

    function orderByCodigo(items) {
        return items.sort(function (a, b) {
            if (a.codigo > b.codigo) return 1;
            if (a.codigo < b.codigo) return -1;
            // a must be equal to b
            return 0;
        });
    }
    if (firstRender) getList();
    return (
        <div className="row">
            <DefaultCard title="Adicionar categoria" class="col-md-3">
                <AddCatg lista={list.data} sendToList={atualizalista} />
            </DefaultCard>
            <DefaultCard title="Lista de categorias" class="col-md-9">
                <TableCatg list={list.data} />
            </DefaultCard>
        </div>
    )
}