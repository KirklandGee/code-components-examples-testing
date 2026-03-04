import Badge from "./Badge";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./Badge.css";

export default declareComponent(Badge, {
  name: "Badge (Simple)",
  description: "A compact badge component that displays a label with visual styling variants for different semantic meanings. The badge supports four color variants (success, warning, error, info) that apply appropriate background and text colors. Includes an optional close button that appears on the right side when enabled. The component is inline-block by default and works well for tags, status indicators, categories, and labels. The close button includes hover states and can trigger custom actions.",
  group: "Content",
  options: {
    ssr: false,
    applyTagSelectors: true
  },
  props: {
    id: props.Id({
      name: "Element ID",
      group: "Settings",
      tooltip: "HTML ID attribute for targeting and accessibility"
    }),
    label: props.TextNode({
      name: "Label",
      defaultValue: "Badge",
      group: "Content",
      tooltip: "The text content displayed in the badge"
    }),
    showCloseButton: props.Boolean({
      name: "Show Close Button",
      defaultValue: false,
      group: "Display",
      tooltip: "Whether to display the close button on the right side"
    })
  }
});