import { connectToDataBase } from '../../config/mongodb';

export default async (request, response) => {
    if (!request.body) {
        request.statusCode = 404;
        request.end('Error');
        return;
    }

    const { codprod } = request.body;

    if (codprod) {
        const db = await connectToDataBase(process.env.MONGODB_URI);

        const retorno = await db.collection("produtos").findOne({ codigo: codprod });

        response.json({
            result: retorno ? retorno.quantidade : null
        })
    }
    else {
        response.json({
            result: "Erro de obj ou table"
        })
    }
}