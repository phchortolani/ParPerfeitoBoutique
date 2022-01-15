import axios from 'axios';
import { useState, useContext, forwardRef, useImperativeHandle } from 'react';
import { AuthContext } from "../../../../context/Auth2Context";

let defaultProd = {
    codigo: 0,
    descricao: "",
    valor: 0,
    valorDeCompra: 0,
    quantidade: "",
    qtEstoque: "",
    codCategoria: ""
}

const AddProd = (props, ref) => {
    const [Produto, setProduto] = useState(defaultProd);
    const [validatelist, setValidatelist] = useState([{}]);
    const [validateerros, setValidateErros] = useState('');
    const [updateProd, setUpdateProd] = useState(false);
    const { login } = useContext(AuthContext);

    function InputsIsValid() {
        let erroslist = [];
        for (var prop in Produto) {
            if (prop != "codigo" && prop != "dataModificacao" && prop != "alteradoPor") {
                if (Produto[prop] == "") {
                    erroslist.push(prop);
                }
            }
        }
        setValidatelist(erroslist);
        if (erroslist.length > 0) {
            console.log(erroslist);
            setValidateErros("Preencha todos os campos obrigatórios.")
        } else updateProd ? updateProduto() : SaveProd();
    }

    function searchCategoria(codigo, index) {
        if (index) return props.categorias.findIndex((e) => e.codigo == codigo);
        return props.categorias.find((e) => e.codigo == codigo);
    }

    function CategoriaOnChange(e) {
        let categ = searchCategoria(e.target.value);

        let valor = String(categ?.valorPadrao).includes(".") ? categ?.valorPadrao : categ?.valorPadrao.toFixed(2);

        setProduto(
            {
                ...Produto,
                codCategoria: categ ? e.target.value : "",
                valor: categ ? formatReal(valor.toString().replace(".", "")) : ""
            })
    }


    useImperativeHandle(ref, () => {
        return {
            editProd
        }
    })

    function editProd(Produto) {

        setUpdateProd(Produto ? true : false);
        let valor = String(Produto?.valor).includes(".") ? Produto?.valor : Produto?.valor.toFixed(2);
        let valorDeCompra = String(Produto?.valorDeCompra).includes(".") ? Produto?.valorDeCompra : Produto?.valorDeCompra.toFixed(2);
        setProduto(Produto ? { ...Produto, valor: formatReal(valor.toString().replace(".", "")), valorDeCompra: formatReal(valorDeCompra.toString().replace(".", "")) } : defaultProd);
    }

    function formataDecimal(valorStg) {
        let valorpuro = valorStg.toString().replace(".", '');
        valorpuro = valorpuro.replace(",", ".");
        return parseFloat(valorpuro);
    }

    function RemoveCategFromCod(codProduto) {
        return parseInt(`${codProduto}`.split("").reverse().join("").substring(0, Produto.codCategoria.length).split("").reverse().join(""));
    }

    async function updateProduto() {
        let ret = await axios.post('/api/saveone', { obj: { ...Produto, valor: formataDecimal(Produto.valor), valorDeCompra: formataDecimal(Produto.valorDeCompra), quantidade: parseInt(Produto.quantidade), qtEstoque: parseInt(Produto.qtEstoque) }, table: "produtos", login: login, update: true });
        if (ret.data.result) {
            setProduto(defaultProd);
            setUpdateProd(false);
            await props.getList();
        }
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
                qtEstoque: parseInt(Produto.qtEstoque),
                valor: formataDecimal(Produto.valor),
                valorDeCompra: formataDecimal(Produto.valorDeCompra)
            };

            let ret = await axios.post('/api/saveone', { obj: tempProduto, table: "produtos", login: login });

            if (ret.data.result) await props.getList();
            else setValidateErros("Ocorreu um erro ao salvar");
        } else {
            setValidateErros("Erro ao obter o ultimo codigo")
        }

    }

    function AlterarInputValor(value, valorCompra) {
        let semcaracteres = Number(value.replace(/[\D]+/g, ''));
        if (valorCompra) setProduto({ ...Produto, valorDeCompra: formatReal(semcaracteres) });
        else setProduto({ ...Produto, valor: formatReal(semcaracteres) });
    }

    function formatReal(int) {
        var tmp = int + '';
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if (tmp.length > 6)
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        return tmp;
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
        <label htmlFor="valorDeCompra">Valor de Compra</label>
        <input value={Produto?.valorDeCompra == 0 ? "" : Produto?.valorDeCompra} onChange={(e) => AlterarInputValor(e.target.value, true)} maxLength={10} type="text" id="valorDeCompra" className={"form-control form-control-sm  mb-2 " + (validatelist.includes(("valorDeCompra")) ? "border-danger" : "")} placeholder="R$" />
        <label htmlFor="valor">Valor de Venda</label>
        <input value={Produto?.valor == 0 ? "" : Produto?.valor} onChange={(e) => AlterarInputValor(e.target.value, false)} maxLength={10} type="text" id="valor" className={"form-control form-control-sm  mb-2 " + (validatelist.includes(("valor")) ? "border-danger" : "")} placeholder="R$" />


        <label htmlFor="qt">Quantidade</label>
        <input value={Produto?.quantidade} onChange={(e) => setProduto({ ...Produto, quantidade: e.target.value })} type="number" id="qt" className={"form-control form-control-sm  mb-2 " + (validatelist.includes(("quantidade")) ? "border-danger" : "")} />
        <label htmlFor="qt">Qtd. Total Estoque</label>
        <input value={Produto?.qtEstoque} onChange={(e) => setProduto({ ...Produto, qtEstoque: e.target.value })} type="number" id="qt" className={"form-control form-control-sm  mb-2 " + (validatelist.includes(("qtEstoque")) ? "border-danger" : "")} />
        <hr />
        <button type="button" onClick={() => InputsIsValid()} className="btn btn-sm btn-primary">Adicionar</button>
        {validatelist.length > 0 ? <p className="text-danger badge d-flex pt-2 pb-2">{validateerros}</p> : ""}
    </>)
}

export default forwardRef(AddProd);