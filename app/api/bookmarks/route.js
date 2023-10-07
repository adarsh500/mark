import { BOOKMARK } from '@/db/constants';
import clientPromise from '@/db/clientPromise';
import { DEVELOPMENT } from '@/db/constants';
const getMetaData = require('metadata-scraper');

export async function POST(request) {
  const client = await clientPromise;
  const db = client.db(DEVELOPMENT);
  const collection = db.collection(BOOKMARK);

  // console.log(metadataScraper);

  return new Response('Hello, world!');
}
