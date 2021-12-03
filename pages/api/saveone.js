import { connectToDataBase } from '../../config/mongodb';

export default async (request, response) => {
    if (request.body) {
        const { obj, table, update } = request.body;
        if (obj && table) {
            try {
                const db = await connectToDataBase(process.env.MONGODB_URI);

                const collection = db.collection(table);

                if (update) {
                    await collection.updateOne({ usuario: obj.usuario }, { $set: obj });
                } else {
                    await collection.insertOne(obj);
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
                result: "Erro de obj ou table"
            });
        }
    }

}