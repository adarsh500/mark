import clientPromise from 'lib/clientPromise';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('test');

  if (req.method === 'POST') {
    const collection = await db.collection('collection').insertOne(req.body);
    res.status(200).json(collection);
  }
}

// _id: 634bd01e09508354bc90e05a
// email: "gamerbloody99@gmail.com"
// collection: "bookmarks bar"
// children: []

// _id: 634bd01e09508354bc90e05a
// email: "gamerbloody99@gmail.com"
// collection: "bookmarks bar"
// parent: "634bd01e09508354bc90e05a"
// children: []
