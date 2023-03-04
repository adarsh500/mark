import clientPromise from 'lib/clientPromise';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('test');

  if (req.method === 'GET') {
    const { collection } = req.query;
    const size = collection.length;
    if (size === 1) {
      const coll = await db
        .collection('bookmarks')
        .find({ email: collection[0] })
        .toArray();
      res.status(200).json(coll);
      return;
    }

    const coll = await db
      .collection('bookmarks')
      .find({ collectionID: collection[0], email: collection[1] })
      .toArray();
    return res.status(200).json(coll);
  } else if (req.method === 'PUT') {
    const operation = await db.collection('bookmarks').findOneAndUpdate(
      {
        _id: new ObjectId(req.query.collection[0]),
      },
      { $set: { favourite: true } }
    );
    return res.status(200).json(operation);
  } else if (req.method === 'DELETE') {
    const operation = await db
      .collection('bookmarks')
      .remove({ _id: new ObjectId(req.query.collection[0]) });
    return res.status(200).json(operation);
  }
}
