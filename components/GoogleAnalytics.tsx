"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GoogleAnalytics() {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const gtag = (window as any).gtag;

        if (!gtag) return;

        gtag("config", "G-1W7JC83PF0", {
            page_path: pathname,
        });
    }, [pathname]);

    return null;
}