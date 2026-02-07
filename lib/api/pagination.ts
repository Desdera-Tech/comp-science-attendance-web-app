export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(Number(searchParams.get("page") ?? 0), 0);
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 100);

  const skip = page * limit;

  return { page, limit, skip };
}
