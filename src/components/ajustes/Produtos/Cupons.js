import { useState, useContext, useCallback } from "react";
import Modal from "../../modal/Modal";
import { AuthContext } from "../../../../context/Auth2Context";
import axios from "axios";
import Loading from "../../load/Loading";

export default function Cupons(props) {
    const [validatelist, setValidatelist] = useState([{}]);
    const [validateerros, setValidateErros] = useState('');
    const { login } = useContext(AuthContext);
    const [cupons, setCupons] = useState({ data: [] });
    const [firstRender, setFirstRender] = useState(true);
    const [loadingRemove, setLoadingRemove] = useState(false);
    const [loading, setLoading] = useState(false);

    const defaultCupom = {
        codigo: "",
        periodoini: "",
        periodofim: "",
        tipoPorcentagem: true,
        valorDesconto: "",
        codCategoria: 0
    };
    const [cupom, setCupom] = useState(defaultCupom);

    const [modalCupons, setModalCupons] = useState({
        isOpen: false,
        title: "",
        children: ""
    });

    if (firstRender) {
        setFirstRender(false);
        GetCupons();
    }

    function openModal() {
        setModalCupons({ isOpen: true, title: 'Adicionar e remover cupons' });
        setCupom(defaultCupom);
        setValidatelist([{}]);
        setValidateErros('');
    }
    function alterarTipo(EhTipoPorcentagem) {
        setCupom({ ...cupom, tipoPorcentagem: EhTipoPorcentagem, valorDesconto: 1 });
    }

    function AlterarInputDesconto(value) {
        let semcaracteres = Number(value.replace(/[\D]+/g, ''));
        if (cupom.tipoPorcentagem) {
            if (semcaracteres > 100) semcaracteres = 100;
            if (semcaracteres <= 0) semcaracteres = 1;
            setCupom({ ...cupom, valorDesconto: semcaracteres });
        } else {
            setCupom({ ...cupom, valorDesconto: formatReal(semcaracteres) });
        }
    }

    function formatReal(int) {
        var tmp = int + '';
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if (tmp.length > 6)
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        return tmp;
    }

    async function addCupom() {
        setLoading(true);
        let erroslist = [];
        for (var prop in cupom) {
            if (cupom[prop].toString().trim() == "" && prop != "tipoPorcentagem" && prop != "dataModificacao" && prop != "alteradoPor") {
                erroslist.push(prop);
            }
        }
        setValidatelist(erroslist);
        if (erroslist.length > 0) {
            console.log(erroslist);
            setLoading(false);
            return setValidateErros("Preencha corretamente todos os campos obrigatórios.")
        }
        if (new Date(cupom.periodoini) > new Date(cupom.periodofim)) {
            erroslist.push('periodoini', 'periodofim');
            setLoading(false);
            return setValidateErros("A data final deve ser maior que a data inicial.");
        }

        var dataini = new Date(cupom.periodoini.replace('-', '/'));
        var datafim = new Date(cupom.periodofim.replace('-', '/'));
        if (dataini < diaAtual()) {
            erroslist.push('periodoini');
            setLoading(false);
            return setValidateErros("A data inicial deve ser maior ou igual a data atual.");
        }

        let objtoSave = {
            ...cupom,
            codigo: cupom.codigo.trim(),
            valorDesconto: cupom.tipoPorcentagem ? cupom.valorDesconto : formataDecimal(cupom.valorDesconto),
            periodoini: dataini,
            periodofim: datafim
        };

        let update = false;
        if (cupons.data.find(e => e.codigo.trim().toUpperCase() == cupom.codigo.trim().toUpperCase())) update = true;

        Save(objtoSave, update);
        setLoading(false);
    }

    async function GetCupons() {
        var ret = await axios.post('/api/listTable', { table: "vouchers" });
        if (ret.data.result) {
            setCupons({ data: ret.data.result });
        }
    }

    function checkCodPro() {
        let obj = cupons.data.find(e => e.codigo.trim().toUpperCase() == cupom.codigo.trim().toUpperCase());
        if (obj) {
            obj = { ...obj, periodoini: new Date(obj.periodoini).toISOString().split("T")[0], periodofim: new Date(obj.periodofim).toISOString().split("T")[0] };
            setCupom(obj);
        }
    }

    function Edit(e) {
        var obj = cupons.data.find(x => x.codigo == e.codigo);
        if (obj) {
            obj = { ...obj, periodoini: new Date(obj.periodoini).toISOString(), periodofim: new Date(obj.periodofim).toISOString() };
            setCupom({ ...obj, periodoini: obj.periodoini.split("T")[0], periodofim: obj.periodofim.split("T")[0] });
        }
    }

    function diaAtual() {
        let atual = new Date();
        let dia = atual.getDate();
        let mes = atual.getMonth();
        let ano = atual.getFullYear();

        return new Date(ano, mes, dia);
    }

    async function Save(objtoSave, update) {
        var ret = await axios.post('/api/saveone', { obj: objtoSave, table: "vouchers", login: login, update: update });
        if (ret.data.result) {
            if (ret) {
                setCupom(defaultCupom);
                if (update) await GetCupons();
                else setCupons({ data: [...cupons.data, objtoSave] });

            }
        }
        return false;
    }

    async function removeCupom() {
        setLoadingRemove(true);
        var ret = await axios.post('/api/deleteone', { table: "vouchers", where: { codigo: cupom.codigo } });
        if (ret.data.result) await GetCupons();
        setLoadingRemove(false);
    }

    function formataDecimal(valorStg) {
        let valorpuro = valorStg.toString().replace(".", '');
        valorpuro = valorpuro.replace(",", ".");
        return parseFloat(valorpuro);
    }
    return (
        <>
            <Modal open={modalCupons.isOpen}
                overflowY={true}
                onTop={true}
                title={modalCupons.title}
                closeModal={() => setModalCupons({ ...modalCupons, isOpen: false })}>

                <label htmlFor="cupom">Crie o código promocional</label>
                <input onBlur={() => checkCodPro()} onChange={(e) => { setCupom({ ...cupom, codigo: e.target.value }) }} value={cupom.codigo} className={"form-control mb-2 form-control-sm " + (validatelist.includes(("codigo")) ? "border-danger" : "")} id="cupom" typeof="text" maxLength={15} name="cupom"></input>

                <div className="row">
                    <div className="col-6">
                        <label htmlFor="dataini">Período inicial</label>
                        <input onChange={(e) => { setCupom({ ...cupom, periodoini: e.target.value }) }} value={cupom.periodoini} className={"form-control mb-2 form-control-sm " + (validatelist.includes(("periodoini")) ? "border-danger" : "")} id="dataini" type="date" name="dataini"></input>
                    </div>
                    <div className="col-6">
                        <label htmlFor="datafim">Período final</label>
                        <input onChange={(e) => { setCupom({ ...cupom, periodofim: e.target.value }) }} value={cupom.periodofim} className={"form-control mb-2 form-control-sm " + (validatelist.includes(("periodofim")) ? "border-danger" : "")} id="datafim" type="date" name="datafim"></input>
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="categs">Categorias</label>
                        <select id="categs" onChange={(e) => { setCupom({ ...cupom, codCategoria: Number(e.target.value) }) }} value={cupom.codCategoria} className="form-control form-control-sm">
                            <option value={0}>Todas</option>
                            {props.categorias ? props.categorias.map(((e, i) => <option key={i} value={e.codigo}>{e.codigo} - {e.descricao}</option>)) : ""}
                        </select>
                    </div>
                    <div className="col-md-3 pt-3">
                        <div className="form-check">
                            <input className="form-check-input" onClick={() => alterarTipo(true)} type="radio" readOnly name="tipo" id="flexRadiotipo1" checked={cupom.tipoPorcentagem} />
                            <label className="form-check-label" htmlFor="flexRadiotipo1">
                                Porcentagem
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" onClick={() => alterarTipo(false)} type="radio" readOnly name="tipo" id="flexRadiotipo2" checked={!cupom.tipoPorcentagem} />
                            <label className="form-check-label" htmlFor="flexRadiotipo2">
                                Valor
                            </label>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="datafim">{cupom.tipoPorcentagem ? "Porcentagem %" : "Valor R$"}</label>
                        <input value={cupom.valorDesconto} onChange={(e) => AlterarInputDesconto(e.target.value)} className={"form-control form-control-sm " + (validatelist.includes(("valorDesconto")) ? "border-danger" : "")} id="cupom" typeof="text" maxLength={10} name="cupom"></input>
                    </div>
                    <div className="col-md-5 align-self-end pt-2 pt-md-0">
                        {cupons.data.find(x => x.codigo == cupom.codigo) ?
                            <div>
                                <button onClick={() => addCupom()} className="btn btn-primary btn-sm">Alterar</button>
                                <button onClick={() => removeCupom()} className={"btn btn-sm " + (loadingRemove ? "disabled" : "")}>
                                    {loadingRemove ? <>Removendo <Loading /></> : <>Remover <i className="fas fa-trash small"></i></>}  </button>
                            </div> :
                            <button onClick={() => addCupom()} className={"btn btn-primary btn-sm " + (loading ? "disabled" : "")}>{loading ? <>Adicionando <Loading /></> : "Adicionar"} </button>
                        }
                    </div>
                </div>
                {validatelist.length > 0 ? <p className="text-danger badge d-flex pt-2 pb-2">{validateerros}</p> : ""}
                <hr />
                <h5 className="text-primary">Cupons ativos</h5>
                <hr />
                <div style={{ maxHeight: "20vh" }}>
                    {cupons.data?.length > 0 ? cupons.data?.map((e, i) => {
                        let ca = props.categorias.find(x => x.codigo == e.codCategoria);

                        return <div className="row" key={i}>
                            <div className="col-md-5">
                                <button onClick={() => Edit(e)} type="button" className="text-primary p-0 btn btn-sm btn-link text-decoration-none">{e.codigo}</button>
                            </div>
                            <div className="col-md-7">
                                <span>Periodo: {new Date(e.periodoini).toLocaleDateString()} - {new Date(e.periodofim).toLocaleDateString()}</span>
                            </div>
                            <div className="col-md-5">
                                <span>Tipo: {e.tipoPorcentagem ? "Porcentagem" : "Valor"}</span>
                            </div>
                            <div className="col-md-7 ">
                                <span>{e.tipoPorcentagem ? `${e.valorDesconto} %` : e.valorDesconto.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                            <div className="col-md-5 pb-3">
                                <span>Categoria: {ca ? ca.descricao : "Todas"}</span>
                            </div>
                        </div>
                    }) : ""}

                </div>
            </Modal>

            <a onClick={() => openModal()} className="btn btn-facebook btn-sm btn-icon-split">
                <span className="icon text-white-50">
                    <i className="fas fa-laugh"></i>
                </span>
                <span className="text">Cupons</span>
            </a>
        </>
    )
}