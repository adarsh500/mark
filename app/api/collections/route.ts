import { COLLECTION } from './../../../db/constants';
//@ts-ignore
import clientPromise from '@/db/clientPromise';
import { DEVELOPMENT } from '@/db/constants';

export async function POST(request: Request) {
  //@ts-ignore
  const client = await clientPromise;
  const db = client.db(DEVELOPMENT);
  const collection = db.collection(COLLECTION);

  const { user_id, collection_name, parent_id = '' } = await request.json();
  console.log(user_id, collection_name, parent_id);

  const exist = await collection.findOne({
    user_id,
    collection_name,
  });

  const restricted = [
    'All',
    'all',
    'favourites',
    'Favourites',
    'Favourite',
    'favourite',
  ];

  if (exist || restricted.includes(collection_name)) {
    return Response.json(
      { message: 'Collection with name already exists', status: 400 },
      {
        status: 400,
      }
    );
  }

  const result = await collection.insertOne({
    user_id,
    collection_name,
    parent_id,
  });

  console.log(result);

  return Response.json(result, {
    status: 200,
  });
}
