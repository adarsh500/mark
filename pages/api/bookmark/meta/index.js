const getMetaData = require('metadata-scraper');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ message: 'URL not provided' });
    }

    try {
      const result = await getMetaData(url);

      res
        .status(200)
        .json({ message: 'fetched metadata successfully', data: result });
    } catch (e) {
      res.status(500).json({ message: 'Failed to add bookmark' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
