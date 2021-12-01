import DefaultCard from "../cards/DefaultCard";
import AddUsu from "./Usuarios/AddUsu";
import TableUsu from "./Usuarios/TableUsu";
import axios from "axios";
import { useState } from "react";

export default function Usuarios() {

    const [refresh, setRefresh] = useState(0);
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
        setRefresh(refresh + 1);
    }

    function removeFromList(username) {
        let arraytemp = List;
        const index = arraytemp.findIndex((e) => e.usuario == username);
        arraytemp.splice(index, 1);
        setList(arraytemp);
        setRefresh(refresh + 1);
    }

    return (

        <div className="row">
            <DefaultCard title="Cadastro de usuário" class="col-md-3" >
                <AddUsu addIntoList={addlist} />
            </DefaultCard>
            <DefaultCard title="Lista de usuários" class="col-md-9" cardBodyClass="ListasAjustes">
                <TableUsu removeFromList={removeFromList} refresh={refresh} list={List} />
            </DefaultCard>
        </div>

    )
}
