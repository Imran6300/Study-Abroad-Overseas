import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchClient />
    </Suspense>
  );
}

function SearchLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Searching…
    </div>
  );
}
