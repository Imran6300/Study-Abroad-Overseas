export default function FloatingOrb({ type }) {
  const base =
    "absolute rounded-full blur-[120px] opacity-[0.35] animate-float";

  const styles = {
    blue: "w-[650px] h-[650px] bg-[#4169e1] top-[-10%] left-[-10%]",
    green: "w-[750px] h-[750px] bg-[#32cd32] bottom-[-20%] right-[-12%]",
    mixed:
      "w-[500px] h-[500px] bg-[linear-gradient(135deg,#4169e1,#32cd32)] top-[40%] left-[50%]",
  };

  return <div className={`${base} ${styles[type]}`}></div>;
}
