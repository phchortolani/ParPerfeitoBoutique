import DefaultCard from "../cards/DefaultCard";
import AddProd from "./Produtos/AddProd";
import FilterProd from "./Produtos/FilterProd";
import TableProd from "./Produtos/TableProd";

export default function Produtos() {
    return (
        <div className="row">
            <DefaultCard title="Adicionar produto" class="col-md-3">
                <AddProd />
            </DefaultCard>
            <DefaultCard title="Lista de produtos" class="col-md-9">
                <FilterProd />
                <hr />
                <TableProd />
            </DefaultCard>
        </div>)
}