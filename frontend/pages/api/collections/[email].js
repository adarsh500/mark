import clientPromise from 'lib/clientPromise';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('test');

  if (req.method === 'GET') {
    const { email } = req.query;
    const favourites = await db
      .collection('collection')
      .find({ email: email })
      .toArray();
    res.status(200).json(favourites);
  } else if (req.method === 'DELETE') {
    const operation = await db
      .collection('collection')
      .deleteOne({ _id: new ObjectId(req.query.email) });

    return res.status(200).json(operation);
  }
}
