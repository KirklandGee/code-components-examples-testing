import HeroSection from "./HeroSection";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./HeroSection.css";

export default declareComponent(HeroSection, {
  name: "HeroSection",
  description: "A responsive hero section featuring a large headline, subheading, call-to-action button, and optional background image. The component supports two layout variants: left-aligned (content positioned to the left side) and centered (content centered on the page). The background image can be toggled on or off, with a subtle overlay to ensure text readability. The CTA button includes hover states and transitions. On mobile devices, the layout automatically adjusts to center-aligned for optimal readability regardless of the selected variant.",
  group: "Marketing",
  options: {
    ssr: false,
    applyTagSelectors: true
  },
  props: {
    id: props.Id({
      name: "Element ID",
      group: "Settings",
      tooltip: "HTML ID attribute for targeting and anchoring"
    }),
    layout: props.Variant({
      name: "Layout",
      options: ["left", "centered"],
      defaultValue: "centered",
      group: "Style",
      tooltip: "Content alignment layout"
    }),
    size: props.Variant({
      name: "Size",
      options: ["medium", "large", "full"],
      defaultValue: "large",
      group: "Style",
      tooltip: "Hero section height"
    }),
    headline: props.TextNode({
      name: "Headline",
      defaultValue: "Build Something Amazing",
      group: "Content",
      tooltip: "Main hero headline text"
    }),
    subheading: props.Text({
      name: "Subheading",
      defaultValue: "Create powerful experiences that drive results and delight your customers",
      group: "Content",
      tooltip: "Supporting subheading text below headline"
    }),
    ctaText: props.Text({
      name: "CTA Text",
      defaultValue: "Get Started",
      group: "Content",
      tooltip: "Primary CTA button text"
    }),
    ctaLink: props.Link({
      name: "CTA Link",
      group: "Content",
      tooltip: "Primary CTA button destination"
    }),
    showSecondaryCta: props.Visibility({
      name: "Show Secondary CTA",
      group: "Display",
      tooltip: "Show or hide the secondary CTA button"
    }),
    secondaryCtaText: props.Text({
      name: "Secondary CTA Text",
      defaultValue: "Learn More",
      group: "Content",
      tooltip: "Secondary CTA button text"
    }),
    secondaryCtaLink: props.Link({
      name: "Secondary CTA Link",
      group: "Content",
      tooltip: "Secondary CTA button destination"
    }),
    showBackgroundImage: props.Boolean({
      name: "Show Background Image",
      defaultValue: false,
      group: "Display",
      tooltip: "Enable or disable background image"
    }),
    backgroundImage: props.Image({
      name: "Background Image",
      group: "Content",
      tooltip: "Hero section background image"
    }),
    overlayOpacity: props.Variant({
      name: "Overlay Opacity",
      options: ["none", "light", "medium", "dark"],
      defaultValue: "medium",
      group: "Style",
      tooltip: "Background overlay darkness level"
    }),
    showBadge: props.Visibility({
      name: "Show Badge",
      group: "Display",
      tooltip: "Show or hide the badge above headline"
    }),
    badgeText: props.Text({
      name: "Badge Text",
      defaultValue: "New Release",
      group: "Content",
      tooltip: "Small badge text above headline"
    }),
    contentMaxWidth: props.Variant({
      name: "Content Max Width",
      options: ["narrow", "medium", "wide"],
      defaultValue: "medium",
      group: "Style",
      tooltip: "Maximum width of content area"
    })
  }
});