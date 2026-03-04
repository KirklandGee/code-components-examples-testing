import SkeletonLoader from "./SkeletonLoader";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./SkeletonLoader.css";

export default declareComponent(SkeletonLoader, {
  name: "SkeletonLoader",
  description: "An animated placeholder component that displays shimmer-loading shapes while content loads. Supports three shape variants: text lines with varying widths, circular shapes for avatars, and rectangular blocks for images or cards. Features a subtle shimmer animation that sweeps across all visible shapes with a pulse effect. Text line count is configurable from 1-6 lines with automatic width variation for realistic appearance. All shapes can be shown or hidden independently to compose complex layouts like card skeletons with image, avatar, and text. Width and height are fully configurable for rectangular and circular shapes.",
  group: "Content",
  options: {
    ssr: true,
    applyTagSelectors: false
  },
  props: {
    id: props.Id({
      name: "Element ID",
      group: "Settings",
      tooltip: "HTML ID attribute for targeting with CSS or JavaScript"
    }),
    variant: props.Variant({
      name: "Shape Variant",
      options: ["text", "circular", "rectangular"],
      defaultValue: "text",
      group: "Style",
      tooltip: "Primary skeleton shape type to display"
    }),
    textLineCount: props.Number({
      name: "Text Line Count",
      defaultValue: 3,
      group: "Style",
      tooltip: "Number of text lines to display (1-6)"
    }),
    width: props.Text({
      name: "Width",
      defaultValue: "100%",
      group: "Style",
      tooltip: "Width of rectangular or circular shape (CSS value)"
    }),
    height: props.Text({
      name: "Height",
      defaultValue: "200px",
      group: "Style",
      tooltip: "Height of rectangular shape (CSS value)"
    }),
    circleSize: props.Text({
      name: "Circle Size",
      defaultValue: "64px",
      group: "Style",
      tooltip: "Diameter of circular shape (CSS value)"
    }),
    showCircle: props.Visibility({
      name: "Show Circle",
      group: "Display",
      tooltip: "Show or hide circular avatar placeholder"
    }),
    showRectangle: props.Visibility({
      name: "Show Rectangle",
      group: "Display",
      tooltip: "Show or hide rectangular image placeholder"
    }),
    showTextLines: props.Visibility({
      name: "Show Text Lines",
      group: "Display",
      tooltip: "Show or hide text line placeholders"
    }),
    enableAnimation: props.Boolean({
      name: "Enable Animation",
      defaultValue: true,
      group: "Behavior",
      tooltip: "Enable or disable shimmer animation"
    }),
  },
});