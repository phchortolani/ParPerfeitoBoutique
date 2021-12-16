import axios from 'axios';
import { useState, useContext } from 'react';
import { AuthContext } from "../../../../context/Auth2Context";

let defaultProd = {
    codigo: 0,
    descricao: "",
    valor: 0,
    quantidade: "",
    codCategoria: ""
}

export default function AddProd(props) {
    const [Produto, setProduto] = useState(defaultProd);
    const [validatelist, setValidatelist] = useState([{}]);
    const [validateerros, setValidateErros] = useState('');
    const { login } = useContext(AuthContext);

    function InputsIsValid() {
        let erroslist = [];
        for (var prop in Produto) {
            if (prop != "codigo") {
                if (Produto[prop] == "") {
                    erroslist.push(prop);
                }
            }
        }
        setValidatelist(erroslist);
        if (erroslist.length > 0) {
            setValidateErros("Preencha todos os campos obrigatórios.")
        } else SaveProd();
    }

    function searchCategoria(codigo, index) {
        if (index) return props.categorias.findIndex((e) => e.codigo == codigo);
        return props.categorias.find((e) => e.codigo == codigo);
    }

    function CategoriaOnChange(e) {
        let categ = searchCategoria(e.target.value);
        setProduto({ ...Produto, codCategoria: e.target.value, valor: categ.valorPadrao })
    }

    function RemoveCategFromCod(codProduto) {
        return parseInt(`${codProduto}`.split("").reverse().join("").substring(0, Produto.codCategoria.length).split("").reverse().join(""));
    }

    async function SaveProd() {
        let RetultimoProd = await axios.post('/api/getlast', { table: "produtos", where: { codCategoria: Number(Produto.codCategoria) } });
        if (RetultimoProd) {
            let ultimoCod = RetultimoProd.data?.result[0]?.codigo ?? 0;
            ultimoCod = RemoveCategFromCod(ultimoCod);

            let tempProduto = {
                ...Produto,
                codigo: parseInt(`${Produto.codCategoria}${(ultimoCod + 1)}`),
                codCategoria: parseInt(Produto.codCategoria),
                quantidade: parseInt(Produto.quantidade),
                valor: parseFloat(Produto.valor)
            };

            let ret = await axios.post('/api/saveone', { obj: tempProduto, table: "produtos", login: login });
            if (ret.data.result) {
                let cat = searchCategoria(tempProduto.codCategoria);
                let retUpdateCateg = await axios.post('/api/saveone', { obj: { ...cat, quantidade: cat.quantidade + tempProduto.quantidade }, table: "categorias", login: login, update: true });
                if (retUpdateCateg) {
                    setProduto(defaultProd);
                    props.sentTolist(tempProduto);
                }
                else setValidateErros("Ocorreu um erro ao salvar - Não foi possível atualizar categoria.")
            }
            else {
                setValidateErros("Ocorreu um erro ao salvar.")
            }
        } else {
            setValidateErros("Erro ao obter o ultimo codigo")
        }

    }

    return (<>
        <label htmlFor="desc">Descrição</label>
        <input value={Produto?.descricao} onChange={(e) => setProduto({ ...Produto, descricao: e.target.value })} type="text" id="desc" className={"form-control form-control-sm  mb-2 " + (validatelist.includes(("descricao")) ? "border-danger" : "")} />

        <label htmlFor="cate">Categoria</label>
        <select id="cate" value={Produto?.codCategoria} onChange={(e) => CategoriaOnChange(e)} className={"form-control form-control-sm  mb-2 " + (validatelist.includes(("codCategoria")) ? "border-danger" : "")} >
            <option value="">Selecione...</option>
            {props.categorias.length > 0 ? props.categorias.map((e, i) => {
                return <option key={i} value={e.codigo}>{e.descricao}</option>
            }) : ""}
        </select>

        <label htmlFor="valor">Valor</label>
        <input value={Produto?.valor == 0 ? "" : Produto?.valor} onChange={(e) => setProduto({ ...Produto, valor: e.target.value })} type="number" id="valor" className={"form-control form-control-sm  mb-2 " + (validatelist.includes(("valor")) ? "border-danger" : "")} placeholder="R$" />


        <label htmlFor="qt">Quantidade</label>
        <input value={Produto?.quantidade} onChange={(e) => setProduto({ ...Produto, quantidade: e.target.value })} type="number" id="qt" className={"form-control form-control-sm  mb-2 " + (validatelist.includes(("quantidade")) ? "border-danger" : "")} />
        <hr />
        <button type="button" onClick={() => InputsIsValid()} className="btn btn-sm btn-primary">Adicionar</button>
        {validatelist.length > 0 ? <p className="text-danger badge d-flex pt-2 pb-2">{validateerros}</p> : ""}
    </>)
}