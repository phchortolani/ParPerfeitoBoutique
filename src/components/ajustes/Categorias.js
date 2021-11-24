import DefaultCard from "../cards/DefaultCard";
import AddCatg from "./Categorias/AddCatg";
import TableCatg from "./Categorias/TableCatg";

export default function Categorias() {

    return (<div>
        <DefaultCard title="Categorias">
            <div className="row">
                <div className="col-md-3 border p-3">
                    <AddCatg />
                </div>
                <div className="col-md-9 p-0 p-md-0 pl-md-2 pt-2">
                    <TableCatg />
                </div>
            </div>
        </DefaultCard>
    </div>
    )
}