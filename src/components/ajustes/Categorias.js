import DefaultCard from "../cards/DefaultCard";
const firstRender = true;

export default function Categorias() {
  
    return (<>
        <h1 className="h3 mb-1 text-gray-800">Categorias</h1>
        <p className="mb-3">Aqui é possível adicionar categorias para separação de valores e produtos.</p>
        <div>
            <DefaultCard title="Categorias">
                <div className="row">
                    <div className="col-md-3 border p-3 rounded">
                        <label htmlFor="codigo">Código</label>
                        <input type="text" id="codigo" className="form-control mb-3" placeholder="Ex.: 23" />
                        <label htmlFor="desc">Descrição</label>
                        <input type="text" id="desc" className="form-control mb-3" placeholder="Ex.: Sapatilha" />
                        <label htmlFor="valor">Valor padrão</label>
                        <input type="text" id="valor" className="form-control mb-3" placeholder="Ex.: R$49,99" />
                        <button type="button" className="btn btn-sm btn-primary">Adicionar</button>
                    </div>
                    <div className="col-md-9 p-0 p-md-0 pl-md-2 pt-2">
                        <table className="table table-bordered table-sm table-responsive-sm dataTable" id="dataTable" width="100%" cellSpacing="0" role="grid" >
                            <thead>
                                <tr>
                                    <th scope="col">Código</th>
                                    <th scope="col">Descricao</th>
                                    <th scope="col">Valor</th>
                                    <th scope="col" className="text-center ">Etiqueta</th>
                                    <th scope="col" className="text-center ">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">12598</th>
                                    <td>Sapatilhas Comum</td>
                                    <td>R$ 25,98</td>
                                    <td className="text-center align-middle p-0 ">
                                        <a href="#" className="btn btn-sm btn-info btn-icon-split">
                                            <span className="icon text-white-50">
                                                <i className="fas fa-barcode"></i>
                                            </span>
                                            <span className="text d-none d-md-block">Imprimir</span>
                                        </a>
                                    </td>
                                    <td className="text-center align-middle p-0 "><a className="fas fa-times btn btn-sm btn-outline-danger"></a></td>
                                </tr>
                                <tr>
                                    <th scope="row">2999</th>
                                    <td>Brincos</td>
                                    <td>R$ 9,99</td>
                                    <td className="text-center align-middle p-1">
                                        <a href="#" className="btn btn-sm btn-info btn-icon-split">
                                            <span className="icon text-white-50">
                                                <i className="fas fa-barcode"></i>
                                            </span>
                                            <span className="text d-none d-md-block">Imprimir</span>
                                        </a>
                                    </td>
                                    <td className="text-center align-middle p-0 "><a className="fas fa-times btn btn-sm btn-outline-danger"></a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </DefaultCard>
        </div>
    </>)
}