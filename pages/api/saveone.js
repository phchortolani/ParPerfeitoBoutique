import { connectToDataBase } from '../../config/mongodb';

export default async (request, response) => {
    if (request.body) {
        const { obj, table, update } = request.body;
        if (obj && table) {
            try {
                const db = await connectToDataBase(process.env.MONGODB_URI);

                const collection = db.collection(table);

                if (update) {
                    await collection.updateOne({ usuario: obj.usuario }, { $set: obj }, (err, res) => {
                        if (err) throw err;
                    });
                } else {
                    await collection.insertOne(obj);
                }

                response.send({
                    result: true
                });

            } catch {
                response.send(null);
            }
        } else {
            response.send(null);
        }
    }

}