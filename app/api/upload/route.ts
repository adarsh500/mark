import clientPromise from '@/db/clientPromise';
import { BOOKMARK, DEVELOPMENT } from '@/db/constants';
import cheerio from 'cheerio';
import crossImport from 'cross-import';
import { readFile, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

const parseBookmarks: any = async (html) => {
  const $ = cheerio.load(html);
  const bookmarks: Array<Promise<any>> = [];

  $('a').map((_, element) => {
    const title = $(element).text();
    const url = $(element).attr('href');
    const folder = $(element).parents('dl').prev('h3').text();

    const getMetaData = crossImport('metadata-scraper');

    try {
      const metadata = getMetaData(url);
      bookmarks.push(metadata);
    } catch (err) {}
  });
  return bookmarks;
};

export async function POST(request: NextRequest) {
  const client = await clientPromise;
  const db = client.db(DEVELOPMENT);
  const collection = db.collection(BOOKMARK);
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;
  const uid = data.get('uid');

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const path = `/tmp/${file.name}`;
  await writeFile(path, buffer);

  const contents = await readFile(path);
  const htmlContent = contents.toString();
  const bookmarks = await parseBookmarks(htmlContent);
  Promise.allSettled(bookmarks)
    .then((res) => {
      const filters = res.filter((r) => r.status === 'fulfilled');
      const values = filters.map((r: any) => {
        return {
          ...r.value,
          favoutite: false,
          collection_id: '',
          user_id: uid,
          tags: [],
          created_at: new Date().getTime(),
        };
      });
      console.log('res', values, '\n\n');

      try {
        collection.insertMany(values);

        return Response.json({ status: 200 }, { status: 200 });
      } catch (error) {
        return Response.json({ status: 500 }, { status: 500 });
      }
    })
    .catch(() => console.log('shite'));

  return NextResponse.json({ success: true });
}
