export async function GET(req, { params }) {
  return Response.json({
    success: true,
    params,
    page: params.page,
  });
}
