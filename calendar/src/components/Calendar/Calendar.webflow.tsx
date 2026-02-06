import Calendar from "./Calendar";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./Calendar.css";

export default declareComponent(Calendar, {
  name: "Calendar",
  description:
    "A date picker calendar that adapts to your site's design system. Uses site variables for colors, typography, and spacing.",
  group: "Interactive",
  options: {
    ssr: false,
    applyTagSelectors: true,
  },
  props: {
    id: props.Id({
      name: "Element ID",
      group: "Settings",
      tooltip: "HTML ID for targeting with CSS or JavaScript",
    }),
    size: props.Variant({
      name: "Size",
      options: ["compact", "default", "large"],
      defaultValue: "default",
      group: "Style",
      tooltip: "Controls the cell size of the calendar grid",
    }),
    captionLayout: props.Variant({
      name: "Caption Layout",
      options: ["label", "dropdown"],
      defaultValue: "label",
      group: "Style",
      tooltip:
        "How the month/year is displayed. Label shows text, dropdown adds month/year selectors.",
    }),
    showOutsideDays: props.Boolean({
      name: "Show Outside Days",
      defaultValue: true,
      group: "Display",
      tooltip: "Show dates from the previous and next months",
    }),
    showWeekNumbers: props.Boolean({
      name: "Show Week Numbers",
      defaultValue: false,
      group: "Display",
      tooltip: "Display ISO week numbers in the first column",
    }),
    fixedWeeks: props.Boolean({
      name: "Fixed Weeks",
      defaultValue: false,
      group: "Display",
      tooltip: "Always show 6 weeks so the calendar height stays consistent",
    }),
    header: props.Slot({
      name: "Header",
      group: "Content",
      tooltip: "Content area above the calendar grid",
    }),
    footer: props.Slot({
      name: "Footer",
      group: "Content",
      tooltip: "Content area below the calendar grid",
    }),
  },
});
