import { useState, useRef, useEffect } from "react";

export interface TooltipHoverCardProps {
  id?: string;
  mode?: "tooltip" | "hoverCard";
  theme?: "dark" | "light";
  placement?: "top" | "bottom" | "left" | "right";
  triggerText?: string;
  tooltipText?: string;
  cardTitle?: string;
  cardDescription?: string;
  cardImage?: string;
  showCardImage?: boolean;
  hoverDelay?: number;
  showArrow?: boolean;
  autoFlip?: boolean;
  maxWidth?: number;
  ariaLabel?: string;
}

export default function TooltipHoverCard({
  id,
  mode = "tooltip",
  theme = "dark",
  placement = "top",
  triggerText = "Hover me",
  tooltipText = "This is helpful information",
  cardTitle = "More Information",
  cardDescription = "This hover card provides detailed contextual information with formatting support for better readability.",
  cardImage,
  showCardImage = true,
  hoverDelay = 200,
  showArrow = true,
  autoFlip = true,
  maxWidth = 300,
  ariaLabel = "Additional information",
}: TooltipHoverCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPlacement, setActualPlacement] = useState(placement);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const calculatePosition = () => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const gap = 8;
    const arrowSize = 6;

    let finalPlacement = placement;
    let top = 0;
    let left = 0;

    const calculateForPlacement = (p: string) => {
      let t = 0;
      let l = 0;

      switch (p) {
        case "top":
          t = triggerRect.top - contentRect.height - gap - arrowSize;
          l = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
          break;
        case "bottom":
          t = triggerRect.bottom + gap + arrowSize;
          l = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
          break;
        case "left":
          t = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
          l = triggerRect.left - contentRect.width - gap - arrowSize;
          break;
        case "right":
          t = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
          l = triggerRect.right + gap + arrowSize;
          break;
      }

      return { t, l };
    };

    const pos = calculateForPlacement(placement);
    top = pos.t;
    left = pos.l;

    if (autoFlip) {
      const wouldOverflowTop = top < 0;
      const wouldOverflowBottom = top + contentRect.height > viewportHeight;
      const wouldOverflowLeft = left < 0;
      const wouldOverflowRight = left + contentRect.width > viewportWidth;

      if (placement === "top" && wouldOverflowTop && !wouldOverflowBottom) {
        finalPlacement = "bottom";
        const newPos = calculateForPlacement("bottom");
        top = newPos.t;
        left = newPos.l;
      } else if (placement === "bottom" && wouldOverflowBottom && !wouldOverflowTop) {
        finalPlacement = "top";
        const newPos = calculateForPlacement("top");
        top = newPos.t;
        left = newPos.l;
      } else if (placement === "left" && wouldOverflowLeft && !wouldOverflowRight) {
        finalPlacement = "right";
        const newPos = calculateForPlacement("right");
        top = newPos.t;
        left = newPos.l;
      } else if (placement === "right" && wouldOverflowRight && !wouldOverflowLeft) {
        finalPlacement = "left";
        const newPos = calculateForPlacement("left");
        top = newPos.t;
        left = newPos.l;
      }
    }

    left = Math.max(gap, Math.min(left, viewportWidth - contentRect.width - gap));
    top = Math.max(gap, Math.min(top, viewportHeight - contentRect.height - gap));

    setActualPlacement(finalPlacement);
    setPosition({ top, left });

    let arrowTop = 0;
    let arrowLeft = 0;

    switch (finalPlacement) {
      case "top":
        arrowTop = contentRect.height;
        arrowLeft = triggerRect.left + triggerRect.width / 2 - left;
        break;
      case "bottom":
        arrowTop = -arrowSize * 2;
        arrowLeft = triggerRect.left + triggerRect.width / 2 - left;
        break;
      case "left":
        arrowTop = triggerRect.top + triggerRect.height / 2 - top;
        arrowLeft = contentRect.width;
        break;
      case "right":
        arrowTop = triggerRect.top + triggerRect.height / 2 - top;
        arrowLeft = -arrowSize * 2;
        break;
    }

    setArrowPosition({ top: arrowTop, left: arrowLeft });
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, hoverDelay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleFocus = () => {
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener("resize", calculatePosition);
      window.addEventListener("scroll", calculatePosition);
      return () => {
        window.removeEventListener("resize", calculatePosition);
        window.removeEventListener("scroll", calculatePosition);
      };
    }
  }, [isVisible, placement, autoFlip]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      id={id}
      className="wf-tooltiphovercard"
      style={
        {
          "--wf-tooltiphovercard-max-width": `${maxWidth}px`,
        } as React.CSSProperties
      }
    >
      <button
        ref={triggerRef}
        className="wf-tooltiphovercard-trigger"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={ariaLabel}
        aria-describedby={isVisible ? `${id}-content` : undefined}
      >
        {triggerText}
      </button>

      {isVisible && (
        <div
          ref={contentRef}
          id={`${id}-content`}
          className={`wf-tooltiphovercard-content wf-tooltiphovercard-content--${mode} wf-tooltiphovercard-content--${theme} wf-tooltiphovercard-content--${actualPlacement}`}
          style={{
            position: "fixed",
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: 9999,
          }}
          role="tooltip"
        >
          {mode === "tooltip" ? (
            <div className="wf-tooltiphovercard-tooltip">{tooltipText}</div>
          ) : (
            <div className="wf-tooltiphovercard-hovercard">
              {showCardImage && cardImage && (
                <div className="wf-tooltiphovercard-hovercard-image-wrapper">
                  <img
                    src={cardImage}
                    alt=""
                    className="wf-tooltiphovercard-hovercard-image"
                  />
                </div>
              )}
              <div className="wf-tooltiphovercard-hovercard-body">
                <h3 className="wf-tooltiphovercard-hovercard-title">
                  {cardTitle}
                </h3>
                <div
                  className="wf-tooltiphovercard-hovercard-description"
                  dangerouslySetInnerHTML={{ __html: cardDescription }}
                />
              </div>
            </div>
          )}

          {showArrow && (
            <div
              className={`wf-tooltiphovercard-arrow wf-tooltiphovercard-arrow--${actualPlacement}`}
              style={{
                position: "absolute",
                top: `${arrowPosition.top}px`,
                left: `${arrowPosition.left}px`,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}