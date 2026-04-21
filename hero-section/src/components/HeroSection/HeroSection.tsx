import React from "react";
import type { PropValues, PropType } from "@webflow/data-types";

export interface HeroSectionProps {
  id?: string;
  layout?: "left" | "centered";
  size?: "medium" | "large" | "full";
  headline?: React.ReactNode;
  subheading?: string;
  ctaText?: string;
  ctaLink?: PropValues[PropType.Link];
  showSecondaryCta?: boolean;
  secondaryCtaText?: string;
  secondaryCtaLink?: PropValues[PropType.Link];
  showBackgroundImage?: boolean;
  backgroundImage?: PropValues[PropType.Image];
  overlayOpacity?: "none" | "light" | "medium" | "dark";
  showBadge?: boolean;
  badgeText?: string;
  contentMaxWidth?: "narrow" | "medium" | "wide";
}

const sizeMap = {
  medium: "500px",
  large: "700px",
  full: "100vh",
};

const overlayOpacityMap = {
  none: "0",
  light: "0.3",
  medium: "0.5",
  dark: "0.7",
};

const contentMaxWidthMap = {
  narrow: "600px",
  medium: "800px",
  wide: "1000px",
};

export default function HeroSection({
  id,
  layout = "centered",
  size = "large",
  headline = "Build Something Amazing",
  subheading = "Create powerful experiences that drive results and delight your customers",
  ctaText = "Get Started",
  ctaLink,
  showSecondaryCta = false,
  secondaryCtaText = "Learn More",
  secondaryCtaLink,
  showBackgroundImage = false,
  backgroundImage,
  overlayOpacity = "medium",
  showBadge = false,
  badgeText = "New Release",
  contentMaxWidth = "medium",
}: HeroSectionProps) {
  const minHeight = sizeMap[size];
  const overlayValue = overlayOpacityMap[overlayOpacity];
  const maxWidth = contentMaxWidthMap[contentMaxWidth];

  const openLink = (link?: { href?: string; target?: string }) => {
    if (!link?.href || link.href === "#") return;
    if (link.target === "_blank") {
      window.open(link.href, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = link.href;
    }
  };

  const handleCtaClick = () => openLink(ctaLink);
  const handleSecondaryCtaClick = () => openLink(secondaryCtaLink);

  return (
    <section
      id={id}
      className={`wf-herosection wf-herosection-layout-${layout} wf-herosection-size-${size}`}
      style={
        {
          "--wf-herosection-min-height": minHeight,
          "--wf-herosection-overlay-opacity": overlayValue,
          "--wf-herosection-content-max-width": maxWidth,
        } as React.CSSProperties
      }
    >
      {showBackgroundImage && backgroundImage?.src && (
        <div
          className="wf-herosection-background"
          style={{ backgroundImage: `url(${backgroundImage.src})` }}
          role={backgroundImage.alt ? "img" : undefined}
          aria-label={backgroundImage.alt || undefined}
        >
          <div className="wf-herosection-overlay" />
        </div>
      )}

      <div className="wf-herosection-container">
        <div className="wf-herosection-content">
          {showBadge && badgeText && (
            <div className="wf-herosection-badge">{badgeText}</div>
          )}

          <h2 className="wf-herosection-headline">{headline}</h2>

          {subheading && (
            <p className="wf-herosection-subheading">{subheading}</p>
          )}

          <div className="wf-herosection-cta-group">
            <button
              className="wf-herosection-cta wf-herosection-cta-primary"
              onClick={handleCtaClick}
              type="button"
            >
              {ctaText}
            </button>

            {showSecondaryCta && secondaryCtaText && (
              <button
                className="wf-herosection-cta wf-herosection-cta-secondary"
                onClick={handleSecondaryCtaClick}
                type="button"
              >
                {secondaryCtaText}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}