import DefaultCard from "../cards/DefaultCard";
import AddProd from "./Produtos/AddProd";
import FilterProd from "./Produtos/FilterProd";
import TableProd from "./Produtos/TableProd";
import { useRef, useState, useContext } from "react";
import axios from "axios";
import Loading from "../load/Loading";
import Cupons from "./Produtos/Cupons";

let totalList = [];

export default function Produtos(props) {

    const [list, setList] = useState({ data: [] });
    const [firstRender, setFirstRender] = useState(true);
    const [loadingList, setLoadingList] = useState(false);
    const [categorias, setCategorias] = useState({ data: [] });

    const addProdRef = useRef(null);

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
            totalList = orderByCodigo(ret.data.result);
        }

        setLoadingList(false);
    }

    function addTolist(obj, update = false) {
        if (update) removeFromList(obj.codigo);
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

    function editProd(produto) {
        addProdRef.current?.editProd(produto);
    }

    function orderByCodigo(items) {
        return items.sort(function (a, b) {
            if (a.codigo > b.codigo) return 1;
            if (a.codigo < b.codigo) return -1;
            return 0;
        });
    }

    async function SearchFilters(filters) {
        let tempList = totalList;

        if (filters.codCategoria > 0) {
            tempList = tempList.filter((e) => e.codCategoria == filters.codCategoria);
        }
        if (filters.criterio > 0) {

            if (filters.criterio == 1) {
                tempList = tempList.filter((e) => e.quantidade > filters.qt);
            }
            if (filters.criterio == 2) {
                tempList = tempList.filter((e) => e.quantidade == filters.qt);
            }
            if (filters.criterio == 3) {
                tempList = tempList.filter((e) => e.quantidade < filters.qt);
            }
        }

        if (filters.termo != "") {

            if (Number(filters.termo) > 0) {
                tempList = tempList.filter((e) => e.codigo == Number(filters.termo));
            } else {
                tempList = tempList.filter((e) => e.descricao.toUpperCase().includes(filters.termo.toUpperCase()));
            }

        }
        setList({ data: tempList });
    }

    if (firstRender) {
        getList();
        getCateg();
    }

    return (
        <div className="row">
            {props.Permissao == "administrador" ? <DefaultCard title="Adicionar produto" class="col-md-3" cardBodyClass="OverFlowYMax150 p-2">
                {loadingList ? <div className="text-center text-primary"><Loading size="2em" /></div> : <AddProd ref={addProdRef} sentTolist={addTolist} getList={getList} categorias={categorias.data} />}
            </DefaultCard> : ""}

            <DefaultCard title="Lista de produtos" class="col-md" cardBodyClass="OverFlowYMax150">
                <div className="row">
                    <div className="col-md-12">
                        {loadingList ? <div className="text-center text-primary"><Loading size="2em" /></div> : <FilterProd SearchFilters={SearchFilters} categorias={categorias.data} />}
                    </div>
                    <div className="col">
                        <hr></hr>
                        {props.Permissao == "administrador" ? <Cupons categorias={categorias.data} /> : ""}
                    </div>
                </div>
                <hr />
                {loadingList ? <div className="text-center text-primary"><Loading size="2em" /></div> : <TableProd Permissao={props.Permissao} categorias={categorias} editProd={editProd} removeFromList={removeFromList} list={list.data} />}
            </DefaultCard>
        </div>)
}