import clientPromise from 'lib/clientPromise';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('test');

  if (req.method === 'POST') {
    const { collection } = req.body;
    const exist = await db.collection('collection').findOne({ collection });

    const restricted = [
      'All',
      'all',
      'favourites',
      'Favourites',
      'Favourite',
      'favourite',
    ];
    if (exist || restricted.includes(collection)) {
      res.status(400).json({ message: 'Collection name already exists' });
      return;
    }

    const add = await db.collection('collection').insertOne(req.body);
    res.status(200).json(add);
    return;
  }
}
