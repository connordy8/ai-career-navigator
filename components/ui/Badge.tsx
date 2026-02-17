type BadgeVariant = "teal" | "navy" | "light-blue" | "lavender" | "mint" | "error" | "success";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  teal: "bg-ma-teal/20 text-ma-navy",
  navy: "bg-ma-navy text-white",
  "light-blue": "bg-ma-light-blue text-ma-navy",
  lavender: "bg-ma-lavender text-ma-navy",
  mint: "bg-ma-mint text-ma-navy",
  error: "bg-ma-error/10 text-ma-error",
  success: "bg-ma-success/10 text-ma-success",
};

export default function Badge({ children, variant = "teal", className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
