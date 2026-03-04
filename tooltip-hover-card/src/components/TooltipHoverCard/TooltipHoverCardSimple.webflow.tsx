import TooltipHoverCard from "./TooltipHoverCard";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./TooltipHoverCard.css";

export default declareComponent(TooltipHoverCard, {
  name: "TooltipHoverCard (Simple)",
  description: "A versatile tooltip and hover card component that displays contextual information when hovering over or focusing on a trigger element. Supports two modes: simple plain text tooltips and rich hover cards with title, description, and optional image. Features configurable placement (top, bottom, left, right) with automatic viewport edge detection and flip behavior. Includes a visual arrow pointer that dynamically adjusts to point at the trigger element. Appears after a configurable hover delay and smoothly fades in/out with CSS transitions. Fully keyboard accessible with focus state support for screen readers and keyboard navigation.",
  group: "Interactive",
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
    triggerText: props.TextNode({
      name: "Trigger Text",
      defaultValue: "Hover me",
      group: "Content",
      tooltip: "Text displayed on the trigger button"
    }),
    tooltipText: props.Text({
      name: "Tooltip Text",
      defaultValue: "This is helpful information",
      group: "Content",
      tooltip: "Plain text content shown in tooltip mode"
    }),
    cardTitle: props.Text({
      name: "Card Title",
      defaultValue: "More Information",
      group: "Hover Card",
      tooltip: "Heading text displayed at the top of hover card"
    }),
    cardDescription: props.RichText({
      name: "Card Description",
      group: "Hover Card",
      tooltip: "Rich text content with formatting support for hover card body"
    }),
    cardImage: props.Image({
      name: "Card Image",
      group: "Hover Card",
      tooltip: "Optional image displayed at the top of hover card"
    }),
    showCardImage: props.Visibility({
      name: "Show Card Image",
      group: "Hover Card",
      tooltip: "Toggle visibility of the hover card image"
    })
  }
});