import { useState } from "react";

export interface BadgeProps {
  id?: string;
  label?: string;
  variant?: "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  showCloseButton?: boolean;
  closeButtonAriaLabel?: string;
}

export default function Badge({
  id,
  label = "Badge",
  variant = "info",
  size = "md",
  showCloseButton = false,
  closeButtonAriaLabel = "Remove badge",
}: BadgeProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <span
      id={id}
      className={`wf-badge wf-badge-${variant} wf-badge-${size}`}
    >
      <span className="wf-badge-label">{label}</span>
      {showCloseButton && (
        <button
          type="button"
          className="wf-badge-close"
          onClick={handleClose}
          aria-label={closeButtonAriaLabel}
        >
          <svg
            className="wf-badge-close-icon"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M9 3L3 9M3 3L9 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
}