import { COLLECTION, DEVELOPMENT } from '@/db/constants';
import { NextRequest } from 'next/server';
//@ts-ignore
import clientPromise from '@/db/clientPromise';
import { log } from 'console';

export async function GET(request: NextRequest, context: { params: any }) {
  //@ts-ignore
  const client = await clientPromise;
  const db = client.db(DEVELOPMENT);
  const collection = db.collection(COLLECTION);
  const user_id = context.params.id; // '1'

  const collections = await collection.find({ user_id }).toArray();

  const collectionsTree: any[] = [];
  const flattenedCollections = collections?.map((coll) => ({
    ...coll,
    children: [],
  }));
  flattenedCollections
    ?.filter((coll) => coll?.parent_id == '')
    ?.forEach((coll) => {
      collectionsTree?.push(coll);
      flattenedCollections?.splice(flattenedCollections?.indexOf(coll), 1);
    });

  while (flattenedCollections?.length !== 0) {
    flattenedCollections?.forEach((coll, i) => {
      findParent(collectionsTree, coll?.parent_id)?.children?.push(coll);
      flattenedCollections?.splice(i, 1);
    });
  }

  return Response.json(collectionsTree, {
    status: 200,
  });
}

const findParent: any = (arr: Array<any>, id: string) => {
  for (let item of arr) {
    if (item?._id == id) {
      return item;
    }
    let p = findParent(item?.children, id);
    if (p) {
      return p;
    }
  }
};
