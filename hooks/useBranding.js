import { useSelector } from "react-redux";
import { selectActiveBranding } from "@/store/brandingSlice";

/**
 * Converts a hex color string (3 or 6 digit, with or without #)
 * to an rgba() string with the given opacity.
 * Returns the fallback rgba if the hex is invalid.
 */
function hexToRgba(hex, opacity, fallback = "rgba(34,197,94,1)") {
  if (!hex) return fallback;

  // Remove leading #
  let clean = hex.replace(/^#/, "");

  // Expand shorthand (#abc → #aabbcc)
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (clean.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(clean)) {
    console.warn(`[useBranding] Invalid hex color: "${hex}" — using fallback`);
    return fallback;
  }

  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  return `rgba(${r},${g},${b},${opacity})`;
}

export default function useBranding() {
  const b = useSelector(selectActiveBranding);
  const isPremium = b?.isPremium ?? false;
  const primaryColor = b?.primaryColor || "#22c55e";

  return {
    branding: b,
    primary: primaryColor,
    bgColor: b?.secondaryColor || "#0A192F",
    accent: b?.accentColor || "#ffffff",
    brandName: b?.brandName || "Khizar Overseas",
    tagline: b?.tagline || "",
    logo: b?.logo || "",
    favicon: b?.favicon || "",
    footerText: b?.footerText || "Powered by Khizar Overseas",
    isPremium,
    brandingEnabled: b?.brandingEnabled ?? true,
    removeKhizarBranding: b?.removeKhizarBranding ?? false,
    customEmailBranding: b?.customEmailBranding ?? false,
    primaryAlpha: (opacity = 0.1) => hexToRgba(primaryColor, opacity),
  };
}
