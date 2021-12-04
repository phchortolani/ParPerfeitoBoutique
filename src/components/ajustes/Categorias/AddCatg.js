import { useState } from "react";
let lista = [];

let defaultCateg = {
    codigo: 1,
    descricao: "",
    valorPadrao: ""
}
export default function AddCatg(props) {
    const [categoria, setCategoria] = useState(defaultCateg);
    const [showRemove, setshowRemove] = useState(false);

    async function InsertCateg() {
        lista.push(categoria);
        defaultCateg.codigo++;
        setCategoria({ ...defaultCateg });
        props.sendToList(sortList(lista));
    }
    async function RemoveCateg(codCateg) {
        let categIndex = searchCategoria(codCateg, true);
        lista.splice(categIndex, 1);
        setCategoria(defaultCateg);
        setshowRemove(false);
        props.sendToList(sortList(lista));
    }
    async function QueryCateg(codCateg) {
        let categ = searchCategoria(codCateg);
        if (categ) setCategoria(categ);
        else setCategoria({ ...defaultCateg, codigo: codCateg });
        setshowRemove(categ != undefined ? true : false);
    }
    function searchCategoria(codigo, index) {
        if (index) return lista.findIndex((e) => e.codigo == codigo);
        return lista.find((e) => e.codigo == codigo);
    }

    function AlterCateg(cod) {
        let categIndex = searchCategoria(cod, true);
        lista.splice(categIndex, 1);
        lista.push(categoria);
        props.sendToList(sortList(lista));
        defaultCateg.codigo++;
        setCategoria({ ...defaultCateg });

    }


    function sortList(list) {
        return list.sort(function (a, b) {
            if (a.codigo > b.codigo) {
                return 1;
            }
            if (a.codigo < b.codigo) {
                return -1;
            }
            return 0;
        });
    }



    return (<div>

        <label htmlFor="codigo">Código</label>
        <input type="number" onBlur={(e) => QueryCateg(e.target.value)} value={categoria.codigo} id="codigo" onChange={(e) => { setCategoria({ ...categoria, codigo: e.target.value }) }} className="form-control form-control-sm  mb-3 " />

        <label htmlFor="desc">Descrição</label>
        <input type="text" id="desc" onChange={(e) => { setCategoria({ ...categoria, descricao: e.target.value }) }} value={categoria?.descricao} className="form-control form-control-sm  mb-3 " />

        <label htmlFor="valor">Valor padrão</label>
        <input type="text" value={categoria?.valorPadrao} id="valor" onChange={(e) => { setCategoria({ ...categoria, valorPadrao: e.target.value }) }} className="form-control form-control-sm  mb-3 " />
        <hr />
        <div className="d-flex justify-content-between">
            {showRemove ? <a onClick={() => RemoveCateg()} className="btn btn-danger btn-sm btn-icon-split">
                <span className="icon text-white-50">
                    <i className="fas fa-trash-alt"></i>
                </span>
                <span className="text">Remover</span>
            </a> : ""}
            <a onClick={(e) => showRemove ? AlterCateg(e) : InsertCateg()} className="btn btn-primary btn-sm btn-icon-split">
                <span className="icon text-white-50">
                    <i className="fas fa-save"></i>
                </span>
                <span className="text">{showRemove ? "Alterar" : "Adicionar"}</span>
            </a>
        </div>

    </div>)
}