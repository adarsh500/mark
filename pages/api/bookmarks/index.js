import clientPromise from 'lib/clientPromise';
import { ObjectId } from 'mongodb';
const getMetaData = require('metadata-scraper');

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('test');
  if (req.method === 'GET') {
    const { email, page = 0, limit = 28, collection, query } = req.query;
    // console.log(email, collection, query);
    const [key, value] = query?.split(':') ?? [null, null];

    let findObj = { email };
    let aggregateObj = [];
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
            { $match: { email: email, favourite: true } },
          ];
          break;
        case 'url':
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
            { $match: { email: email } },
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
            { $match: { email: email } },
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
            { $match: { email: email } },
          ];
          break;
      }
    }

    if (collection == '/favourites') {
      aggregateObj = [
        ...aggregateObj,
        { $match: { email: email, favourite: true } },
      ];
    } else if (collection) {
      aggregateObj = [
        ...aggregateObj,
        { $match: { email: email, collection: collection.slice(1) } },
      ];
    }

    if (collection === '/favourites') {
      if (isAggregate) {
        const bookmark = await db
          .collection('bookmarks')
          .aggregate(aggregateObj)
          .skip(limit * page)
          .limit(parseInt(limit))
          .toArray();

        res.status(200).json({ ...bookmark, currentPage: page });
        return;
      }
      const bookmark = await db
        .collection('bookmarks')
        .find({
          ...findObj,
          favourite: true,
        })
        .skip(limit * page)
        .limit(parseInt(limit))
        .toArray();
      res.status(200).json({ ...bookmark, currentPage: page });
      return;
    } else if (collection) {
      if (isAggregate) {
        const bookmark = await db
          .collection('bookmarks')
          .aggregate(aggregateObj)
          .skip(limit * page)
          .limit(parseInt(limit))
          .toArray();
        res.status(200).json({ ...bookmark, currentPage: page });
        return;
      }
      const bookmark = await db
        .collection('bookmarks')
        .find({
          ...findObj,
          collection: collection.slice(1),
        })
        .skip(limit * page)
        .limit(parseInt(limit))
        .toArray();
      res.status(200).json({ ...bookmark, currentPage: page });
      return;
    } else {
      if (isAggregate) {
        const bookmark = await db
          .collection('bookmarks')
          .aggregate(aggregateObj)
          .skip(limit * page)
          .limit(parseInt(limit))
          .toArray();
        res.status(200).json({ ...bookmark, currentPage: page });
        return;
      }
      const bookmark = await db
        .collection('bookmarks')
        .find(findObj)
        .skip(limit * page)
        .limit(parseInt(limit))
        .toArray();
      res.status(200).json({ ...bookmark, currentPage: page });
      return;
    }
  } else if (req.method === 'POST') {
    const body = Object.create(req.body);
    const { url } = body;

    const metaData = await getMetaData(url);

    body.title = metaData.title;
    body.image = metaData.image;
    body.description = metaData.description;
    body.section = metaData.section;
    body.date = new Date().toLocaleDateString();

    const bookmark = await db.collection('bookmarks').insertOne(body);
    res.status(200).json(bookmark);
  } else if (req.method === 'DELETE') {
    const operation = await db
      .collection('bookmark')
      .deleteOne({ _id: new ObjectId(req.query.id) });
    res.status(200).json(operation);
  }
}
