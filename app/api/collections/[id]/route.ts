import { COLLECTION, DEVELOPMENT } from '@/db/constants';
import { NextRequest } from 'next/server';
//@ts-ignore
import clientPromise from '@/db/clientPromise';

export async function GET(request: NextRequest, context: { params: any }) {
  //@ts-ignore
  const client = await clientPromise;
  const searchParams = request.nextUrl.searchParams;
  const db = client.db(DEVELOPMENT);
  const collection = db.collection(COLLECTION);
  const user_id = context.params.id; // '1'
  const type = searchParams.get('type');

  console.log('par', context.params, type);

  const collections = await collection.find({ user_id }).toArray();

  if (!collections) {
    return Response.json([], {
      status: 200,
    });
  }

  if (type === 'flat') {
    return Response.json(collections, {
      status: 200,
    });
  }

  const collectionsTree: any[] = [];
  const flattenedCollections = [...collections];
  const rootCollections = flattenedCollections?.filter(
    (coll) => coll?.parent_id == ''
  );

  rootCollections.forEach((coll) => {
    collectionsTree.push(coll);
    flattenedCollections.splice(flattenedCollections.indexOf(coll), 1);
  });

  while (flattenedCollections.length !== 0) {
    flattenedCollections.forEach((coll, i) => {
      let parent = findParent(collectionsTree, coll?.parent_id);
      if (!parent) return;
      parent.children.push(coll);
      flattenedCollections.splice(i, 1);
    });
  }

  return Response.json(collectionsTree, {
    status: 200,
  });
}

const findParent: any = (arr: Array<any>, id: string) => {
  for (var item of arr) {
    if (item._id == id) {
      return item;
    }
    var p = findParent(item?.children, id);
    if (p) {
      return p;
    }
  }
};
