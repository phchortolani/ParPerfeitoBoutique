import { connectToDataBase } from '../../config/mongodb';

export default async (request, response) => {
    if (!request.body) {
        request.statusCode = 404;
        request.end('Error');
        return;
    }

    const { user } = request.body;

    if (user) {
        const db = await connectToDataBase(process.env.MONGODB_URI);

        let retorno = await db.collection("usuarios").updateOne({ usuario: user.usuario }, { $set: { alteradoPor: user.usuario, dataModificacao: new Date(), redefinirSenha: !user.redefinirSenha } });

        response.json({
            result: retorno ? true : false,
            msg: retorno ? "Alterado com sucesso!" : "erro ao alterar"
        })
        return;
    }

    response.json({
        result: false,
        msg: "erro ao verificar usuário"
    })

}