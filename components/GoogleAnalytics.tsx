"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import * as gtag from "@/lib/gtag";

export default function GoogleAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const query = searchParams.toString();
        const url = query ? `${pathname}?${query}` : pathname;

        gtag.pageview(url);
    }, [pathname, searchParams]);

    return null;
}