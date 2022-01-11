import { connectToDataBase } from '../../config/mongodb';

export default async (request, response) => {
    if (!request.body) {
        request.statusCode = 404;
        request.end('Error');
        return;
    }

    const { codigoVoucher } = request.body;

    if (codigoVoucher) {
        const db = await connectToDataBase(process.env.MONGODB_URI);

        const retorno = await db.collection("vouchers").findOne({codigo: codigoVoucher});
        
        response.json({
            result: retorno ? retorno : false
        })
    }
    else {
        response.json({
            result: "erro ao consultar voucher"
        })
    }
}