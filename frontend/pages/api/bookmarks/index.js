import clientPromise from 'lib/clientPromise';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('test');
  if (req.method === 'POST') {
    const bookmark = await db.collection('bookmarks').insertOne(req.body);
    res.status(200).json(bookmark);
  } else if (req.method === 'DELETE') {
    const operation = await db
      .collection('bookmark')
      .remove({ _id: new ObjectId(req.query.id) });
    res.status(200).json(operation);
  }
}
