import { COLLECTION } from './../../../db/constants';
//@ts-ignore
import clientPromise from '@/db/clientPromise';
import { DEVELOPMENT } from '@/db/constants';
import { ObjectId } from 'mongodb';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
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
  let parentExists = true;

  if (parent_id !== '') {
    parentExists = await collection.findOne({
      _id: new ObjectId(parent_id),
    });
  }

  if (!parentExists) {
    return Response.json(
      { message: 'Parent collection does not exist', status: 400 },
      {
        status: 400,
      }
    );
  }

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
    children: [],
  });

  console.log(result);

  return Response.json(result, {
    status: 200,
  });
}

export async function DELETE(request: NextRequest) {
  //@ts-ignore
  const client = await clientPromise;
  const db = client.db(DEVELOPMENT);
  const collection = db.collection(COLLECTION);
  const { id, user_id } = await request.json();

  const collections = await collection.find({ user_id }).toArray();

  const child = [...findChildren(collections, id), new ObjectId(id)];

  const result = await collection.deleteMany({
    _id: { $in: child },
  });

  return Response.json(result, {
    status: 200,
  });
}

const findChildren: any = (arr: Array<any>, id: string) => {
  let children: any[] = [];
  arr.filter((item) => {
    if (item.parent_id == id) {
      children.push(item._id);
      const child = findChildren(arr, item._id);
      children = [...children, ...child];
    }
  });
  return children;
};
