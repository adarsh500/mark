import clientPromise from 'lib/clientPromise';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('test');

  if (req.method === 'GET') {
    const { email } = req.query;
    const favourites = await db
      .collection('bookmarks')
      .find({ email: email, favourite: true })
      .toArray();
    res.status(200).json(favourites);
  }
}
