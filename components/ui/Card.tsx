interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, className = "", onClick, hover = false }: CardProps) {
  const hasCustomBg = className.includes("bg-");
  return (
    <div
      className={`
        ${hasCustomBg ? "" : "bg-white"} rounded-xl shadow-sm border border-ma-border p-6
        ${hover ? "cursor-pointer hover:shadow-md hover:border-ma-teal transition-all duration-200" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
    >
      {children}
    </div>
  );
}
