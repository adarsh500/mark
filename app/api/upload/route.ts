import { writeFile, readFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

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
  console.log(contents.toString());

  return NextResponse.json({ success: true });
}
