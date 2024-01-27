import { BOOKMARK } from '@/db/constants';
import { DEVELOPMENT } from '@/db/constants';
import crossImport from 'cross-import';

//@ts-ignore
import clientPromise from '@/db/clientPromise';

export async function POST(request) {
  //@ts-ignore
  const client = await clientPromise;
  const db = client.db(DEVELOPMENT);
  const collection = db.collection(BOOKMARK);
  const res = await request.json();
  const { url, collection_id = '', user_id = '', tags } = res;

  if (!url) {
    return Response.json(
      { error: 'URL not provided', status: 400 },
      {
        status: 400,
      }
    );
  }

  if (!user_id) {
    return Response.json(
      { error: 'User ID not provided', status: 400 },
      {
        status: 400,
      }
    );
  }

  const exists = await collection.findOne({
    url,
    user_id,
    collection_id,
  });

  if (exists) {
    return Response.json(
      { error: 'Bookmark already exists', status: 500 },
      {
        status: 500,
      }
    );
  }

  try {
    const getMetaData = crossImport('metadata-scraper');
    const metadata = await getMetaData(url);

    const result = await collection.insertOne({
      ...metadata,
      url,
      favourite: false,
      collection_id,
      user_id,
      tags,
      created_at: new Date().getTime(),
    });

    return Response.json({ result, status: 200 }, { status: 200 });
  } catch (err) {
    return Response.json(
      { error: err, status: 500 },
      {
        status: 500,
      }
    );
  }
}
