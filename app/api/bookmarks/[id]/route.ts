import { NextRequest } from 'next/server';
import { BOOKMARK } from '@/db/constants';
//@ts-ignore
import clientPromise from '@/db/clientPromise';
import { DEVELOPMENT } from '@/db/constants';

export async function GET(request: NextRequest, context: { params: any }) {
  //@ts-ignore
  const client = await clientPromise;
  const db = client.db(DEVELOPMENT);
  const collection = db.collection(BOOKMARK);
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') || 0;
  const limit = searchParams.get('limit') || 28;
  const collection_id = searchParams.get('collection_id') || '';

  const { id: user_id } = context.params;

  console.log(user_id, page, limit, collection_id);

  const collections = await collection.find({ user_id }).toArray();

  if (!collections) {
    return Response.json([], {
      status: 200,
    });
  }

  return new Response('Hello, world!');
}

export async function POST(request: NextRequest) {}
