import DatePicker from "./DatePicker";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./DatePicker.css";

export default declareComponent(DatePicker, {
  name: "DatePicker (Simple)",
  description: "A fully-featured date picker component with a calendar dropdown popup. Clicking the input field opens a calendar showing the current month in a grid layout with day names. Users can navigate between months using previous/next arrow buttons and select dates by clicking. The selected date displays in the input field in a configurable format. Supports single date selection or date range mode where users select start and end dates with visual highlighting of the range. Today's date is highlighted with a distinct visual style. Dates outside configurable min/max boundaries are disabled and grayed out. The input includes a calendar icon and a clear button to reset the selection. Fully keyboard navigable for accessibility with arrow keys for date navigation and Enter to select.",
  group: "Forms",
  options: {
    ssr: false,
    applyTagSelectors: true
  },
  props: {
    id: props.Id({
      name: "Element ID",
      group: "Settings",
      tooltip: "HTML ID attribute for the date picker container"
    }),
    label: props.Text({
      name: "Label",
      defaultValue: "Select Date",
      group: "Content",
      tooltip: "Label text displayed above the input field"
    }),
    placeholder: props.Text({
      name: "Placeholder",
      defaultValue: "Choose a date",
      group: "Content",
      tooltip: "Placeholder text shown in empty input field"
    }),
    showLabel: props.Visibility({
      name: "Show Label",
      group: "Display",
      tooltip: "Show or hide the label above the input"
    }),
    isDisabled: props.Boolean({
      name: "Disabled",
      defaultValue: false,
      group: "Behavior",
      tooltip: "Disable the entire date picker input"
    }),
    isRequired: props.Boolean({
      name: "Required",
      defaultValue: false,
      group: "Behavior",
      tooltip: "Mark the date picker as a required field"
    }),
    minDate: props.Text({
      name: "Minimum Date",
      defaultValue: "",
      group: "Date Constraints",
      tooltip: "Minimum selectable date in YYYY-MM-DD format (dates before are disabled)"
    }),
    maxDate: props.Text({
      name: "Maximum Date",
      defaultValue: "",
      group: "Date Constraints",
      tooltip: "Maximum selectable date in YYYY-MM-DD format (dates after are disabled)"
    }),
    defaultDate: props.Text({
      name: "Default Date",
      defaultValue: "",
      group: "Date Constraints",
      tooltip: "Default selected date in YYYY-MM-DD format"
    }),
    helperText: props.Text({
      name: "Helper Text",
      defaultValue: "",
      group: "Content",
      tooltip: "Helper text displayed below the input field"
    }),
    errorText: props.Text({
      name: "Error Text",
      defaultValue: "",
      group: "Content",
      tooltip: "Error message text displayed when validation fails"
    }),
    showHelperText: props.Visibility({
      name: "Show Helper Text",
      group: "Display",
      tooltip: "Show or hide the helper text below input"
    }),
    showErrorText: props.Visibility({
      name: "Show Error Text",
      group: "Display",
      tooltip: "Show or hide the error message"
    }),
    name: props.Text({
      name: "Input Name",
      defaultValue: "date",
      group: "Settings",
      tooltip: "Form input name attribute for form submission"
    })
  }
});