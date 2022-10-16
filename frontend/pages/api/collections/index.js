import clientPromise from 'lib/clientPromise';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('test');

  if (req.method === 'POST') {
    const collection = await db.collection('collection').insertOne(req.body);
    res.status(200).json(collection);
  } else if (req.method === 'DELETE') {
    const operation = await db
      .collection('bookmarks')
      .remove({ _id: new ObjectId(req.query.collection[0]) });
    return res.status(200).json(operation);
    res.status(200).json(collection);
  }
}
