import clientPromise from 'lib/clientPromise';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('test');

  if (req.method === 'GET') {
    const { collection } = req.query;

    console.log('slut', req.query);
    const coll = await db
      .collection('bookmarks')
      .find({ collectionID: collection[0], email: collection[1] })
      .toArray();
    res.status(200).json(coll);
  }
}
