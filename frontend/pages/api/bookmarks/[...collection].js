import clientPromise from 'lib/clientPromise';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('test');

  if (req.method === 'GET') {
    const { collection } = req.query;
    const size = collection.length;

    console.log('slut', req.query);
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
    res.status(200).json(coll);
  }
}
