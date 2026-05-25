import { useId } from "react";

export default function BrandMark({ className = "" }) {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="7"
          y1="6"
          x2="40"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4F46E5" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      <rect x="3" y="3" width="42" height="42" rx="14" fill={`url(#${gradientId})`} />
      <path
        d="M15 30V18.5C15 17.12 16.12 16 17.5 16H30.5C31.88 16 33 17.12 33 18.5V30"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 28L20.6 22.4C21.38 21.62 22.64 21.62 23.42 22.4L26.2 25.18L28.58 22.8C29.36 22.02 30.62 22.02 31.4 22.8L33 24.4"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31.2 12.5L32.02 15L34.5 15.8L32.02 16.62L31.2 19.1L30.38 16.62L27.9 15.8L30.38 15L31.2 12.5Z"
        fill="white"
      />
      <circle cx="22.2" cy="20.2" r="1.9" fill="white" />
    </svg>
  );
}
