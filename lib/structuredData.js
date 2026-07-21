// lib/structuredData.js
//
// FIX (Organic Growth Audit, Section 9/12, item #4): shared ItemList
// JSON-LD builder for hub/listing pages (/programs/universities, /courses,
// /all-countries, /blog). Previously each page either duplicated its own
// inline ItemList object (programs/universities) or had no ItemList schema
// at all (/courses, /all-countries, /blog).
//
// This mirrors config/controllers/seo/structuredData.js::buildItemListJsonLd
// on the backend. It's duplicated rather than imported because this is a
// separate Next.js deployment from the Express API — the two are kept in
// sync by convention, not by a shared package. If you ever pull shared code
// into a monorepo package, this is the first pair to merge.
//
// `items` should already be the page's current slice of results (e.g. one
// paginated page of universities) — this only shapes a list into JSON-LD,
// it doesn't fetch or paginate anything itself.
export function buildItemListJsonLd(
  items,
  { name, description, url, toListItem },
) {
  const listItemFn =
    toListItem ||
    ((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name || item.title,
      url: item.url,
    }));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    url,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => listItemFn(item, index)),
  };
}
