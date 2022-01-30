export default function TableSelecionados(props) {
    let list = orderByCodigo(props.cart);

    function orderByCodigo(list) {
        return list.sort(function (a, b) {
            if (a.descricao > b.descricao) return 1;
            if (a.descricao < b.descricao) return -1;
            return 0;
        });
    }

    function IncluirVoucher(value, produto) {
        props.EditVoucher(value.toUpperCase(), produto.codigo);
    }

    return (<>
        <table style={{ whiteSpace: "nowrap" }} className="table text-capitalize small text-uppercase table-sm table-responsive-sm dataTable" id="dataTable" width="100%" cellSpacing="0" role="grid" >
            <thead>
                <tr>
                    <th scope="col" className="fitCol">Código</th>
                    <th scope="col">Produto</th>
                    <th scope="col">Voucher por produto</th>
                    <th scope="col" className="fitCol">Valor </th>
                    <th scope="col" className="text-center" style={{ width: "6rem" }}>Quantidade</th>
                    <th scope="col" className="fitCol">Total</th>
                    <th scope="col" className="text-center fitCol">Ação</th>
                </tr>
            </thead>
            <tbody>
                {list.length > 0 ? list.map((element, i) => {
                    var e = element.item;
                    var qt = element.qt;
                    var voucher = element.voucher?.codigo;
                    var valorDescontado = element.VoucherDescontado ?? 0;
                    return <tr key={i}>
                        <th scope="row">{e.codigo}</th>
                        <td>{e.descricao}</td>
                        <td className="w-25"><input type="text" id={e.codigo} value={voucher ?? ""} onBlur={(x) => props.TestVoucher(x.target.value, e, valorDescontado > 0)} maxLength={12} onChange={(x) => IncluirVoucher(x.target.value, e)} className="form-control text-center form-control-sm" /></td>
                        <td>
                            {valorDescontado > 0 ?
                                <div className="row">
                                    <div className="col-12 sublinhar text-danger small"> {(e.valor + valorDescontado).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</div>
                                    <div className="col-12 text-success"><b>{e.valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</b></div>
                                </div> : <div className="col-12">{e.valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</div>}

                        </td>
                        <td className="text-center align-middle px-3">
                            <input type="number" className="form-control text-center form-control-sm" onChange={(x) => props.EditQt(e, x.target.value)} value={qt} />
                        </td>
                        <td>{(e.valor * qt).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                        <td className="text-center align-middle p-0 "><a onClick={() => props.RemoveItem(e.codigo)} className="fas fa-times btn btn-sm text-danger"></a></td>
                    </tr>
                }) : <></>}

            </tbody>
        </table>
    </>)
}