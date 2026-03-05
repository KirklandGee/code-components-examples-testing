import QuoteBuilder from "./QuoteBuilder";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./QuoteBuilder.css";

export default declareComponent(QuoteBuilder, {
  name: "QuoteBuilder (Simple)",
  description: "An interactive pricing calculator with a two-column layout that displays input controls on the left and a live-updating results panel on the right (stacking vertically on mobile). The input section contains labeled number fields with increment/decrement buttons, dropdown selects for option choices, and toggle switches for add-ons. The results panel shows a breakdown of line items with labels, quantities, unit prices, and subtotals, plus a prominent total with configurable currency formatting. All calculations update in real-time as users interact with inputs. The component features a clean card-based design with clear visual separation between input sections and the results panel, and includes a call-to-action button at the bottom for quote requests or contact.",
  group: "Interactive",
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
    heading: props.TextNode({
      name: "Heading",
      defaultValue: "Get Your Custom Quote",
      group: "Content",
      tooltip: "Main heading for the calculator"
    }),
    item1Label: props.Text({
      name: "Item 1 Label",
      defaultValue: "Team Members",
      group: "Item 1",
      tooltip: "Label for first line item"
    }),
    item1DefaultValue: props.Number({
      name: "Item 1 Default Value",
      defaultValue: 5,
      group: "Item 1",
      tooltip: "Default quantity or value for first item"
    }),
    item1UnitPrice: props.Number({
      name: "Item 1 Unit Price",
      defaultValue: 25,
      group: "Item 1",
      tooltip: "Price per unit for first item"
    }),
    item1Visible: props.Visibility({
      name: "Item 1 Visible",
      group: "Item 1",
      tooltip: "Show or hide first line item"
    }),
    item2Label: props.Text({
      name: "Item 2 Label",
      defaultValue: "Storage Space (GB)",
      group: "Item 2",
      tooltip: "Label for second line item"
    }),
    item2DefaultValue: props.Number({
      name: "Item 2 Default Value",
      defaultValue: 2,
      group: "Item 2",
      tooltip: "Default quantity or value for second item"
    }),
    item2UnitPrice: props.Number({
      name: "Item 2 Unit Price",
      defaultValue: 15,
      group: "Item 2",
      tooltip: "Price per unit for second item"
    }),
    item2Visible: props.Visibility({
      name: "Item 2 Visible",
      group: "Item 2",
      tooltip: "Show or hide second line item"
    }),
    item3Label: props.Text({
      name: "Item 3 Label",
      defaultValue: "Priority Support",
      group: "Item 3",
      tooltip: "Label for third line item"
    }),
    item3DefaultValue: props.Number({
      name: "Item 3 Default Value",
      defaultValue: 0,
      group: "Item 3",
      tooltip: "Default quantity or value for third item (0 or 1 for toggle)"
    }),
    item3UnitPrice: props.Number({
      name: "Item 3 Unit Price",
      defaultValue: 99,
      group: "Item 3",
      tooltip: "Price per unit for third item"
    }),
    item3Visible: props.Visibility({
      name: "Item 3 Visible",
      group: "Item 3",
      tooltip: "Show or hide third line item"
    }),
    item4Label: props.Text({
      name: "Item 4 Label",
      defaultValue: "API Access",
      group: "Item 4",
      tooltip: "Label for fourth line item"
    }),
    item4DefaultValue: props.Number({
      name: "Item 4 Default Value",
      defaultValue: 0,
      group: "Item 4",
      tooltip: "Default quantity or value for fourth item (0 or 1 for toggle)"
    }),
    item4UnitPrice: props.Number({
      name: "Item 4 Unit Price",
      defaultValue: 49,
      group: "Item 4",
      tooltip: "Price per unit for fourth item"
    }),
    item4Visible: props.Visibility({
      name: "Item 4 Visible",
      group: "Item 4",
      tooltip: "Show or hide fourth line item"
    }),
    ctaText: props.Text({
      name: "CTA Text",
      defaultValue: "Get Your Quote",
      group: "Content",
      tooltip: "Call-to-action button text"
    }),
    ctaLink: props.Link({
      name: "CTA Link",
      group: "Content",
      tooltip: "Call-to-action button link destination"
    }),
  },
});