import axios from "axios";
import { useState } from "react"

export default function AlterPassword(props) {
    const [MostrarSenha, setMostrarSenha] = useState(false);
    const [newpass, setNewPass] = useState("");

    async function AlterPassHandler() {
        const username = props.token?.username;
        var ret = await axios.post("/api/alterPassword", { username, newpass });

        if (ret.data) {
            let result = ret.data.result;
            Swal.fire(result ? "Tudo certo!" : "Atenção!", ret.data.msg, result ? 'success' : 'error');
            if(result){
                props.CloseModalRedef();
            }
        } else {
            Swal.fire("Atenção!", 'Ocorreu um erro ao tentar redefinir a senha, tente novamente, se a situação persistir, entre em contato com o adm. do sistema.', 'error');
        }
    }

    return (
        <div>
            <h6>Para iniciar a utilização do sistema, insira sua nova senha abaixo:</h6>
            <hr />
            <label className=""><b className="text-primary">Nova senha</b></label>
            <div className="d-flex">
                <input maxLength="64" value={newpass} onChange={(e) => setNewPass(e.target.value)} type={(MostrarSenha ? "text" : "password")} className="form-input form-control form-control-sm border-primary" />
                <i title="Mostrar senha" onClick={() => setMostrarSenha(!MostrarSenha)} className={"fas fa-eye mx-3 align-items-baseline btn btn-sm " + (MostrarSenha ? "text-primary border-bottom-primary" : " border")}></i>
            </div>
            {newpass.length < 8 ? <div className="small mt-2 text-danger">A senha deve ter no minimo 8 caracteres.</div> : ""}

            <hr />
            <div>
                <button onClick={() => AlterPassHandler()} type="button" className={"btn btn-sm btn-primary " + (newpass.length >= 8 ? "" : "disabled")}>Redefinir</button>

            </div>
        </div>
    )
}