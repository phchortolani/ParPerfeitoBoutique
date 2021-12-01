import DefaultCard from "../cards/DefaultCard";
import AddUsu from "./Usuarios/AddUsu";
import TableUsu from "./Usuarios/TableUsu";
import axios from "axios";
import { useState } from "react";

export default function Usuarios() {

    const [List, setList] = useState();
    const [firstRender, setFirstRender] = useState(true);

    async function getList() {
        if (firstRender) {
            setFirstRender(false);
            var ret = await axios.post('/api/listTable', { table: "usuarios" });
            if (ret.data.result) {
                setList(ret.data.result);
            }
        }
    }
    getList();


    function addlist(user) {
        let tempList = List;
        tempList.push(user);
        setList(tempList);
    }

    const table = () => {
        console.log("renderizou");
        return <TableUsu list={List} />;
    }
    
    return (
        
        <div className="row">
            <DefaultCard title="Cadastro de usuário" class="col-md-4">
                <AddUsu addIntoList={addlist} />
            </DefaultCard>
            <DefaultCard title="Lista de usuários" class="col-md-8">
                {table()}
            </DefaultCard>
        </div>

    )
}
