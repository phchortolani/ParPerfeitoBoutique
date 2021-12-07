import axios from "axios";
import { AuthContext } from "../../../../context/Auth2Context";
import { useState, useContext } from "react";
import Loading from "../../load/Loading";
let lista = [];

let defaultCateg = {
    codigo: 0,
    descricao: "",
    valorPadrao: "",
    quantidade: 0
}
export default function AddCatg(props) {

    const [categoria, setCategoria] = useState(defaultCateg);
    const [showRemove, setshowRemove] = useState(false);
    const [validatelist, setValidatelist] = useState([]);
    const [validateerros, setValidateErros] = useState('');
    const { login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [loadingRemove, setLoadingRemove] = useState(false);

    lista = props.lista;

    if (lista.length > 0 && defaultCateg.codigo == 0) {
        SelectNextCod();
        setCategoria(defaultCateg);
    }

    async function InsertCateg() {
        setLoading(true);
        let erroslist = [];
        for (var prop in categoria) {

            if (prop != "quantidade") {
                if (categoria[prop] == "") {
                    erroslist.push(prop);
                }
            }
        }
        setValidatelist(erroslist);

        if (erroslist.length == 0) {
            var ret = await axios.post('/api/saveone', { obj: categoria, table: "categorias", login: login });
            if (ret) {
                lista.push(categoria);
                SelectNextCod();
                setCategoria({ ...defaultCateg });
                props.sendToList(lista);
            }
            else {
                setValidateErros("Ocorreu um erro ao salvar.")
            }

        } else {
            setValidateErros("Preencha todos os campos obrigatórios.")
        }

        setLoading(false);
    }
    async function RemoveCateg() {
        setLoadingRemove(true);
        var ret = await axios.post('/api/deleteone', { table: "categorias", where: { codigo: categoria.codigo } });
        if (ret) {
            let categIndex = searchCategoria(categoria.codigo, true);
            lista.splice(categIndex, 1);
            SelectNextCod();
            setCategoria(defaultCateg);
            setshowRemove(false);
            props.sendToList(lista);
        } else {
            console.log(ret);
        }
        setLoadingRemove(false);
    }

    function SelectNextCod() {
        for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
            if (!searchCategoria(i)?.codigo) {
                defaultCateg.codigo = i;
                break;
            }
        }
    }
    async function QueryCateg(codCateg) {
        if (codCateg == 0) return setCategoria({ ...defaultCateg, codigo: 1 });
        let categ = searchCategoria(codCateg);
        if (categ) setCategoria(categ);
        else setCategoria({ ...defaultCateg, codigo: parseInt(codCateg) });
        setshowRemove(categ != undefined ? true : false);
    }
    function searchCategoria(codigo, index) {
        if (index) return lista.findIndex((e) => e.codigo == codigo);
        return lista.find((e) => e.codigo == codigo);
    }

    async function AlterCateg() {
        setLoading(true);
        let erroslist = [];
        for (var prop in categoria) {

            if (prop != "quantidade" && prop != "dataModificacao" && prop != "alteradoPor") {
                if (categoria[prop] == "") {
                    erroslist.push(prop);
                }
            }
        }
        setValidatelist(erroslist);

        if (erroslist.length == 0) {
            var ret = await axios.post('/api/saveone', { obj: categoria, table: "categorias", login: login, update: true });
            if (ret) {
                let categIndex = searchCategoria(categoria.codigo, true);
                lista.splice(categIndex, 1);
                lista.push(categoria);
                props.sendToList(lista);
                SelectNextCod();
                setCategoria({ ...defaultCateg });
            }
            else setValidateErros("Ocorreu um erro ao salvar.");
        } else setValidateErros("Preencha todos os campos obrigatórios.");
        setLoading(false);
    }

    return (
        <div>
            <label htmlFor="codigo">Código</label>
            <input type="number" onBlur={(e) => QueryCateg(e.target.value)}
                value={categoria.codigo} id="codigo"
                onChange={(e) => { setCategoria({ ...categoria, codigo: e.target.value }) }}
                className={"form-control form-control-sm  mb-2 " + (validatelist.includes(("codigo")) ? "border-danger" : "")} />

            <label htmlFor="desc">Descrição</label>
            <input type="text" id="desc"
                onChange={(e) => { setCategoria({ ...categoria, descricao: e.target.value }) }}
                value={categoria?.descricao} className={"form-control form-control-sm  mb-2 " + (validatelist.includes(("descricao")) ? "border-danger" : "")} />

            <label htmlFor="valor">Valor padrão</label>
            <input type="text" value={categoria?.valorPadrao} id="valor"
                onChange={(e) => { setCategoria({ ...categoria, valorPadrao: e.target.value }) }} className={"form-control form-control-sm  mb-2 " + (validatelist.includes(("valorPadrao")) ? "border-danger" : "")} />
            <hr />
            <div className="d-flex justify-content-between">
                {showRemove ? <a onClick={() => RemoveCateg()} className={"btn btn-danger btn-sm btn-icon-split " + (loadingRemove || loading ? "disabled" : "")}>
                    <span className="icon text-white-50">
                        {loadingRemove ? <Loading /> : <i className="fas fa-trash-alt"></i>}
                    </span>
                    <span className="text">{loadingRemove ? "Removendo" : "Remover"}</span>
                </a> : ""}
                <a onClick={() => showRemove ? AlterCateg() : InsertCateg()} className={"btn btn-primary btn-sm btn-icon-split " + (loading || loadingRemove ? "disabled" : "")}>
                    <span className="icon text-white-50">
                        {loading ? <Loading /> : <i className="fas fa-save"></i>}
                    </span>
                    <span className="text">{showRemove ? (loading ? "Alterando" : "Alterar") : (loading ? "Adicionando" : "Adicionar")}</span>
                </a>
            </div>
            {validatelist.length > 0 ? <p className="text-danger badge d-flex pt-2 pb-2">{validateerros}</p> : ""}
        </div>
    )
}