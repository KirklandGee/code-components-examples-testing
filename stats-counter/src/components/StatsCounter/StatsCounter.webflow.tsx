import StatsCounter from "./StatsCounter";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./StatsCounter.css";

export default declareComponent(StatsCounter, {
  name: "StatsCounter",
  description: "A horizontal or grid bar of animated stat counters. Each stat displays a large number with optional prefix (e.g. $) and suffix (e.g. +, %, K, M), a label, and an optional one-line description. When the component scrolls into view it triggers a smooth count-up animation from 0 to each stat's target value using requestAnimationFrame and easeOutExpo timing. Supports 3 to 6 stats with individual visibility toggles, configurable animation duration, choice of no / line / dot dividers between stats, and left / center / right text alignment. Uses IntersectionObserver so the animation only fires once per viewport entry. Fully responsive — collapses to a vertical stack on narrow screens when in row layout. Inherits typography from the Webflow site and uses site color variables for the accent and divider colors with sensible fallbacks.",
  group: "Marketing",
  options: {
    ssr: false,
    applyTagSelectors: true
  },
  props: {
    id: props.Id({
      name: "Element ID",
      group: "Settings",
      tooltip: "HTML ID attribute for targeting with CSS or JavaScript"
    }),
    layout: props.Variant({
      name: "Layout",
      options: ["row", "grid"],
      defaultValue: "row",
      group: "Style",
      tooltip: "Arrangement of stats — row (horizontal) or grid (wraps on narrow screens)"
    }),
    alignment: props.Variant({
      name: "Alignment",
      options: ["left", "center", "right"],
      defaultValue: "center",
      group: "Style",
      tooltip: "Text alignment within each stat cell"
    }),
    dividerStyle: props.Variant({
      name: "Divider Style",
      options: ["none", "line", "dot"],
      defaultValue: "line",
      group: "Style",
      tooltip: "Visual separator between stats"
    }),
    numberSize: props.Variant({
      name: "Number Size",
      options: ["medium", "large", "xlarge"],
      defaultValue: "large",
      group: "Style",
      tooltip: "Size scale for the big stat number"
    }),
    heading: props.TextNode({
      name: "Heading",
      defaultValue: "By the Numbers",
      group: "Content",
      tooltip: "Optional main heading above the stats"
    }),
    subheading: props.Text({
      name: "Subheading",
      defaultValue: "A snapshot of what we've built together",
      group: "Content",
      tooltip: "Optional subheading below the main heading"
    }),
    showHeading: props.Boolean({
      name: "Show Heading",
      defaultValue: true,
      group: "Display",
      tooltip: "Show or hide the heading and subheading block"
    }),
    animationDuration: props.Number({
      name: "Animation Duration",
      defaultValue: 2000,
      group: "Behavior",
      tooltip: "Count-up animation duration in milliseconds"
    }),
    animateOnScroll: props.Boolean({
      name: "Animate On Scroll",
      defaultValue: true,
      group: "Behavior",
      tooltip: "Trigger the animation when the component scrolls into view"
    }),
    animateOnce: props.Boolean({
      name: "Animate Once",
      defaultValue: true,
      group: "Behavior",
      tooltip: "Only animate the first time the component enters the viewport"
    }),
    stat1Value: props.Number({
      name: "Value",
      defaultValue: 12000,
      group: "Stat 1",
      tooltip: "First stat target value (the number the counter counts up to)"
    }),
    stat1Prefix: props.Text({
      name: "Prefix",
      defaultValue: "",
      group: "Stat 1",
      tooltip: "Text shown before the number (e.g. $, ~)"
    }),
    stat1Suffix: props.Text({
      name: "Suffix",
      defaultValue: "+",
      group: "Stat 1",
      tooltip: "Text shown after the number (e.g. +, %, K, M, /mo)"
    }),
    stat1Label: props.Text({
      name: "Label",
      defaultValue: "Happy customers",
      group: "Stat 1",
      tooltip: "Short label shown below the number"
    }),
    stat1Description: props.Text({
      name: "Description",
      defaultValue: "Across 40 countries",
      group: "Stat 1",
      tooltip: "Optional supporting caption below the label"
    }),
    stat1Visible: props.Visibility({
      name: "Visible",
      group: "Stat 1",
      tooltip: "Show or hide the first stat"
    }),
    stat2Value: props.Number({
      name: "Value",
      defaultValue: 98,
      group: "Stat 2",
      tooltip: "Second stat target value"
    }),
    stat2Prefix: props.Text({
      name: "Prefix",
      defaultValue: "",
      group: "Stat 2",
      tooltip: "Text shown before the number"
    }),
    stat2Suffix: props.Text({
      name: "Suffix",
      defaultValue: "%",
      group: "Stat 2",
      tooltip: "Text shown after the number"
    }),
    stat2Label: props.Text({
      name: "Label",
      defaultValue: "Customer satisfaction",
      group: "Stat 2",
      tooltip: "Short label shown below the number"
    }),
    stat2Description: props.Text({
      name: "Description",
      defaultValue: "Based on annual NPS survey",
      group: "Stat 2",
      tooltip: "Optional supporting caption below the label"
    }),
    stat2Visible: props.Visibility({
      name: "Visible",
      group: "Stat 2",
      tooltip: "Show or hide the second stat"
    }),
    stat3Value: props.Number({
      name: "Value",
      defaultValue: 250,
      group: "Stat 3",
      tooltip: "Third stat target value"
    }),
    stat3Prefix: props.Text({
      name: "Prefix",
      defaultValue: "$",
      group: "Stat 3",
      tooltip: "Text shown before the number"
    }),
    stat3Suffix: props.Text({
      name: "Suffix",
      defaultValue: "M",
      group: "Stat 3",
      tooltip: "Text shown after the number"
    }),
    stat3Label: props.Text({
      name: "Label",
      defaultValue: "Funding raised",
      group: "Stat 3",
      tooltip: "Short label shown below the number"
    }),
    stat3Description: props.Text({
      name: "Description",
      defaultValue: "Series C lead by Sequoia",
      group: "Stat 3",
      tooltip: "Optional supporting caption below the label"
    }),
    stat3Visible: props.Visibility({
      name: "Visible",
      group: "Stat 3",
      tooltip: "Show or hide the third stat"
    }),
    stat4Value: props.Number({
      name: "Value",
      defaultValue: 150,
      group: "Stat 4",
      tooltip: "Fourth stat target value"
    }),
    stat4Prefix: props.Text({
      name: "Prefix",
      defaultValue: "",
      group: "Stat 4",
      tooltip: "Text shown before the number"
    }),
    stat4Suffix: props.Text({
      name: "Suffix",
      defaultValue: "",
      group: "Stat 4",
      tooltip: "Text shown after the number"
    }),
    stat4Label: props.Text({
      name: "Label",
      defaultValue: "Team members",
      group: "Stat 4",
      tooltip: "Short label shown below the number"
    }),
    stat4Description: props.Text({
      name: "Description",
      defaultValue: "Remote-first across 12 time zones",
      group: "Stat 4",
      tooltip: "Optional supporting caption below the label"
    }),
    stat4Visible: props.Visibility({
      name: "Visible",
      group: "Stat 4",
      tooltip: "Show or hide the fourth stat"
    }),
    stat5Value: props.Number({
      name: "Value",
      defaultValue: 0,
      group: "Stat 5",
      tooltip: "Fifth stat target value"
    }),
    stat5Prefix: props.Text({
      name: "Prefix",
      defaultValue: "",
      group: "Stat 5",
      tooltip: "Text shown before the number"
    }),
    stat5Suffix: props.Text({
      name: "Suffix",
      defaultValue: "",
      group: "Stat 5",
      tooltip: "Text shown after the number"
    }),
    stat5Label: props.Text({
      name: "Label",
      defaultValue: "Awards won",
      group: "Stat 5",
      tooltip: "Short label shown below the number"
    }),
    stat5Description: props.Text({
      name: "Description",
      defaultValue: "",
      group: "Stat 5",
      tooltip: "Optional supporting caption below the label"
    }),
    stat5Visible: props.Visibility({
      name: "Visible",
      group: "Stat 5",
      tooltip: "Show or hide the fifth stat"
    }),
    stat6Value: props.Number({
      name: "Value",
      defaultValue: 0,
      group: "Stat 6",
      tooltip: "Sixth stat target value"
    }),
    stat6Prefix: props.Text({
      name: "Prefix",
      defaultValue: "",
      group: "Stat 6",
      tooltip: "Text shown before the number"
    }),
    stat6Suffix: props.Text({
      name: "Suffix",
      defaultValue: "",
      group: "Stat 6",
      tooltip: "Text shown after the number"
    }),
    stat6Label: props.Text({
      name: "Label",
      defaultValue: "",
      group: "Stat 6",
      tooltip: "Short label shown below the number"
    }),
    stat6Description: props.Text({
      name: "Description",
      defaultValue: "",
      group: "Stat 6",
      tooltip: "Optional supporting caption below the label"
    }),
    stat6Visible: props.Visibility({
      name: "Visible",
      group: "Stat 6",
      tooltip: "Show or hide the sixth stat"
    })
  }
});