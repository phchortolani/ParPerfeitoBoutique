import axios from "axios";
import { useState } from "react";

export default function AddProdutos(props) {
    const [prodSear, setProdSear] = useState(null);
    const [reser, setReserva] = useState(0);

    function AddProd() {
        props.AddItem(prodSear, true);
        setProdSear(null);
    }

    async function cancelReser() {
        let ret = await axios.post("/api/cancelarReserva", { numberReserva: reser });
        return ret.data.result;
    }
    function Limpar() {
        props.clearCart();
        setReserva(0);
    }
    async function CancelarReserva() {
        if (reser > 0) {
            Swal.fire({
                title: 'Deseja excluir a reserva?',
                /*  html: printContent.innerHTML, */
                html: "<p class='text-center'> Os produtos voltarão para o estoque.</p>",
                icon: 'question',
                showCancelButton: true,
                cancelButtonColor: '#e74a3b',
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    let ret = cancelReser();
                    if (ret) {
                        Swal.fire("Excluído!", "Os itens voltaram para o estoque!", "success");
                        Limpar();
                    } else {
                        Swal.fire("Erro!", "Houve um erro ao excluir os produtos", "warning");
                    }
                }
            })


        }
    }

    function AddReserva(reserva) {
        setReserva(reserva);
        let reser = props.reservas.filter((e) => { return e.reserva == reserva });

        let retorno = [];

        reser.forEach(element => {
            element.carrinho.forEach(e => {
                retorno.push(e)
            });
        });
        props.addReserva(retorno, reserva);

    }

    function Real(value) {
        return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    }

    return (<>
        <div className="row">
            {/*     <div className="col-md-12">
                <label htmlFor="sele">Produtos</label>
                <select className="form-control form-control-sm" id="sele">
                    <option value="">Selecione...</option>
                    <optgroup label="Brincos">
                        <option value="132598">132598 - Brinco Rubi R$ 9,99</option>
                    </optgroup>
                    <optgroup label="Sapatilhas">
                        <option value="112598">112598 - Sapatilha Comum - R$ 25,98</option>
                        <option value="122598">122598 - Sapatilha Mule - R$ 25,98</option>
                    </optgroup>
                </select>
            </div> */}
            <div className="col-md-12">
                <div onKeyPress={(e) => { `${e.key}` == 'Enter' ? AddProd() : "" }} className="mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                    <div className="input-group">
                        <input placeholder="Adicionar Produto" value={prodSear ? prodSear : ""} onChange={(e) => setProdSear(e.target.value)} className="form-control bg-light border-0 small" list="sear" id="pesq" />
                        <datalist id="sear">
                            {props.produtos ? props.produtos.map((e, i) => {
                                return <option key={i} value={e.codigo}>{e.codigo} - {e.descricao} - {Real(e.valor)} - Qnt. {e.quantidade}</option>
                            }) : ""}
                        </datalist>
                        <div className="input-group-append">
                            <button className="btn btn-primary" onClick={() => AddProd()} type="button">
                                <i className="fas fa-plus-square fa-sm"></i>
                            </button>
                        </div>
                    </div>

                    <div className="input-group mt-2">
                        <input placeholder="Carregar Reserva" onChange={(e) => AddReserva(e.target.value)} className="form-control bg-light border-0 small" list="reservas" id="reserva" />
                        <datalist id="reservas">
                            {props.reservas ? props.reservas.map((e, i) => {
                                return <option key={i} value={e.reserva}>Nº {e.reserva}  Nome: {e.nome}  Telefone: {e.telefone}</option>
                            }) : ""}
                        </datalist>
                        <div className="input-group-append">
                            {reser > 0 && props.reservas.length > 0 ? <button onClick={() => CancelarReserva()} className="btn btn-danger btn-sm" type="button">
                                <i className="fas fa-undo-alt fa-sm"></i> Excluir Reserva
                            </button> : ""}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}