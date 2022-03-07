import { connectToDataBase } from '../../config/mongodb';

export default async (request, response) => {
    if (!request.body) {
        request.statusCode = 404;
        request.end('Error');
        return;
    }

    const { table, where = {} } = request.body;

    if (table) {
        const db = await connectToDataBase(process.env.MONGODB_URI);

        const retorno = await db.collection(table).find(where).sort({ 'codigo': -1 }).limit(1).toArray();

        response.json({
            result: retorno ? retorno : null
        })
    }
    else {
        response.json({
            result: "Table error"
        })
    }
}