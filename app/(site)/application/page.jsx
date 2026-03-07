import ApplicationFormClient from "./ApplicationFormClient";

export const metadata = {
  title: "Student Application Form",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/application",
  },
};

export default function Page() {
  return <ApplicationFormClient />;
}
