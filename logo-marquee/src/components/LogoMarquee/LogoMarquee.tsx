import { useEffect, useRef } from "react";
import type { PropValues, PropType } from "@webflow/data-types";

export interface LogoMarqueeProps {
  id?: string;
  heading?: React.ReactNode;
  showHeading?: boolean;
  direction?: "left" | "right";
  speed?: number;
  pauseOnHover?: boolean;
  grayscale?: boolean;
  fadeEdges?: boolean;
  logoHeight?: number;
  logoGap?: number;
  ariaLabel?: string;
  logo1?: PropValues[PropType.Image];
  logo1Link?: PropValues[PropType.Link];
  logo1Visible?: boolean;
  logo2?: PropValues[PropType.Image];
  logo2Link?: PropValues[PropType.Link];
  logo2Visible?: boolean;
  logo3?: PropValues[PropType.Image];
  logo3Link?: PropValues[PropType.Link];
  logo3Visible?: boolean;
  logo4?: PropValues[PropType.Image];
  logo4Link?: PropValues[PropType.Link];
  logo4Visible?: boolean;
  logo5?: PropValues[PropType.Image];
  logo5Link?: PropValues[PropType.Link];
  logo5Visible?: boolean;
  logo6?: PropValues[PropType.Image];
  logo6Link?: PropValues[PropType.Link];
  logo6Visible?: boolean;
  logo7?: PropValues[PropType.Image];
  logo7Link?: PropValues[PropType.Link];
  logo7Visible?: boolean;
  logo8?: PropValues[PropType.Image];
  logo8Link?: PropValues[PropType.Link];
  logo8Visible?: boolean;
  logo9?: PropValues[PropType.Image];
  logo9Link?: PropValues[PropType.Link];
  logo9Visible?: boolean;
  logo10?: PropValues[PropType.Image];
  logo10Link?: PropValues[PropType.Link];
  logo10Visible?: boolean;
  logo11?: PropValues[PropType.Image];
  logo11Link?: PropValues[PropType.Link];
  logo11Visible?: boolean;
  logo12?: PropValues[PropType.Image];
  logo12Link?: PropValues[PropType.Link];
  logo12Visible?: boolean;
}

interface Logo {
  image?: PropValues[PropType.Image];
  link?: PropValues[PropType.Link];
  visible?: boolean;
}

export default function LogoMarquee({
  id,
  heading,
  showHeading = true,
  direction = "left",
  speed = 40,
  pauseOnHover = true,
  grayscale = true,
  fadeEdges = true,
  logoHeight = 40,
  logoGap = 64,
  ariaLabel = "Partner and customer logos",
  logo1,
  logo1Link,
  logo1Visible = true,
  logo2,
  logo2Link,
  logo2Visible = true,
  logo3,
  logo3Link,
  logo3Visible = true,
  logo4,
  logo4Link,
  logo4Visible = true,
  logo5,
  logo5Link,
  logo5Visible = true,
  logo6,
  logo6Link,
  logo6Visible = true,
  logo7,
  logo7Link,
  logo7Visible = true,
  logo8,
  logo8Link,
  logo8Visible = true,
  logo9,
  logo9Link,
  logo9Visible = true,
  logo10,
  logo10Link,
  logo10Visible = true,
  logo11,
  logo11Link,
  logo11Visible = true,
  logo12,
  logo12Link,
  logo12Visible = true,
}: LogoMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const logos: Logo[] = [
    { image: logo1, link: logo1Link, visible: logo1Visible },
    { image: logo2, link: logo2Link, visible: logo2Visible },
    { image: logo3, link: logo3Link, visible: logo3Visible },
    { image: logo4, link: logo4Link, visible: logo4Visible },
    { image: logo5, link: logo5Link, visible: logo5Visible },
    { image: logo6, link: logo6Link, visible: logo6Visible },
    { image: logo7, link: logo7Link, visible: logo7Visible },
    { image: logo8, link: logo8Link, visible: logo8Visible },
    { image: logo9, link: logo9Link, visible: logo9Visible },
    { image: logo10, link: logo10Link, visible: logo10Visible },
    { image: logo11, link: logo11Link, visible: logo11Visible },
    { image: logo12, link: logo12Link, visible: logo12Visible },
  ];

  const visibleLogos = logos.filter((logo) => logo.visible && logo.image?.src);

  useEffect(() => {
    if (!trackRef.current) return;

    const keyframeName = `wf-logomarquee-scroll-${direction}`;
    const styleId = `wf-logomarquee-keyframes-${id || "default"}`;

    let existingStyle = document.getElementById(styleId) as HTMLStyleElement;
    if (!existingStyle) {
      existingStyle = document.createElement("style");
      existingStyle.id = styleId;
      document.head.appendChild(existingStyle);
    }

    const translateStart = direction === "left" ? "0%" : "-100%";
    const translateEnd = direction === "left" ? "-100%" : "0%";

    existingStyle.textContent = `
      @keyframes ${keyframeName} {
        from { transform: translateX(${translateStart}); }
        to { transform: translateX(${translateEnd}); }
      }
      @media (prefers-reduced-motion: reduce) {
        .wf-logomarquee-track { animation: none !important; }
      }
    `;

    trackRef.current.style.animationName = keyframeName;
    trackRef.current.style.animationDuration = `${speed}s`;

    return () => {
      if (existingStyle && existingStyle.parentNode) {
        existingStyle.parentNode.removeChild(existingStyle);
      }
    };
  }, [direction, speed, id]);

  const renderLogo = (logo: Logo, index: number) => {
    if (!logo.image?.src) return null;

    const img = (
      <img
        src={logo.image.src}
        alt={logo.image.alt || ""}
        className="wf-logomarquee-logo-image"
      />
    );

    if (logo.link?.href) {
      return (
        <a
          key={index}
          href={logo.link.href}
          target={logo.link.target}
          className="wf-logomarquee-logo-link"
          rel={logo.link.target === "_blank" ? "noopener noreferrer" : undefined}
        >
          {img}
        </a>
      );
    }

    return (
      <div key={index} className="wf-logomarquee-logo">
        {img}
      </div>
    );
  };

  const rootClasses = [
    "wf-logomarquee",
    pauseOnHover && "wf-logomarquee--pause-on-hover",
    grayscale && "wf-logomarquee--grayscale",
    fadeEdges && "wf-logomarquee--fade-edges",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      id={id}
      className={rootClasses}
      style={
        {
          "--wf-logomarquee-logo-height": `${logoHeight}px`,
          "--wf-logomarquee-logo-gap": `${logoGap}px`,
        } as React.CSSProperties
      }
    >
      {showHeading && heading && (
        <div className="wf-logomarquee-heading">{heading}</div>
      )}
      <div className="wf-logomarquee-container" aria-label={ariaLabel}>
        <div ref={trackRef} className="wf-logomarquee-track">
          <div className="wf-logomarquee-group">
            {visibleLogos.map((logo, index) => renderLogo(logo, index))}
          </div>
          <div className="wf-logomarquee-group" aria-hidden="true">
            {visibleLogos.map((logo, index) => renderLogo(logo, index + visibleLogos.length))}
          </div>
        </div>
      </div>
    </div>
  );
}