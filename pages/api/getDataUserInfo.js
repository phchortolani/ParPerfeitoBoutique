import { connectToDataBase } from '../../config/mongodb';

export default async (request, response) => {
    if (!request.body) {
        request.statusCode = 404;
        request.end('Error');
        return;
    }

    const { usuario } = request.body;

    if (usuario) {
        const db = await connectToDataBase(process.env.MONGODB_URI);
        const userinfo = await db.collection("usuarios").findOne({ usuario: usuario });
        const vendas = await db.collection("vendas").find({ criadoPor: usuario }).toArray();
       
        if (vendas && userinfo) {
            return response.json({
                result: true,
                msg: "Usuário encontrado",
                obj: {
                    vendas,
                    userinfo
                }
            })
        } else {
            return response.json({
                result: false,
                msg: "Erro ao obter as vendas ou as infos do usuário"
            })
        }

    }
    else {
        return response.json({
            result: false,
            msg: "Usuário não encontrado"
        })
    }
}