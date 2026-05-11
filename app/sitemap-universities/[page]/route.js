export async function GET(req, context) {
  const { page } = await context.params;

  return Response.json({
    success: true,
    page,
  });
}
