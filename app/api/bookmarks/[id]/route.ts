import { BOOKMARK } from '@/db/constants';
//@ts-ignore
import clientPromise from '@/db/clientPromise';
import { DEVELOPMENT } from '@/db/constants';
import { ObjectId } from 'mongodb';

export async function PUT(request, context) {
  //@ts-ignore
  const client = await clientPromise;
  const db = client.db(DEVELOPMENT);
  const collection = db.collection(BOOKMARK);
  const res = await request.json();
  const { id } = context.params;
  const { collection_id = '', user_id = '', tags, favourite } = res;

  if (!user_id) {
    return Response.json(
      { error: 'User ID not provided', status: 400 },
      {
        status: 400,
      }
    );
  }

  const exists = await collection.findOne({
    _id: new ObjectId(id),
    user_id,
  });

  if (!exists) {
    return Response.json(
      { error: 'Bookmark not found', status: 400 },
      {
        status: 400,
      }
    );
  }

  const editObj: any = {};

  if (tags) {
    editObj.tags = tags;
  }
  if (favourite == true || favourite == false) {
    editObj.favourite = favourite;
  }
  if (collection_id) {
    editObj.collection_id = collection_id;
  }

  try {
    const result = await collection.updateOne(
      {
        _id: new ObjectId(id),
        user_id,
      },
      {
        $set: editObj,
      }
    );

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

export async function DELETE(request, { params }) {
  //@ts-ignore
  const client = await clientPromise;
  const db = client.db(DEVELOPMENT);
  const collection = db.collection(BOOKMARK);
  const { id } = params;

  if (!id) {
    return Response.json(
      { error: 'ID not provided', status: 400 },
      {
        status: 400,
      }
    );
  }

  const exists = await collection.findOne({
    _id: new ObjectId(id),
  });

  if (!exists) {
    return Response.json(
      { error: 'Bookmark not found', status: 400 },
      {
        status: 400,
      }
    );
  }

  try {
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
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
