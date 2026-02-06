import PricingTable from "./PricingTable";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./PricingTable.css";

export default declareComponent(PricingTable, {
  name: "PricingTable",
  description: "A responsive pricing table with 3 tiers displayed as cards. Each tier shows a name, price, billing period, description, feature list, and CTA button with link. Supports highlighting a recommended tier with a visual accent badge. Cards stack vertically on mobile and display horizontally on desktop.",
  group: "Marketing",
  options: {
    ssr: true,
    applyTagSelectors: true
  },
  props: {
    id: props.Id({
      name: "Element ID",
      group: "Settings",
      tooltip: "HTML ID for targeting with CSS or JavaScript"
    }),
    layout: props.Variant({
      name: "Layout",
      options: ["horizontal", "vertical"],
      defaultValue: "horizontal",
      group: "Style",
      tooltip: "Card arrangement direction"
    }),
    heading: props.TextNode({
      name: "Heading",
      defaultValue: "Choose Your Plan",
      group: "Content",
      tooltip: "Main heading above the pricing cards"
    }),
    subheading: props.Text({
      name: "Subheading",
      defaultValue: "Select the perfect plan for your needs",
      group: "Content",
      tooltip: "Subheading text below the main heading"
    }),
    tier1Name: props.Text({
      name: "Plan Name",
      defaultValue: "Basic",
      group: "Tier 1",
      tooltip: "First tier plan name"
    }),
    tier1Price: props.Text({
      name: "Price",
      defaultValue: "$9",
      group: "Tier 1",
      tooltip: "First tier price display"
    }),
    tier1Period: props.Text({
      name: "Billing Period",
      defaultValue: "/month",
      group: "Tier 1",
      tooltip: "First tier billing period"
    }),
    tier1Description: props.Text({
      name: "Description",
      defaultValue: "Perfect for getting started",
      group: "Tier 1",
      tooltip: "First tier short description"
    }),
    tier1Features: props.Text({
      name: "Features",
      defaultValue: "Up to 5 projects\nBasic support\n1GB storage\nEmail notifications",
      group: "Tier 1",
      tooltip: "First tier features, one per line"
    }),
    tier1CtaText: props.Text({
      name: "CTA Text",
      defaultValue: "Get Started",
      group: "Tier 1",
      tooltip: "First tier call-to-action button text"
    }),
    tier1CtaLink: props.Link({
      name: "CTA Link",
      group: "Tier 1",
      tooltip: "First tier call-to-action button link"
    }),
    tier1Visible: props.Visibility({
      name: "Visible",
      group: "Tier 1",
      tooltip: "Show or hide the first tier"
    }),
    tier2Name: props.Text({
      name: "Plan Name",
      defaultValue: "Professional",
      group: "Tier 2",
      tooltip: "Second tier plan name"
    }),
    tier2Price: props.Text({
      name: "Price",
      defaultValue: "$29",
      group: "Tier 2",
      tooltip: "Second tier price display"
    }),
    tier2Period: props.Text({
      name: "Billing Period",
      defaultValue: "/month",
      group: "Tier 2",
      tooltip: "Second tier billing period"
    }),
    tier2Description: props.Text({
      name: "Description",
      defaultValue: "Most popular choice",
      group: "Tier 2",
      tooltip: "Second tier short description"
    }),
    tier2Features: props.Text({
      name: "Features",
      defaultValue: "Unlimited projects\nPriority support\n10GB storage\nAdvanced analytics\nTeam collaboration\nCustom integrations",
      group: "Tier 2",
      tooltip: "Second tier features, one per line"
    }),
    tier2CtaText: props.Text({
      name: "CTA Text",
      defaultValue: "Start Free Trial",
      group: "Tier 2",
      tooltip: "Second tier call-to-action button text"
    }),
    tier2CtaLink: props.Link({
      name: "CTA Link",
      group: "Tier 2",
      tooltip: "Second tier call-to-action button link"
    }),
    tier2Recommended: props.Boolean({
      name: "Recommended",
      defaultValue: true,
      group: "Tier 2",
      tooltip: "Show recommended badge on this tier"
    }),
    tier2Visible: props.Visibility({
      name: "Visible",
      group: "Tier 2",
      tooltip: "Show or hide the second tier"
    }),
    tier3Name: props.Text({
      name: "Plan Name",
      defaultValue: "Enterprise",
      group: "Tier 3",
      tooltip: "Third tier plan name"
    }),
    tier3Price: props.Text({
      name: "Price",
      defaultValue: "$99",
      group: "Tier 3",
      tooltip: "Third tier price display"
    }),
    tier3Period: props.Text({
      name: "Billing Period",
      defaultValue: "/month",
      group: "Tier 3",
      tooltip: "Third tier billing period"
    }),
    tier3Description: props.Text({
      name: "Description",
      defaultValue: "For large organizations",
      group: "Tier 3",
      tooltip: "Third tier short description"
    }),
    tier3Features: props.Text({
      name: "Features",
      defaultValue: "Everything in Pro\nDedicated support\nUnlimited storage\nAdvanced security\nCustom workflows\nSLA guarantee",
      group: "Tier 3",
      tooltip: "Third tier features, one per line"
    }),
    tier3CtaText: props.Text({
      name: "CTA Text",
      defaultValue: "Contact Sales",
      group: "Tier 3",
      tooltip: "Third tier call-to-action button text"
    }),
    tier3CtaLink: props.Link({
      name: "CTA Link",
      group: "Tier 3",
      tooltip: "Third tier call-to-action button link"
    }),
    tier3Visible: props.Visibility({
      name: "Visible",
      group: "Tier 3",
      tooltip: "Show or hide the third tier"
    }),
    badgeText: props.Text({
      name: "Badge Text",
      defaultValue: "Most Popular",
      group: "Style",
      tooltip: "Text shown on the recommended tier badge"
    }),
    footerText: props.Text({
      name: "Footer Text",
      defaultValue: "All plans include 24/7 support and 30-day money-back guarantee",
      group: "Content",
      tooltip: "Optional footer text below the pricing cards"
    }),
    showFooter: props.Boolean({
      name: "Show Footer",
      defaultValue: true,
      group: "Display",
      tooltip: "Show or hide the footer text"
    })
  },
});