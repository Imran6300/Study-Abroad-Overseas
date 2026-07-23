// P3, item #18 (Organic Growth Audit): llms.txt at the domain root.
//
// llms.txt is an emerging, non-standardized convention (not an official
// web standard, no formal spec authority) for giving AI crawlers/agents
// a plain-text, high-signal summary of a site: what it is and where the
// key pages live — the content-oriented analog to robots.txt's
// crawl-directive role. Audit impact rating: Low-Medium (uncertain),
// Effort: S. Follows the same Next.js metadata-route pattern already
// used for app/robots.js.
//
// Served at /llms.txt via this route handler (Next.js App Router
// convention: a folder named after the path + route.js).

const BASE_URL = "https://www.khizaroverseas.in";

function buildLlmsTxt() {
  return `# Khizar Overseas

> Khizar Overseas is a study-abroad platform helping students research,
> compare, and apply to universities and courses across multiple
> countries — covering country guides, university profiles, course
> listings, visa guidance, university rankings, cost-of-living
> estimates, and scholarship information, alongside counseling and
> application services.

## Countries

- [Study destinations](${BASE_URL}/all-countries): Country-by-country guides covering visa requirements, cost of living, and top universities.

## Universities & Courses

- [University directory](${BASE_URL}/programs/universities): Searchable university profiles with rankings, tuition, and acceptance rates.
- [University rankings by country](${BASE_URL}/programs/universities/rankings): QS-ranking-based lists filtered per country.
- [Courses](${BASE_URL}/courses): Course listings across disciplines and universities.

## Planning tools

- [Visa guidance by country](${BASE_URL}/programs/visa-guidance): Eligibility requirements and visa success rates per destination.
- [Cost-of-living calculator](${BASE_URL}/programs/cost-of-living): Interactive budget-tier estimates (budget/mid/comfortable) for 25 study-abroad destinations.
- [Scholarships](${BASE_URL}/programs/scholarships): Scholarship information for prospective students.

## Services

- [Our services](${BASE_URL}/services): Profile evaluation, SOP/LOR support, university shortlisting, visa assistance, finance guidance, and pre-departure support.
- [Success stories](${BASE_URL}/success-stories): Outcomes from past students.

## About

- [Why us](${BASE_URL}/why-us): What differentiates Khizar Overseas as a study-abroad counseling service.
- [Contact](${BASE_URL}/contact): Get in touch with a counselor.

## Blog

- [Blog](${BASE_URL}/blog): Articles on study-abroad topics, application tips, and destination guides.
`;
}

export async function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Same cadence as other largely-static SEO surfaces on this site
      // (see next.config.ts revalidate values for /programs/* pages).
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}