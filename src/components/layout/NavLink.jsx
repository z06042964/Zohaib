import { Link } from "react-router-dom";

export default function NavLink({ href, label, isRoute, className, onClick }) {
  if (isRoute) {
    return (
      <Link to={href} className={className} onClick={onClick}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} className={className} onClick={onClick}>
      {label}
    </a>
  );
}
