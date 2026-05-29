// "use client";

// import { CheckCircle } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function StudentProCard({
//   title = "Unlock Student Pro",
//   description = "Access AI-powered tools to improve your chances of getting into top universities.",
//   compact = false,
//   variant = "dark", // dark | light
// }) {
//   const router = useRouter();

//   const styles = {
//     dark: {
//       card: "border-blue-500/30 bg-gradient-to-br from-[#111827] to-[#0B1120] text-white shadow-lg hover:shadow-blue-500/20",
//       badge: "bg-blue-600 text-white",
//       desc: "text-gray-400",
//       feature: "text-gray-300",
//       price: "text-blue-400",
//       button: "bg-blue-600 hover:bg-blue-700 text-white",
//     },
//     light: {
//       card: "bg-white border border-gray-200 shadow-sm hover:shadow-md",
//       badge: "bg-blue-100 text-blue-600",
//       desc: "text-gray-600",
//       feature: "text-gray-700",
//       price: "text-[#2f4f4f]",
//       button: "bg-[#2f4f4f] hover:bg-[#1e2f2f] text-white",
//     },
//   };

//   const theme = styles[variant];

//   return (
//     <div
//       className={`relative overflow-hidden rounded-2xl ${theme.card} ${
//         compact ? "p-6" : "p-8"
//       } transition`}
//     >
//       {/* Glow effect only for dark */}
//       {variant === "dark" && (
//         <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 blur-3xl"></div>
//       )}

//       {/* Badge */}
//       <span
//         className={`inline-block mb-3 text-xs font-semibold px-3 py-1 rounded-full ${theme.badge}`}
//       >
//         STUDENT PRO
//       </span>

//       {/* Title */}
//       <h3 className={`${compact ? "text-lg" : "text-xl"} font-bold mb-2`}>
//         {title}
//       </h3>

//       {/* Description */}
//       <p className={`${theme.desc} mb-6 text-sm`}>{description}</p>

//       {/* Features */}
//       <ul className={`space-y-2 mb-6 text-sm ${theme.feature}`}>
//         <li className="flex items-center gap-2">
//           <CheckCircle size={16} className="text-green-500" />
//           AI university recommendations
//         </li>

//         <li className="flex items-center gap-2">
//           <CheckCircle size={16} className="text-green-500" />
//           Scholarship matching
//         </li>

//         <li className="flex items-center gap-2">
//           <CheckCircle size={16} className="text-green-500" />
//           Profile strength score
//         </li>

//         <li className="flex items-center gap-2">
//           <CheckCircle size={16} className="text-green-500" />
//           Smart deadline reminders
//         </li>
//       </ul>

//       {/* CTA */}
//       <div className="flex items-center justify-between">
//         <span className={`text-xl font-bold ${theme.price}`}>
//           ₹499<span className="text-sm text-gray-400">/month</span>
//         </span>

//         <button
//           onClick={() => router.push("/plans")}
//           className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${theme.button}`}
//         >
//           Upgrade
//         </button>
//       </div>
//     </div>
//   );
// }
