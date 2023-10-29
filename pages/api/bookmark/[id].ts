import clientPromise from '@/db/clientPromise';
import { BOOKMARK, DEVELOPMENT } from '@/db/constants';
import type { NextApiRequest, NextApiResponse } from 'next';

type SearchQuery = {
  id: string;
  page?: string;
  limit?: string;
  collection_id?: string;
  query?: string;
  favourite?: string;
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
    }: Partial<SearchQuery> = req.query;

    const [key, value] = query?.split(':') ?? [null, null];

    let findObj: any = { user_id: id };
    let aggregateObj: any = [];
    let isAggregate = false;

    if (!!key && !!value) {
      switch (key) {
        case 'fav':
          findObj = { ...findObj, favourite: true };
          isAggregate = true;
          aggregateObj = [
            {
              $search: {
                index: 'bookmarks',
                text: {
                  query: value,
                  path: {
                    wildcard: '*',
                  },
                },
              },
            },
            { $match: { user_id: id, favourite: true } },
          ];
          break;

        case 'tag':
          findObj = { ...findObj, tags: { $in: [value] } };
          break;
        case 'raw':
          isAggregate = true;
          aggregateObj = [
            {
              $search: {
                index: 'bookmarks',
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
          break;

        default:
          isAggregate = true;
          aggregateObj = [
            {
              $search: {
                index: 'bookmarks',
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
          break;
      }
    }

    if (favourite === 'true') {
      aggregateObj = [
        ...aggregateObj,
        { $match: { user_id: id, favourite: true } },
      ];
    } else if (collection_id) {
      aggregateObj = [
        ...aggregateObj,
        { $match: { user_id: id, collection_id: collection_id } },
      ];
    }

    if (favourite === 'true') {
      if (isAggregate) {
        const bookmark = await collection
          .aggregate(aggregateObj)
          .skip(parseInt(limit) * parseInt(page))
          .limit(parseInt(limit))
          .toArray();

        res.status(200).json({ ...bookmark, currentPage: page });
        return;
      }
      const bookmark = await collection
        .find({
          ...findObj,
          favourite: true,
        })
        .skip(parseInt(limit) * parseInt(page))
        .limit(parseInt(limit))
        .toArray();
      res.status(200).json({ ...bookmark, currentPage: page });
      return;
    } else if (collection_id) {
      if (isAggregate) {
        const bookmark = await collection
          .aggregate(aggregateObj)
          .skip(parseInt(limit) * parseInt(page))
          .limit(parseInt(limit))
          .toArray();
        res.status(200).json({ ...bookmark, currentPage: page });
        return;
      }
      const bookmark = await collection
        .find({
          ...findObj,
          collection_id,
        })
        .skip(parseInt(limit) * parseInt(page))
        .limit(parseInt(limit))
        .toArray();
      res.status(200).json({ ...bookmark, currentPage: page });
      return;
    } else {
      if (isAggregate) {
        const bookmark = await collection
          .aggregate(aggregateObj)
          .skip(parseInt(limit) * parseInt(page))
          .limit(parseInt(limit))
          .toArray();
        res.status(200).json({ ...bookmark, currentPage: page });
        return;
      }
      const bookmark = await collection
        .find(findObj)
        .skip(parseInt(limit) * parseInt(page))
        .limit(parseInt(limit))
        .toArray();

      res.status(200).json({ ...bookmark, currentPage: page });
      return;
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
