import clientPromise from '@/db/clientPromise';
import { BOOKMARK, DEVELOPMENT } from '@/db/constants';
const getMetaData = require('metadata-scraper');

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db(DEVELOPMENT);
  const collection = db.collection(BOOKMARK);
  if (req.method === 'POST') {
    const { url, collection_id = '', user_id = '' } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL not provided' });
    }

    if (!user_id) {
      return res.status(400).json({ message: 'User not provided' });
    }

    try {
      const {
        title = '',
        description = '',
        image = '',
        type = '',
        provider = '',
        icon = '',
      } = await getMetaData(url);

      const result = await collection.insertOne({
        url,
        title,
        description,
        image,
        type,
        provider,
        icon,
        favourite: false,
        collection_id,
        user_id,
        created_at: new Date().getTime(),
      });

      res
        .status(200)
        .json({ message: 'Bookmark added successfully', data: result });
    } catch (e) {
      res.status(500).json({ message: 'Failed to add bookmark' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
