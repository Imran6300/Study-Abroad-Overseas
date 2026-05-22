import { User, Mail, Phone, Globe, Shield, MapPin } from "lucide-react";
import InfoRow from "../shared/InfoRow";

export default function StudentDetailsCard({ student }) {
  const studentDetails = [
    {
      label: "Full Name",
      value: student.name,
      icon: User,
    },
    {
      label: "Email",
      value: student.email,
      icon: Mail,
    },
    {
      label: "Phone",
      value: student.phone,
      icon: Phone,
    },
    {
      label: "Nationality",
      value: student.nationality,
      icon: Globe,
    },
    {
      label: "Passport No.",
      value: student.passportNo,
      icon: Shield,
    },
    {
      label: "Location",
      value: student.currentCity,
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
