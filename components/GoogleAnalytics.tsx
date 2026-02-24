"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GoogleAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = pathname + searchParams.toString();

        window.gtag?.("config", "G-1W7JC83PF0", {
            page_path: url,
        });
    }, [pathname, searchParams]);

    return null;
}