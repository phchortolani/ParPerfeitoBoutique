import { useState, useContext, useCallback } from "react";
import Modal from "../../modal/Modal";
import { AuthContext } from "../../../../context/Auth2Context";
import axios from "axios";

export default function Cupons() {
    const [validatelist, setValidatelist] = useState([{}]);
    const [validateerros, setValidateErros] = useState('');
    const { login } = useContext(AuthContext);
    const [cupons, setCupons] = useState({ data: [] });
    const [firstRender, setFirstRender] = useState(true);

    const defaultCupom = {
        codigoPromocional: "",
        periodoini: "",
        periodofim: "",
        tipoPorcentagem: true,
        valorDesconto: ""
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

    function addCupom() {
        let erroslist = [];
        for (var prop in cupom) {
            if (cupom[prop].toString().trim() == "" && prop != "tipoPorcentagem") {
                erroslist.push(prop);
            }
        }
        setValidatelist(erroslist);
        if (erroslist.length > 0) {
            return setValidateErros("Preencha corretamente todos os campos obrigatórios.")
        }
        if (new Date(cupom.periodoini) > new Date(cupom.periodofim)) {
            erroslist.push('periodoini', 'periodofim');
            return setValidateErros("A data final deve ser maior que a data inicial.");
        }

        var dataini = new Date(cupom.periodoini.replace('-', '/'));
        var datafim = new Date(cupom.periodofim.replace('-', '/'));
        if (dataini < diaAtual()) {
            erroslist.push('periodoini');
            return setValidateErros("A data inicial deve ser maior ou igual a data atual.");
        }

        let objtoSave = {
            ...cupom,
            codigoPromocional: cupom.codigoPromocional.trim(),
            valorDesconto: cupom.tipoPorcentagem ? cupom.valorDesconto : formataDecimal(cupom.valorDesconto),
            periodoini: dataini,
            periodofim: datafim
        };

        let ret = Save(objtoSave);
        if (ret) {
            setCupom(defaultCupom);
            GetCupons();
        }

    }
    async function GetCupons() {
        var ret = await axios.post('/api/listTable', { table: "vouchers" });
        if (ret.data.result) {
            setCupons({ data: ret.data.result });
        }
    }

    function diaAtual() {
        let atual = new Date();
        let dia = atual.getDate();
        let mes = atual.getMonth();
        let ano = atual.getFullYear();

        return new Date(ano, mes, dia);
    }
    async function Save(objtoSave) {

        var ret = await axios.post('/api/saveone', { obj: objtoSave, table: "vouchers", login: login });
        if (ret.data.result) {
            return true;
        }
        return false;
    }

    function formataDecimal(valorStg) {
        let valorpuro = valorStg.toString().replace(".", '');
        valorpuro = valorpuro.replace(",", ".");
        return parseFloat(valorpuro);
    }
    return (
        <>
            <Modal open={modalCupons.isOpen} onTop={true} title={modalCupons.title} closeModal={() => setModalCupons({ ...modalCupons, isOpen: false })}>
                <label htmlFor="cupom">Crie o código promocional</label>
                <input onChange={(e) => { setCupom({ ...cupom, codigoPromocional: e.target.value }) }} value={cupom.codigoPromocional} className={"form-control mb-2 form-control-sm " + (validatelist.includes(("codigoPromocional")) ? "border-danger" : "")} id="cupom" typeof="text" maxLength={15} name="cupom"></input>

                <div className="row">
                    <div className="col-6">
                        <label htmlFor="dataini">Período inicial</label>
                        <input onChange={(e) => { setCupom({ ...cupom, periodoini: e.target.value }) }} value={cupom.periodoini} className={"form-control mb-2 form-control-sm " + (validatelist.includes(("periodoini")) ? "border-danger" : "")} id="dataini" type="date" name="dataini"></input>
                    </div>
                    <div className="col-6">
                        <label htmlFor="datafim">Período final</label>
                        <input onChange={(e) => { setCupom({ ...cupom, periodofim: e.target.value }) }} value={cupom.periodofim} className={"form-control mb-2 form-control-sm " + (validatelist.includes(("periodofim")) ? "border-danger" : "")} id="datafim" type="date" name="datafim"></input>
                    </div>
                    <div className="col-md-4 pt-3">
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
                    <div className="col-md-5">
                        <label htmlFor="datafim">{cupom.tipoPorcentagem ? "Porcentagem %" : "Valor R$"}</label>
                        <input value={cupom.valorDesconto} onChange={(e) => AlterarInputDesconto(e.target.value)} className={"form-control form-control-sm " + (validatelist.includes(("valorDesconto")) ? "border-danger" : "")} id="cupom" typeof="text" maxLength={10} name="cupom"></input>
                    </div>

                    <div className="col-md-3 align-self-end text-md-right pt-2 pt-md-0">
                        <button onClick={() => addCupom()} className="btn btn-primary btn-sm">Adicionar </button>

                    </div>
                </div>
                {validatelist.length > 0 ? <p className="text-danger badge d-flex pt-2 pb-2">{validateerros}</p> : ""}
                <hr />
                <h5 className="text-primary">Cupons ativos</h5>
                <hr />
                <div className="row">
                    {cupons.data?.length > 0 ? cupons.data?.map((e, i) => {
                        return <>
                            <div className="col-5">
                                <span className="text-primary">{e.codigoPromocional}</span>
                            </div>
                            <div className="col-7">
                                <span>Periodo: {new Date(e.periodoini).toLocaleDateString()} - {new Date(e.periodofim).toLocaleDateString()}</span>
                            </div>
                            <div className="col-5">
                                <span>Tipo: {e.tipoPorcentagem ? "Porcentagem" : "Valor"}</span>
                            </div>
                            <div className="col-7 pb-3">
                                <span>{e.tipoPorcentagem ? `${e.valorDesconto} %` : e.valorDesconto.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                        </>
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