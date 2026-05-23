import { User, Mail, Phone, Globe, Shield, MapPin } from "lucide-react";
import InfoRow from "../shared/InfoRow";

export default function StudentDetailsCard({ profile }) {
  const studentDetails = [
    {
      label: "Full Name",
      value: profile?.fullName || "N/A",
      icon: User,
    },
    {
      label: "Email",
      value: profile?.email || "N/A",
      icon: Mail,
    },
    {
      label: "Phone",
      value: profile?.phone || "N/A",
      icon: Phone,
    },
    {
      label: "Nationality",
      value: profile?.nationality || "N/A",
      icon: Globe,
    },
    {
      label: "Passport No.",
      value: profile?.passportNumber || "N/A",
      icon: Shield,
    },
    {
      label: "Location",
      value: profile?.preferredCountry || "N/A",
      icon: MapPin,
    },
  ];

  return (
    <div>
      <h3>Student Details</h3>

      <div className="space-y-3">
        {studentDetails.map((item) => (
          <InfoRow
            key={item.label}
            label={item.label}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
}
