import clientPromise from 'lib/clientPromise';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('test');
  if (req.method === 'POST') {
    const collection = await db.collection('collection').insertOne(req.body);
    res.status(200).json(collection);
  }
}
