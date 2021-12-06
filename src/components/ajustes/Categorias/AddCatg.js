import axios from "axios";
import { AuthContext } from "../../../../context/Auth2Context";
import { useState, useContext } from "react";
let lista = [];

let defaultCateg = {
    codigo: 1,
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

    lista = props.lista;

    if (lista.lenght > 0) defaultCateg.codigo = lista[lista.lenght].codigo;

    async function InsertCateg() {

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
                for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
                    if (!searchCategoria(i)?.codigo) {
                        defaultCateg.codigo = i;
                        break;
                    }
                }
                setCategoria({ ...defaultCateg });
                props.sendToList(lista);
            }
            else {
                setValidateErros("Ocorreu um erro ao salvar.")
            }

        } else {
            setValidateErros("Preencha todos os campos obrigatórios.")
        }


    }
    async function RemoveCateg(codCateg) {
        var ret = await axios.post('/api/deleteone', { table: "categorias", where: { codigo: codCateg } });
        if (ret) {
            let categIndex = searchCategoria(codCateg, true);
            lista.splice(categIndex, 1);
            setCategoria(defaultCateg);
            setshowRemove(false);
            props.sendToList(lista);
        } else {
            console.log(ret);
        }

    }
    async function QueryCateg(codCateg) {
        if (codCateg == 0) return setCategoria(defaultCateg);
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
                defaultCateg.codigo++;
                setCategoria({ ...defaultCateg });
            }
            else {
                setValidateErros("Ocorreu um erro ao salvar.")
            }

        } else {
            setValidateErros("Preencha todos os campos obrigatórios.")
        }



    }

    return (
        <div>
            <label htmlFor="codigo">Código</label>
            <input type="number" onBlur={(e) => QueryCateg(e.target.value)}
                value={categoria.codigo} id="codigo"
                onChange={(e) => { setCategoria({ ...categoria, codigo: e.target.value }) }}
                className={"form-control form-control-sm  mb-3 " + (validatelist.includes(("codigo")) ? "border-danger" : "")} />

            <label htmlFor="desc">Descrição</label>
            <input type="text" id="desc"
                onChange={(e) => { setCategoria({ ...categoria, descricao: e.target.value }) }}
                value={categoria?.descricao} className={"form-control form-control-sm  mb-3 " + (validatelist.includes(("descricao")) ? "border-danger" : "")} />

            <label htmlFor="valor">Valor padrão</label>
            <input type="text" value={categoria?.valorPadrao} id="valor"
                onChange={(e) => { setCategoria({ ...categoria, valorPadrao: e.target.value }) }} className={"form-control form-control-sm  mb-3 " + (validatelist.includes(("valorPadrao")) ? "border-danger" : "")} />
            <hr />
            <div className="d-flex justify-content-between">
                {showRemove ? <a onClick={() => RemoveCateg()} className="btn btn-danger btn-sm btn-icon-split">
                    <span className="icon text-white-50">
                        <i className="fas fa-trash-alt"></i>
                    </span>
                    <span className="text">Remover</span>
                </a> : ""}
                <a onClick={() => showRemove ? AlterCateg() : InsertCateg()} className="btn btn-primary btn-sm btn-icon-split">
                    <span className="icon text-white-50">
                        <i className="fas fa-save"></i>
                    </span>
                    <span className="text">{showRemove ? "Alterar" : "Adicionar"}</span>
                </a>
            </div>
            {validatelist.length > 0 ? <p className="text-danger badge d-flex pt-2 pb-2">{validateerros}</p> : ""}
        </div>
    )
}