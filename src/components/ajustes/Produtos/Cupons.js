import { useState } from "react";
import Modal from "../../modal/Modal";

export default function Cupons() {
    const [tipoPorcentagem, setTipoPorcentagem] = useState(true);
    const [inputDesconto, setInputDesconto] = useState(1);
    const [modalCupons, setModalCupons] = useState({
        isOpen: false,
        title: "",
        children: ""
    });
    function openModal() {
        setModalCupons({ isOpen: true, title: 'Adicionar e remover cupons' });
    }
    function alterarTipo(EhTipoPorcentagem) {
        setTipoPorcentagem(EhTipoPorcentagem);
        setInputDesconto(1);
    }
    function AlterarInputDesconto(value) {
        let getmoney = Number(value.replace(/[\D]+/g, ''));
        if (tipoPorcentagem) {

            if (value > 100) value = 100;
            if (value <= 0) value = 1;
            setInputDesconto(value);
        } else {
            setInputDesconto(formatReal(getmoney));
        }
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
        <>
            <Modal open={modalCupons.isOpen} onTop={true} title={modalCupons.title} closeModal={() => setModalCupons({ ...modalCupons, isOpen: false })}>
                <label htmlFor="cupom">Crie o código promocional</label>
                <input className="form-control form-control-sm mb-2" id="cupom" typeof="text" maxLength={15} name="cupom"></input>

                <div className="row">
                    <div className="col-6">
                        <label htmlFor="dataini">Período inicial</label>
                        <input className="form-control  mb-2 form-control-sm" id="dataini" type="date" name="dataini"></input>
                    </div>
                    <div className="col-6">
                        <label htmlFor="datafim">Período final</label>
                        <input className="form-control  mb-2 form-control-sm" id="datafim" type="date" name="datafim"></input>
                    </div>
                    <div className="col-md-4 pt-3">
                        <div className="form-check">
                            <input className="form-check-input" onClick={() => alterarTipo(true)} type="radio" readOnly name="tipo" id="flexRadiotipo1" checked={tipoPorcentagem} />
                            <label className="form-check-label" htmlFor="flexRadiotipo1">
                                Porcentagem
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" onClick={() => alterarTipo(false)} type="radio" readOnly name="tipo" id="flexRadiotipo2" checked={!tipoPorcentagem} />
                            <label className="form-check-label" htmlFor="flexRadiotipo2">
                                Valor
                            </label>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <label htmlFor="datafim">{tipoPorcentagem ? "Porcentagem" : "Valor"}</label>
                        <input value={inputDesconto} onChange={(e) => AlterarInputDesconto(e.target.value)} className="form-control form-control-sm" id="cupom" typeof="text" maxLength={10} name="cupom"></input>
                    </div>

                    <div className="col-md-3 align-self-end text-md-right pt-2 pt-md-0">
                        <button className="btn btn-primary btn-sm">Adicionar </button>
                    </div>
                </div>



                <hr />
                <h5 className="text-primary">Cupons ativos</h5>
                <hr />
                <div className="row">
                    <div className="col-5">
                        <span>#DEMONSTRACAO10</span>
                    </div>
                    <div className="col-7">
                        <span>Periodo: 21/10/2021 - 20/11/2022</span>
                    </div>
                    <div className="col-5">
                        <span>Tipo: Porcentagem</span>
                    </div>
                    <div className="col-7">
                        <span>30%</span>
                    </div>
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