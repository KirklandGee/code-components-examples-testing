import HeroSection from "./HeroSection";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./HeroSection.css";

export default declareComponent(HeroSection, {
  name: "HeroSection (Simple)",
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
    headline: props.TextNode({
      name: "Headline",
      defaultValue: "Build Something Amazing",
      group: "Content",
      tooltip: "Main hero headline text"
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
    backgroundImage: props.Image({
      name: "Background Image",
      group: "Content",
      tooltip: "Hero section background image"
    })
  }
});