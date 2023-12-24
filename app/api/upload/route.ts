import { writeFile, readFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import cheerio from 'cheerio';

const parseBookmarks = (html) => {
  const $ = cheerio.load(html);
  const bookmarks: any = [];

  // Iterate through bookmark elements
  $('a').each((_, element) => {
    const title = $(element).text();
    const url = $(element).attr('href');
    const folder = $(element).parents('dl').prev('h3').text();

    bookmarks.push({
      title,
      url,
      folder,
    });
  });

  return bookmarks;
};

const groupBookmarksByFolder = (bookmarks) => {
  const groupedBookmarks = {};

  bookmarks.forEach((bookmark) => {
    const folder = bookmark.folder || 'Root';

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
  console.log('buf', buffer);
  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const path = `/tmp/${file.name}`;
  await writeFile(path, buffer);

  console.log(`open ${path} to see the uploaded file`);
  //read the file and print contents out
  const contents = await readFile(path);
  const htmlContent = contents.toString();
  console.log('htmlContent', htmlContent);
  const bookmarks = parseBookmarks(htmlContent);
  const groupedBookmarks = groupBookmarksByFolder(bookmarks);

  console.log('\n\n', 'bk', bookmarks, '\n\n', groupedBookmarks);

  return NextResponse.json({ success: true });
}
