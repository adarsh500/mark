import clientPromise from 'lib/clientPromise';
import { ObjectId } from 'mongodb';
const getMetaData = require('metadata-scraper');

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('test');

  if (req.method === 'POST') {
    const body = Object.create(req.body);
    const { url } = body;
    const metaData = await getMetaData(url);

    body.title = metaData.title;
    body.image = metaData.image;
    body.description = metaData.description;
    body.section = metaData.section;
    body.date = new Date().toLocaleDateString();

    const bookmark = await db.collection('bookmarks').insertOne(body);
    res.status(200).json(bookmark);
  } else if (req.method === 'DELETE') {
    const operation = await db
      .collection('bookmark')
      .remove({ _id: new ObjectId(req.query.id) });
    res.status(200).json(operation);
  }
}
