import jwt from "jsonwebtoken";
import { connectToDataBase } from '../../config/mongodb';

export default async (request, response) => {
    if (!request.body) {
        request.statusCode = 404;
        request.end('Error');
        return;
    }
    const encrypt = require("md5");

    const { user, pass } = request.body;

    const db = await connectToDataBase(process.env.MONGODB_URI);

    const usuario = await db.collection('usuarios').findOne({ usuario: user, senha: encrypt(pass) });

    if (usuario) {
        response.json({
            token: jwt.sign({
                username: usuario.usuario,
                id: usuario._id,
                email: usuario.email,
                tipo: usuario.tipo,
                redefinirSenha: usuario.redefinirSenha
            }, process.env.JWT_KEY),
            login: usuario.usuario
        }
        );
    } else {
        response.send(null);
    }


}