import { connectToDataBase } from '../../config/mongodb';

export default async (request, response) => {
    if (!request.body) {
        request.statusCode = 404;
        request.end('Error');
        return;
    }
    const encrypt = require("md5");
    const { username, newpass } = request.body;

    if (username && newpass.trim()) {
        const db = await connectToDataBase(process.env.MONGODB_URI);

        const usuario = await db.collection("usuarios").findOne({ usuario: username });

        let retorno;

        if (usuario) {
            if (usuario.senha == encrypt(newpass.trim())) {

               return response.json({
                    result: false,
                    msg: "A senha não pode ser igual a atual."
                });

            } else {
                retorno = await db.collection("usuarios").updateOne({ usuario: username }, { $set: { senha: encrypt(newpass.trim()), alteradoPor: username, dataModificacao: new Date(), redefinirSenha: false } });
            }

        } else {
            response.json({
                result: false,
                msg: "Erro ao obter usuário."
            });
        }

        response.json({
            result: retorno ? true : false,
            msg: retorno ? "Salvo com sucesso!" : "Erro ao salvar"
        })
    }
    else {
        response.json({
            result: false,
            msg: "O usuário não pode ser nulo."
        })
    }
}