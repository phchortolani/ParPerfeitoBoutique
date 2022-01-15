import axios from "axios";
import { AuthContext } from "../../../../context/Auth2Context";
import { useState, useContext, forwardRef, useImperativeHandle } from "react";
import Loading from "../../load/Loading";
let lista = [];

let defaultCateg = {
    codigo: 0,
    descricao: "",
    valorPadrao: 0
}

const AddCatg = (props, ref) => {

    const [categoria, setCategoria] = useState(defaultCateg);
    const [showRemove, setshowRemove] = useState(false);
    const [validatelist, setValidatelist] = useState([]);
    const [validateerros, setValidateErros] = useState('');
    const { login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [loadingRemove, setLoadingRemove] = useState(false);
    const [edit, setEdit] = useState(false);

    lista = props.lista;
    let produtos = props.produtos;

    if (lista.length > 0 && defaultCateg.codigo == 0) {
        SelectNextCod();
        setCategoria(defaultCateg);
    }

    useImperativeHandle(ref, () => {
        return {
            QueryCateg
        }
    })


    async function InsertCateg() {
        setLoading(true);
        let erroslist = [];
        for (var prop in categoria) {
            if (categoria[prop] == "") {
                erroslist.push(prop);
            }
        }
        setValidatelist(erroslist);

        if (erroslist.length == 0) {
            let tempObj = { ...categoria, valorPadrao: formataDecimal(categoria.valorPadrao) }
            var ret = await axios.post('/api/saveone', { obj: tempObj, table: "categorias", login: login });
            if (ret) {
                lista.push(categoria);
                SelectNextCod();
                setCategoria({ ...defaultCateg });
                props.getList();
            }
            else setValidateErros("Ocorreu um erro ao salvar.")

        } else setValidateErros("Preencha todos os campos obrigatórios.")

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
        } else console.log(ret);

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
        if (codCateg <= 0) {
            SelectNextCod();
            setCategoria(defaultCateg);
            return QueryCateg(defaultCateg.codigo)
        }
        let categ = searchCategoria(codCateg);

        if (categ) {
            setEdit(true);
            let valor = String(categ.valorPadrao).includes(".") ? categ.valorPadrao : categ.valorPadrao.toFixed(2);
            setCategoria({ ...categ, valorPadrao: formatReal(valor.toString().replace(".", "")) });
        }
        else setCategoria({ ...defaultCateg, codigo: parseInt(codCateg) });

        let prod = produtos.find((e) => e.codCategoria == codCateg);

        setshowRemove(categ != undefined && !prod ? true : false);
    }

    function searchCategoria(codigo, index) {
        if (index) return lista.findIndex((e) => e.codigo == codigo);
        return lista.find((e) => e.codigo == codigo);
    }

    async function AlterCateg() {
        setLoading(true);
        let erroslist = [];
        for (var prop in categoria) {
            if (prop != "dataModificacao" && prop != "alteradoPor") {
                if (categoria[prop] == "") {
                    erroslist.push(prop);
                }
            }
        }
        setValidatelist(erroslist);

        if (erroslist.length == 0) {
            var ret = await axios.post('/api/saveone', { obj: { ...categoria, valorPadrao: formataDecimal(categoria.valorPadrao) }, table: "categorias", login: login, update: true });
            if (ret) {
                await props.getList();
                SelectNextCod();
                setshowRemove(false);
                setCategoria({ ...defaultCateg });
            }
            else setValidateErros("Ocorreu um erro ao salvar.");
        } else {
            setValidateErros("Preencha todos os campos obrigatórios.");
            console.log(erroslist);
        }
        setLoading(false);
    }

    function AlterarInputValor(value) {
        let semcaracteres = Number(value.replace(/[\D]+/g, ''));
        setCategoria({ ...categoria, valorPadrao: formatReal(semcaracteres) })
    }

    function formatReal(int) {
        var tmp = int + '';
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if (tmp.length > 6)
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        return tmp;
    }
    function formataDecimal(valorStg) {
        let valorpuro = valorStg.toString().replace(".", '');
        valorpuro = valorpuro.replace(",", ".");
        return parseFloat(valorpuro);
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
            {/*  <input type="number" value={categoria?.valorPadrao == 0 ? "" : categoria?.valorPadrao} id="valor"
                onChange={(e) => { setCategoria({ ...categoria, valorPadrao: e.target.value }) }} className={"form-control form-control-sm  mb-2 " + (validatelist.includes(("valorPadrao")) ? "border-danger" : "")} placeholder="R$" />
            */}
            <input value={categoria?.valorPadrao == 0 ? "" : categoria?.valorPadrao} onChange={(e) => AlterarInputValor(e.target.value)} maxLength={10} type="text" id="valorPadrao" className={"form-control form-control-sm  mb-2 " + (validatelist.includes(("valorPadrao")) ? "border-danger" : "")} placeholder="R$" />
            <hr />
            <div className="d-flex justify-content-between">
                {showRemove ? <a onClick={() => RemoveCateg()} className={"btn btn-danger btn-sm btn-icon-split " + (loadingRemove || loading ? "disabled" : "")}>
                    <span className="icon text-white-50">
                        {loadingRemove ? <Loading /> : <i className="fas fa-trash-alt"></i>}
                    </span>
                    <span className="text">{loadingRemove ? "Removendo" : "Remover"}</span>
                </a> : ""}

                <a onClick={() => edit ? AlterCateg() : InsertCateg()} className={"btn btn-primary btn-sm btn-icon-split " + (loading || loadingRemove ? "disabled" : "")}>
                    <span className="icon text-white-50">
                        {loading ? <Loading /> : <i className="fas fa-save"></i>}
                    </span>
                    <span className="text">{showRemove ? (loading ? "Alterando" : "Alterar") : (loading ? "Adicionando" : searchCategoria(categoria.codigo) ? "Alterar" : "Adicionar")}</span>
                </a>
            </div>
            {validatelist.length > 0 ? <p className="text-danger badge d-flex pt-2 pb-2">{validateerros}</p> : ""}
        </div>
    )
}

export default forwardRef(AddCatg);