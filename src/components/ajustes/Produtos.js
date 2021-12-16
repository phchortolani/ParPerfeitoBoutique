import DefaultCard from "../cards/DefaultCard";
import AddProd from "./Produtos/AddProd";
import FilterProd from "./Produtos/FilterProd";
import TableProd from "./Produtos/TableProd";
import { useState } from "react";
import axios from "axios";
import Loading from "../load/Loading";

export default function Produtos() {

    const [list, setList] = useState({ data: [] });
    const [firstRender, setFirstRender] = useState(true);
    const [loadingList, setLoadingList] = useState(false);
    const [categorias, setCategorias] = useState({ data: [] });

    async function getCateg() {
        let ret = await axios.post('/api/listTable', { table: "categorias" });
        if (ret.data.result) {
            setCategorias({ data: ret.data.result });
        }
    }


    async function getList() {
        setLoadingList(true);
        setFirstRender(false);
        var ret = await axios.post('/api/listTable', { table: "produtos" });
        if (ret.data.result) {
            setList({ data: orderByCodigo(ret.data.result) });
        }

        setLoadingList(false);
    }

    function addTolist(obj) {
        let arraytemp = list.data;
        arraytemp.push(obj)
        let listaordernada = orderByCodigo(arraytemp);
        setList({ data: listaordernada });
    }

    function removeFromList(cod) {
        let arraytemp = list.data;
        arraytemp.splice(arraytemp.findIndex((e) => e.codigo == cod), 1);
        let listaordernada = orderByCodigo(arraytemp);
        setList({ data: listaordernada });
    }

    function orderByCodigo(items) {
        return items.sort(function (a, b) {
            if (a.codigo > b.codigo) return 1;
            if (a.codigo < b.codigo) return -1;
            return 0;
        });
    }

    if (firstRender) {
        getList();
        getCateg();
    }
    return (
        <div className="row">
            <DefaultCard title="Adicionar produto" class="col-md-3">
                {loadingList ? <div className="text-center text-primary"><Loading size="2em" /></div> : <AddProd sentTolist={addTolist} categorias={categorias.data} />}
            </DefaultCard>
            <DefaultCard title="Lista de produtos" class="col-md-9">
                {loadingList ? <div className="text-center text-primary"><Loading size="2em" /></div> : <FilterProd categorias={categorias.data} />}
                <hr />
                {loadingList ? <div className="text-center text-primary"><Loading size="2em" /></div> : <TableProd categorias={categorias} removeFromList={removeFromList} list={list.data} />}
            </DefaultCard>
        </div>)
}