import cheerio from 'cheerio';
import crossImport from 'cross-import';
import { readFile, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

const parseBookmarks: any = async (html) => {
  const $ = cheerio.load(html);
  const bookmarks: Array<Promise<any>> = [];

  // Iterate through bookmark elements
  $('a').map((_, element) => {
    const title = $(element).text();
    const url = $(element).attr('href');
    const folder = $(element).parents('dl').prev('h3').text();
    console.log('url', url);

    // const metadata = await fetch(
    //   `https://mark3.vercel.app/api/bookmark/meta?url=${url}`
    // ).then((res) => res.json());

    const getMetaData = crossImport('metadata-scraper');

    try {
      const gg = getMetaData(url);
      // console.log('try', gg);
      bookmarks.push(gg);
    } catch (err) {}
  });
  return bookmarks;
};

const groupBookmarksByFolder = (bookmarks) => {
  const groupedBookmarks = {};

  bookmarks.forEach((bookmark) => {
    const folder = bookmark.collection_name || 'Root';

    if (!groupedBookmarks[folder]) {
      groupedBookmarks[folder] = [];
    }

    groupedBookmarks[folder].push({
      title: bookmark.title,
      url: bookmark.url,
    });
  });

  return groupedBookmarks;
};

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const path = `/tmp/${file.name}`;
  await writeFile(path, buffer);

  console.log(`open ${path} to see the uploaded file`);
  //read the file and print contents out
  const contents = await readFile(path);
  const htmlContent = contents.toString();
  const bookmarks = await parseBookmarks(htmlContent);
  console.log('bk', bookmarks.length);
  Promise.allSettled(bookmarks)
    .then((res) => console.log('res', res, '\n\n'))
    .catch(() => console.log('shite'));
  const resolvedBookmarks = await Promise.allSettled(bookmarks);
  console.log('resov')
  // const groupedBookmarks = await groupBookmarksByFolder(bookmarks);

  // console.log('\n\n', 'bk', bookmarks, '\n\n');

  return NextResponse.json({ success: true });
}
