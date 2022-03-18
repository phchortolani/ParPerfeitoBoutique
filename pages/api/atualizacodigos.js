/* import { connectToDataBase } from '../../config/mongodb';

export default async (request, response) => {

    const db = await connectToDataBase(process.env.MONGODB_URI);

    const retorno = await db.collection("produtos").find({}).sort('dataCriacao').toArray();

    retorno.forEach((element, i) => {
        (async () => await db.collection("produtos").updateOne({ _id: element._id }, { $set: { codigo: i + 1 } }))();
    });

    let a = await db.collection("produtos").find({}).sort('dataCriacao').toArray(); 

    response.json({
        result: a ? a : null
    })

} */