import clientPromise from '@/db/clientPromise';
import { BOOKMARK, DEVELOPMENT } from '@/db/constants';
import type { NextApiRequest, NextApiResponse } from 'next';

type SortType = 'created_at' | 'updated_at' | 'title';
type OrderType = 'asc' | 'desc';

type SearchQuery = {
  id: string;
  page?: string;
  limit?: string;
  collection_id?: string;
  query?: string;
  favourite?: string;
  sort_by?: SortType;
  order?: OrderType;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db(DEVELOPMENT);
  const collection = db.collection(BOOKMARK);

  if (req.method === 'GET') {
    const {
      id,
      page = '0',
      limit = '28',
      collection_id = '',
      query = '',
      favourite,
      sort_by = 'created_at',
      order = 'desc',
    }: Partial<SearchQuery> = req.query;

    let [key, value] = query?.trim()?.split(':') || [query, query];
    let findObj: any = { user_id: id };
    let aggregateObj: any = [];
    let isAggregate = false;

    const aggregateQuery = [
      {
        $search: {
          index: 'Bookmark',
          text: {
            query: value,
            path: {
              wildcard: '*',
            },
          },
        },
      },
      { $match: { user_id: id } },
    ];

    if (!!key && !!value) {
      switch (key) {
        case 'tag':
          findObj = { ...findObj, tags: { $in: [value] } };
          break;

        case 'raw':
        default:
          isAggregate = true;
          aggregateObj = aggregateQuery;
          break;
      }
    }

    if (favourite === 'true') {
      findObj = { ...findObj, favourite: true };
    } else if (collection_id) {
      isAggregate = true;
      aggregateObj = [
        ...aggregateObj,
        { $match: { user_id: id, collection_id: collection_id } },
      ];
    }

    if (isAggregate) {
      const bookmark = await collection
        .aggregate(aggregateObj)
        .sort({ [sort_by]: order === 'asc' ? 1 : -1 })
        .skip(parseInt(limit) * parseInt(page))
        .limit(parseInt(limit))
        .toArray();

      res.status(200).json({ ...bookmark, currentPage: page });
      return;
    }

    const bookmark = await collection
      .find({
        ...findObj,
      })
      .sort({ [sort_by]: order === 'asc' ? 1 : -1 })
      .skip(parseInt(limit) * parseInt(page))
      .limit(parseInt(limit))
      .toArray();

    res.status(200).json({ ...bookmark, currentPage: page });
    return;
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
