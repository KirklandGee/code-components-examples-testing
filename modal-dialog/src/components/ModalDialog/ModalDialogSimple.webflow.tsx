import ModalDialog from "./ModalDialog";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./ModalDialog.css";

export default declareComponent(ModalDialog, {
  name: "ModalDialog (Simple)",
  description: "A modal dialog component that displays as a centered overlay with a semi-transparent backdrop. Features a title heading at the top, rich body content area, and a close button (X icon) positioned in the top-right corner. Opens with a smooth fade and scale animation, and closes when clicking the backdrop, pressing Escape, or clicking the close button. Focus is trapped within the modal when open, preventing interaction with underlying content. The modal is fully responsive and adapts to different screen sizes with configurable maximum width variants.",
  group: "Interactive",
  options: {
    ssr: false,
    applyTagSelectors: true
  },
  props: {
    id: props.Id({
      name: "Element ID",
      group: "Settings",
      tooltip: "HTML ID for targeting the modal container"
    }),
    triggerButtonText: props.Text({
      name: "Trigger Button Text",
      defaultValue: "Open Modal",
      group: "Content",
      tooltip: "Text displayed on the button that opens the modal"
    }),
    modalTitle: props.TextNode({
      name: "Modal Title",
      defaultValue: "Modal Title",
      group: "Content",
      tooltip: "Main heading displayed at the top of the modal"
    }),
    bodyContent: props.RichText({
      name: "Body Content",
      group: "Content",
      tooltip: "Rich text content displayed in the modal body"
    }),
    contentSlot: props.Slot({
      name: "Content Slot",
      group: "Content",
      tooltip: "Optional slot for custom component content instead of rich text"
    }),
    showCloseButton: props.Visibility({
      name: "Show Close Button",
      group: "Display",
      tooltip: "Show or hide the close button in the top-right corner"
    }),
    showTriggerButton: props.Visibility({
      name: "Show Trigger Button",
      group: "Display",
      tooltip: "Show or hide the trigger button"
    })
  }
});