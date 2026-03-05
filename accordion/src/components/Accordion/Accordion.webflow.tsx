import Accordion from "./Accordion";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./Accordion.css";

export default declareComponent(Accordion, {
  name: "Accordion",
  description: "A fully accessible accordion component that displays collapsible content sections with smooth slide animations. Each section consists of a clickable header with a title and an animated chevron icon that rotates 180 degrees when expanded. Supports two expansion modes: 'single' mode where opening one section automatically closes others, and 'multiple' mode where any number of sections can be open simultaneously. Features two visual variants: a 'bordered' style with visible borders around each section, and a 'flush' minimal style with subtle dividers. The first item is expanded by default on initial render. Fully keyboard accessible with Enter and Space key support, and implements proper ARIA attributes for screen readers. Responsive design ensures readability on all screen sizes.",
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
    variant: props.Variant({
      name: "Variant",
      options: ["bordered", "flush"],
      defaultValue: "bordered",
      group: "Style",
      tooltip: "Visual style of the accordion"
    }),
    expansionMode: props.Variant({
      name: "Expansion Mode",
      options: ["single", "multiple"],
      defaultValue: "single",
      group: "Behavior",
      tooltip: "Controls whether multiple sections can be open at once"
    }),
    item1Visible: props.Visibility({
      name: "Item 1 Visible",
      group: "Item 1",
      tooltip: "Show or hide the first accordion item"
    }),
    item1Title: props.Text({
      name: "Item 1 Title",
      defaultValue: "What is your return policy?",
      group: "Item 1",
      tooltip: "Header title for the first accordion item"
    }),
    item1Content: props.RichText({
      name: "Item 1 Content",
      group: "Item 1",
      tooltip: "Body content for the first accordion item"
    }),
    item2Visible: props.Visibility({
      name: "Item 2 Visible",
      group: "Item 2",
      tooltip: "Show or hide the second accordion item"
    }),
    item2Title: props.Text({
      name: "Item 2 Title",
      defaultValue: "How long does shipping take?",
      group: "Item 2",
      tooltip: "Header title for the second accordion item"
    }),
    item2Content: props.RichText({
      name: "Item 2 Content",
      group: "Item 2",
      tooltip: "Body content for the second accordion item"
    }),
    item3Visible: props.Visibility({
      name: "Item 3 Visible",
      group: "Item 3",
      tooltip: "Show or hide the third accordion item"
    }),
    item3Title: props.Text({
      name: "Item 3 Title",
      defaultValue: "Do you offer international shipping?",
      group: "Item 3",
      tooltip: "Header title for the third accordion item"
    }),
    item3Content: props.RichText({
      name: "Item 3 Content",
      group: "Item 3",
      tooltip: "Body content for the third accordion item"
    }),
    item4Visible: props.Visibility({
      name: "Item 4 Visible",
      group: "Item 4",
      tooltip: "Show or hide the fourth accordion item"
    }),
    item4Title: props.Text({
      name: "Item 4 Title",
      defaultValue: "How can I track my order?",
      group: "Item 4",
      tooltip: "Header title for the fourth accordion item"
    }),
    item4Content: props.RichText({
      name: "Item 4 Content",
      group: "Item 4",
      tooltip: "Body content for the fourth accordion item"
    }),
    item5Visible: props.Visibility({
      name: "Item 5 Visible",
      group: "Item 5",
      tooltip: "Show or hide the fifth accordion item"
    }),
    item5Title: props.Text({
      name: "Item 5 Title",
      defaultValue: "What payment methods do you accept?",
      group: "Item 5",
      tooltip: "Header title for the fifth accordion item"
    }),
    item5Content: props.RichText({
      name: "Item 5 Content",
      group: "Item 5",
      tooltip: "Body content for the fifth accordion item"
    }),
  },
});