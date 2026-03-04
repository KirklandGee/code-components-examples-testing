import SkeletonLoader from "./SkeletonLoader";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./SkeletonLoader.css";

export default declareComponent(SkeletonLoader, {
  name: "SkeletonLoader (Simple)",
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
  },
});