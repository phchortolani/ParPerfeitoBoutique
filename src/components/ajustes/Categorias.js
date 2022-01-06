import { useRef, useState } from "react";
import DefaultCard from "../cards/DefaultCard";
import AddCatg from "./Categorias/AddCatg";
import TableCatg from "./Categorias/TableCatg";
import axios from "axios";
import Loading from "../load/Loading";

export default function Categorias() {

    const [list, setList] = useState({ data: [] });
    const [produtos, setProdutos] = useState({ data: [] });
    const [firstRender, setFirstRender] = useState(true);
    const [loadingList, setLoadingList] = useState(false);
    const addRef = useRef(null);

    async function getProdutos() {
        var ret = await axios.post('/api/listTable', { table: "produtos" });
        if (ret.data.result) {
            setProdutos({ data: ret.data.result });
        }
    }

    function refreshQueryCateg(codCateg) {
        addRef.current?.QueryCateg(codCateg);
    }

    async function getList() {
        setLoadingList(true);
        setFirstRender(false);
        var ret = await axios.post('/api/listTable', { table: "categorias" });
        if (ret.data.result) {

            setList({ data: orderByCodigo(ret.data.result) });
        }
        getProdutos();
        setLoadingList(false);
    }

    function atualizalista(lista) {
        let listaordernada = orderByCodigo(lista);
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
    }
    return (
        <div className="row">
            <DefaultCard title="Adicionar categoria" class="col-md-3"  icoTitle="fas fa-plus">
                {loadingList ? <div className="text-center text-primary"><Loading size="2em" /></div> : <AddCatg ref={addRef} lista={list.data} produtos={produtos.data} getList={getList} sendToList={atualizalista} />}
            </DefaultCard>
            <DefaultCard title="Lista de categorias" class="col-md-9"  icoTitle="fas fa-tag">
                {loadingList ? <div className="text-center text-primary"><Loading size="2em" /></div> : <TableCatg list={list.data} refreshQueryCateg={refreshQueryCateg} produtos={produtos.data} />}
            </DefaultCard>
        </div>
    )
}