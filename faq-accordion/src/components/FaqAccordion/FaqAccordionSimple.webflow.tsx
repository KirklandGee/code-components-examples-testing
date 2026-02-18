import FaqAccordion from "./FaqAccordion";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./FaqAccordion.css";

export default declareComponent(FaqAccordion, {
  name: "FaqAccordion (Simple)",
  description: "A vertically stacked accordion component designed for FAQ sections with 5-6 collapsible items. Each item displays a question header with an expand/collapse icon that rotates on interaction. Clicking a question smoothly expands its answer panel with a slide-down animation while automatically collapsing any previously open item, ensuring only one answer is visible at a time. The active item is visually distinguished with an accent color. Fully responsive and keyboard accessible.",
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
    heading: props.TextNode({
      name: "Heading",
      defaultValue: "Frequently Asked Questions",
      group: "Content",
      tooltip: "Main heading displayed above the accordion"
    }),
    item1Question: props.Text({
      name: "Question",
      defaultValue: "What is your return policy?",
      group: "Item 1",
      tooltip: "First item question text"
    }),
    item1Answer: props.RichText({
      name: "Answer",
      group: "Item 1",
      tooltip: "First item answer content with formatting support"
    }),
    item1Visible: props.Visibility({
      name: "Visible",
      group: "Item 1",
      tooltip: "Show or hide the first accordion item"
    }),
    item2Question: props.Text({
      name: "Question",
      defaultValue: "How long does shipping take?",
      group: "Item 2",
      tooltip: "Second item question text"
    }),
    item2Answer: props.RichText({
      name: "Answer",
      group: "Item 2",
      tooltip: "Second item answer content with formatting support"
    }),
    item2Visible: props.Visibility({
      name: "Visible",
      group: "Item 2",
      tooltip: "Show or hide the second accordion item"
    }),
    item3Question: props.Text({
      name: "Question",
      defaultValue: "Do you offer customer support?",
      group: "Item 3",
      tooltip: "Third item question text"
    }),
    item3Answer: props.RichText({
      name: "Answer",
      group: "Item 3",
      tooltip: "Third item answer content with formatting support"
    }),
    item3Visible: props.Visibility({
      name: "Visible",
      group: "Item 3",
      tooltip: "Show or hide the third accordion item"
    }),
    item4Question: props.Text({
      name: "Question",
      defaultValue: "Can I change my subscription plan?",
      group: "Item 4",
      tooltip: "Fourth item question text"
    }),
    item4Answer: props.RichText({
      name: "Answer",
      group: "Item 4",
      tooltip: "Fourth item answer content with formatting support"
    }),
    item4Visible: props.Visibility({
      name: "Visible",
      group: "Item 4",
      tooltip: "Show or hide the fourth accordion item"
    }),
    item5Question: props.Text({
      name: "Question",
      defaultValue: "Is my data secure?",
      group: "Item 5",
      tooltip: "Fifth item question text"
    }),
    item5Answer: props.RichText({
      name: "Answer",
      group: "Item 5",
      tooltip: "Fifth item answer content with formatting support"
    }),
    item5Visible: props.Visibility({
      name: "Visible",
      group: "Item 5",
      tooltip: "Show or hide the fifth accordion item"
    }),
    item6Question: props.Text({
      name: "Question",
      defaultValue: "How do I cancel my account?",
      group: "Item 6",
      tooltip: "Sixth item question text"
    }),
    item6Answer: props.RichText({
      name: "Answer",
      group: "Item 6",
      tooltip: "Sixth item answer content with formatting support"
    }),
    item6Visible: props.Visibility({
      name: "Visible",
      group: "Item 6",
      tooltip: "Show or hide the sixth accordion item"
    }),
  },
});