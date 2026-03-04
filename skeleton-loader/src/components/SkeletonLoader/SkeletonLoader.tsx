import React from "react";

export interface SkeletonLoaderProps {
  id?: string;
  variant?: "text" | "circular" | "rectangular";
  textLineCount?: number;
  width?: string;
  height?: string;
  circleSize?: string;
  showCircle?: boolean;
  showRectangle?: boolean;
  showTextLines?: boolean;
  enableAnimation?: boolean;
}

export default function SkeletonLoader({
  id,
  variant = "text",
  textLineCount = 3,
  width = "100%",
  height = "200px",
  circleSize = "64px",
  showCircle,
  showRectangle,
  showTextLines,
  enableAnimation = true,
}: SkeletonLoaderProps) {
  const clampedLineCount = Math.max(1, Math.min(6, textLineCount));
  
  const lineWidths = ["100%", "95%", "90%", "85%", "92%", "88%"];
  
  const shouldShowCircle = showCircle !== undefined ? showCircle : variant === "circular";
  const shouldShowRectangle = showRectangle !== undefined ? showRectangle : variant === "rectangular";
  const shouldShowTextLines = showTextLines !== undefined ? showTextLines : variant === "text";

  return (
    <div
      id={id}
      className={`wf-skeletonloader ${enableAnimation ? "wf-skeletonloader-animated" : ""}`}
      style={
        {
          "--wf-skeletonloader-width": width,
          "--wf-skeletonloader-height": height,
          "--wf-skeletonloader-circle-size": circleSize,
        } as React.CSSProperties
      }
    >
      {shouldShowCircle && (
        <div className="wf-skeletonloader-circle" aria-hidden="true"></div>
      )}
      
      {shouldShowRectangle && (
        <div className="wf-skeletonloader-rectangle" aria-hidden="true"></div>
      )}
      
      {shouldShowTextLines && (
        <div className="wf-skeletonloader-text-container">
          {Array.from({ length: clampedLineCount }).map((_, index) => (
            <div
              key={index}
              className="wf-skeletonloader-text-line"
              style={
                {
                  "--wf-skeletonloader-line-width": lineWidths[index % lineWidths.length],
                } as React.CSSProperties
              }
              aria-hidden="true"
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}