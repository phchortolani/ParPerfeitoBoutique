import DefaultCard from "../cards/DefaultCard";
import AddProdutos from "./Caixa/AddProdutos";
import Pagamento from "./Caixa/Pagamento";
import TableSelecionados from "./Caixa/TableSelecionados";

export default function Caixa() {
    return (<div className="row">
        <DefaultCard title="Produtos" icoTitle="fas fa-shopping-cart" class="col-12">
            <AddProdutos />
        </DefaultCard>
        <DefaultCard title="Selecionados" cardBodyClass="p-0" icoTitle="fas fa-box-open" class="col-md-8">
            <TableSelecionados />
        </DefaultCard>
        <DefaultCard title="Pagamento" icoTitle="fas fa-cash-register" class="col-md-4">
            <Pagamento />
        </DefaultCard>

    </div>)
}