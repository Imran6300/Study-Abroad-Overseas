import Link from "next/link";

export default function Button({ href, children, className = "" }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2 ${className}`}>
      {children}
    </Link>
  );
}
