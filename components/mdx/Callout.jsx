export default function Callout({ type = "info", children }) {
  const styles = {
    tip: "border-l-4 border-green-500 bg-green-50 text-green-900",
    warning: "border-l-4 border-orange-500 bg-orange-50 text-orange-900",
    info: "border-l-4 border-blue-500 bg-blue-50 text-blue-900",
  };

  return (
    <div className={`p-5 my-6 rounded-xl ${styles[type]}`}>{children}</div>
  );
}
