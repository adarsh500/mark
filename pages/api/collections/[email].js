import clientPromise from 'lib/clientPromise';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('test');

  if (req.method === 'GET') {
    const { email } = req.query;
    const collections = await db
      .collection('collection')
      .find({ email: email })
      .toArray();

    let collTree = [];
    let collMap = collections.map((coll) => ({ ...coll, children: [] }));
    collMap
      .filter((coll) => coll?.parent == '')
      ?.forEach((coll) => {
        collTree.push(coll);
      });
    collMap
      ?.filter((coll) => coll?.parent != '')
      ?.forEach((coll) => {
        collTree?.find((item) => item._id == coll?.parent)?.children.push(coll);
      });

    res.status(200).json(collTree);
  } else if (req.method === 'DELETE') {
    const coll = await db
      .collection('collection')
      .find({ _id: new ObjectId(req.query.email) });

    const op = await db
      .collection('collection')
      .deleteOne({ _id: new ObjectId(req.query.email) });

    const _ = await db
      .collection('collection')
      .deleteMany({ parent: coll._id });

    return res.status(200).json(op);
  }
}
