import DefaultCard from "../cards/DefaultCard";
import AddCatg from "./Categorias/AddCatg";
import TableCatg from "./Categorias/TableCatg";

export default function Categorias() {
    return (
        <div className="row">
            <DefaultCard title="Adicionar categoria" class="col-md-3">
                <AddCatg />
            </DefaultCard>
            <DefaultCard title="Lista de categorias" class="col-md-9">
                <TableCatg />
            </DefaultCard>
        </div>
    )
}