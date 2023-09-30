export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  return new Response('Hello, Next.js!', {
    status: 200,
  });
}

export async function POST(request: Request) {
  return new Response('Hello, Next.js!', {
    status: 200,
  });
}
