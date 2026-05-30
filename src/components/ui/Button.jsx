import { Link } from "react-router-dom";

const variants = {
  primary:
    "bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:brightness-110",
  secondary:
    "bg-white text-slate-800 border border-slate-200 shadow-soft hover:border-brand-300 hover:text-brand-600",
  outline:
    "border-2 border-brand-600 text-brand-600 hover:bg-brand-50",
  ghost: "text-slate-600 hover:text-brand-600 hover:bg-brand-50",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  to,
  className = "",
  onClick,
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
