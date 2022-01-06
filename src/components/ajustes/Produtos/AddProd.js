import axios from 'axios';
import { useState, useContext, forwardRef, useImperativeHandle } from 'react';
import { AuthContext } from "../../../../context/Auth2Context";

let defaultProd = {
    codigo: 0,
    descricao: "",
    valor: 0,
    quantidade: "",
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

        setProduto({ ...Produto, codCategoria: categ ? e.target.value : "", valor: categ ? formatReal(categ.valorPadrao.toString().replace(".", "")) : "" })
    }


    useImperativeHandle(ref, () => {
        return {
            editProd
        }
    })

    function editProd(Produto) {
        setUpdateProd(Produto ? true : false);
        setProduto(Produto ? { ...Produto, valor: formatReal(Produto.valor.toString().replace(".", "")) } : defaultProd);
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
        let ret = await axios.post('/api/saveone', { obj: { ...Produto, valor: formataDecimal(Produto.valor) }, table: "produtos", login: login, update: true });
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
                valor: formataDecimal(Produto.valor)
            };

            let ret = await axios.post('/api/saveone', { obj: tempProduto, table: "produtos", login: login });

            if (ret.data.result) await props.getList();
            else setValidateErros("Ocorreu um erro ao salvar");
        } else {
            setValidateErros("Erro ao obter o ultimo codigo")
        }

    }

    function AlterarInputValor(value) {
        let semcaracteres = Number(value.replace(/[\D]+/g, ''));
        setProduto({ ...Produto, valor: formatReal(semcaracteres) })
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

        <label htmlFor="valor">Valor</label>
        <input value={Produto?.valor == 0 ? "" : Produto?.valor} onChange={(e) => AlterarInputValor(e.target.value)} maxLength={10} type="text" id="valor" className={"form-control form-control-sm  mb-2 " + (validatelist.includes(("valor")) ? "border-danger" : "")} placeholder="R$" />


        <label htmlFor="qt">Quantidade</label>
        <input value={Produto?.quantidade} onChange={(e) => setProduto({ ...Produto, quantidade: e.target.value })} type="number" id="qt" className={"form-control form-control-sm  mb-2 " + (validatelist.includes(("quantidade")) ? "border-danger" : "")} />
        <hr />
        <button type="button" onClick={() => InputsIsValid()} className="btn btn-sm btn-primary">Adicionar</button>
        {validatelist.length > 0 ? <p className="text-danger badge d-flex pt-2 pb-2">{validateerros}</p> : ""}
    </>)
}

export default forwardRef(AddProd);