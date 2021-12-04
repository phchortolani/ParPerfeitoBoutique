import { useState } from "react";
import DefaultCard from "../cards/DefaultCard";
import AddCatg from "./Categorias/AddCatg";
import TableCatg from "./Categorias/TableCatg";

export default function Categorias() {

    const [list, setList] = useState({ data: [] });

    function atualizalista(lista) {
        setList({ data: lista });
    }
    return (
        <div className="row">
            <DefaultCard title="Adicionar categoria" class="col-md-3">
                <AddCatg sendToList={atualizalista} />
            </DefaultCard>
            <DefaultCard title="Lista de categorias" class="col-md-9">
                <TableCatg list={list.data} />
            </DefaultCard>
        </div>
    )
}