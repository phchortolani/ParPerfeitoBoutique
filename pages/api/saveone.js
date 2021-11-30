import { connectToDataBase } from '../../config/mongodb';

export default async (request, response) => {
    if (request.body) {
        const { obj, table } = request.body;
        if (obj && table) {
            try {
                const db = await connectToDataBase(process.env.MONGODB_URI);

                const collection = db.collection(table);

                 await collection.insertOne(obj);

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