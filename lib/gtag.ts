export const GA_MEASUREMENT_ID = "G-1W7JC83PF0";

/* PAGE VIEW */
export const pageview = (url: string) => {
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

/* CUSTOM EVENTS */
type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value?: number;
};

export const event = ({
  action,
  category,
  label,
  value,
}: GTagEvent) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};