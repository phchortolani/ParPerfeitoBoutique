import { connectToDataBase } from '../../config/mongodb';

export default async (request, response) => {
    if (request.body) {
        const { obj, table, login, update } = request.body;
        if (obj && table && login) {
            try {
                const db = await connectToDataBase(process.env.MONGODB_URI);

                const collection = db.collection(table);

                if (update) {
                    let objeto = { ...obj, alteradoPor: login, dataModificacao: new Date() };

                    if (table != "usuarios") {
                        delete objeto.dataCriacao;
                        delete objeto._id;
                        await collection.updateOne({ codigo: obj.codigo }, { $set: objeto });
                    }
                    else {
                        await collection.updateOne({ usuario: obj.usuario }, { $set: objeto });
                    }

                } else {
                    let objeto = { ...obj, criadoPor: login, dataCriacao: new Date(), dataModificacao: "", alteradoPor: "" };
                    await collection.insertOne(objeto);
                }
                response.send({
                    result: true
                });
            } catch {
                response.send({
                    result: false
                });
            }
        } else {
            response.send({
                result: "Erro de obj, table ou login"
            });
        }
    }

}