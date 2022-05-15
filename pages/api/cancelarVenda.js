import { connectToDataBase } from '../../config/mongodb';

export default async (request, response) => {
    if (!request.body) {
        request.statusCode = 404;
        request.end('Error');
        return;
    }

    const ObjectId = require('mongodb').ObjectId;

    const { idVenda } = request.body;

    const db = await connectToDataBase(process.env.MONGODB_URI);

    const venda = await db.collection("vendas").findOne({ _id: ObjectId(idVenda) });

    if (idVenda && venda) {
        let produtosARepor = [];

        venda.itens?.forEach(object => {
            produtosARepor.push({
                idProduto: object.item._id,
                qt: object.qt
            })
        });

        if (produtosARepor.length > 0) {
            produtosARepor.forEach((e) => {
                (async () => {
                    let prodAnterior = await db.collection("produtos").findOne({ _id: ObjectId(e.idProduto) });
                    if (prodAnterior) {
                        await db.collection("produtos").updateOne(
                            {
                                _id: ObjectId(e.idProduto)  //where
                            },
                            {
                                $set: {
                                    quantidade: Number(prodAnterior.quantidade) + Number(e.qt)
                                }
                            })
                    }
                })();
            });
        }


        let ret = await db.collection("vendas").updateOne({ _id: ObjectId(idVenda) }, { $set: { cancelada: true } })
        return response.json({ status: ret ? true : false })
    }

    return response.json({ status: false })
}





