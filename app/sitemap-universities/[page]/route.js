export async function GET() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities?page=1`,
  );

  const data = await res.json();

  return Response.json({
    firstUniversity: data.universities[0],
  });
}
