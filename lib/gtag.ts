// Never hardcode tracking IDs — read from env instead
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

/* PAGE VIEW */
export const pageview = (url: string): void => {
  if (!GA_MEASUREMENT_ID) return; // silently skip if not configured
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

/* CUSTOM EVENTS */
type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value?: number;
};

export const event = ({ action, category, label, value }: GTagEvent): void => {
  if (!GA_MEASUREMENT_ID) return;
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};