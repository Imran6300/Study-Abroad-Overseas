export default function FloatingCard({ position, strong, text }) {
  return (
    <div
      className={`
        absolute px-[1rem] py-[1.6rem]
        bg-white rounded-[18px]
        shadow-[0_12px_32px_rgba(0,0,0,0.12)]
        flex flex-col font-semibold
        border border-[rgba(65,105,225,0.25)]
        animate-cardIntro
        max-[1200px]:hidden
        ${position}
      `}
    >
      <strong
        className="
          text-[1.4rem]
          bg-clip-text text-transparent
          bg-gradient-to-r from-[#32cd32] to-[#4169e1]
        "
      >
        {strong}
      </strong>

      <span className="text-[#333]">{text}</span>
    </div>
  );
}
