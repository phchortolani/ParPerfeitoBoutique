import { connectToDataBase } from '../../config/mongodb';

export default async (request, response) => {
    if (!request.body) {
        request.statusCode = 404;
        request.end('Error');
        return;
    }

    const { numberReserva } = request.body;

    const db = await connectToDataBase(process.env.MONGODB_URI);

    const retorno = await db.collection("reservas").findOne({ reserva: Number(numberReserva) });

    if (retorno) {


        retorno.carrinho.forEach((e) => {
            (async () => {
                let produto = await db.collection("produtos").findOne({ codigo: e.item.codigo });
                await db.collection("produtos").updateOne({ codigo: e.item.codigo }, { $set: { quantidade: Number(produto.quantidade) + Number(e.qt) } })
            })();
        });

        let excluido = await db.collection("reservas").deleteOne({ reserva: Number(numberReserva) });


        return response.json({
            result: excluido ? true : false
        })
    }
    return response.json({
        result: false
    })


}