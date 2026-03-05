import MultiStepForm from "./MultiStepForm";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./MultiStepForm.css";

export default declareComponent(MultiStepForm, {
  name: "MultiStepForm (Simple)",
  description: "A progressive multi-step form component that breaks long forms into sequential steps with smooth slide transitions. Displays a visual progress indicator at the top showing current, completed, and remaining steps. Each step contains a configurable group of form fields including text inputs, select dropdowns, textareas, and checkboxes with validation. Navigation buttons at the bottom allow moving between steps with 'Back' and 'Next' (changing to 'Submit' on final step). Validates required fields before allowing progression. Includes a final review/summary step displaying all entered values before submission. Supports 2-6 configurable steps with titles and optional descriptions. Fully responsive with vertically stacked fields on mobile and horizontal progress indicator that adapts to smaller screens.",
  group: "Forms",
  options: {
    ssr: false,
    applyTagSelectors: true
  },
  props: {
    id: props.Id({
      name: "Element ID",
      group: "Settings",
      tooltip: "HTML ID attribute for the form element"
    }),
    formTitle: props.TextNode({
      name: "Form Title",
      defaultValue: "Complete Your Application",
      group: "Content",
      tooltip: "Main form heading displayed at the top"
    }),
    step1Title: props.Text({
      name: "Step 1 Title",
      defaultValue: "Personal Information",
      group: "Step 1",
      tooltip: "Title for step 1"
    }),
    step1Visible: props.Visibility({
      name: "Step 1 Visible",
      group: "Step 1",
      tooltip: "Show or hide step 1"
    }),
    step2Title: props.Text({
      name: "Step 2 Title",
      defaultValue: "Contact Details",
      group: "Step 2",
      tooltip: "Title for step 2"
    }),
    step2Visible: props.Visibility({
      name: "Step 2 Visible",
      group: "Step 2",
      tooltip: "Show or hide step 2"
    }),
    step3Title: props.Text({
      name: "Step 3 Title",
      defaultValue: "Preferences",
      group: "Step 3",
      tooltip: "Title for step 3"
    }),
    step3Visible: props.Visibility({
      name: "Step 3 Visible",
      group: "Step 3",
      tooltip: "Show or hide step 3"
    }),
    step4Title: props.Text({
      name: "Step 4 Title",
      defaultValue: "Additional Information",
      group: "Step 4",
      tooltip: "Title for step 4"
    }),
    step4Visible: props.Visibility({
      name: "Step 4 Visible",
      group: "Step 4",
      tooltip: "Show or hide step 4"
    }),
    step5Title: props.Text({
      name: "Step 5 Title",
      defaultValue: "Review & Confirm",
      group: "Step 5",
      tooltip: "Title for step 5"
    }),
    step5Visible: props.Visibility({
      name: "Step 5 Visible",
      group: "Step 5",
      tooltip: "Show or hide step 5"
    }),
    step6Title: props.Text({
      name: "Step 6 Title",
      defaultValue: "Confirmation",
      group: "Step 6",
      tooltip: "Title for step 6"
    }),
    step6Visible: props.Visibility({
      name: "Step 6 Visible",
      group: "Step 6",
      tooltip: "Show or hide step 6"
    }),
    backButtonText: props.Text({
      name: "Back Button Text",
      defaultValue: "Back",
      group: "Navigation",
      tooltip: "Text for the back navigation button"
    }),
    nextButtonText: props.Text({
      name: "Next Button Text",
      defaultValue: "Next",
      group: "Navigation",
      tooltip: "Text for the next navigation button"
    }),
    submitButtonText: props.Text({
      name: "Submit Button Text",
      defaultValue: "Submit",
      group: "Navigation",
      tooltip: "Text for the submit button on the final step"
    }),
    successMessage: props.Text({
      name: "Success Message",
      defaultValue: "Thank you! Your form has been submitted successfully.",
      group: "Content",
      tooltip: "Message displayed after successful form submission"
    }),
    formAction: props.Link({
      name: "Form Action",
      group: "Settings",
      tooltip: "Form submission endpoint URL"
    }),
  },
});