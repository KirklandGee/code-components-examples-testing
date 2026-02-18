import JobBoard from "./JobBoard";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./JobBoard.css";

export default declareComponent(JobBoard, {
  name: "JobBoard",
  description: "A comprehensive job board component that integrates with the Greenhouse API to display open positions in a responsive grid layout. Each job card shows the title, department, location, and an apply link. Features include department and location filter dropdowns at the top, a loading spinner during data fetch, error state messaging for failed API calls, and an empty state when no jobs match the filters. Supports pagination with a 'Load More' button for large job sets. Cards display in a multi-column grid on desktop and stack vertically on mobile devices. The component fetches data from boards-api.greenhouse.io using a configurable board token prop.",
  group: "Data Display",
  options: {
    ssr: false,
    applyTagSelectors: true
  },
  props: {
    id: props.Id({
      name: "Element ID",
      group: "Settings",
      tooltip: "HTML ID attribute for the component"
    }),
    boardToken: props.Text({
      name: "Board Token",
      defaultValue: "",
      group: "Settings",
      tooltip: "Greenhouse board token for API authentication"
    }),
    heading: props.TextNode({
      name: "Heading",
      defaultValue: "Open Positions",
      group: "Content",
      tooltip: "Main heading displayed above the job board"
    }),
    subheading: props.Text({
      name: "Subheading",
      defaultValue: "Join our team and help us build the future",
      group: "Content",
      tooltip: "Subheading text below the main heading"
    }),
    layout: props.Variant({
      name: "Layout",
      options: ["2-column", "3-column", "4-column"],
      defaultValue: "3-column",
      group: "Style",
      tooltip: "Grid layout columns for desktop view"
    }),
    cardStyle: props.Variant({
      name: "Card Style",
      options: ["minimal", "bordered", "elevated"],
      defaultValue: "elevated",
      group: "Style",
      tooltip: "Visual style of job cards"
    }),
    showFilters: props.Boolean({
      name: "Show Filters",
      defaultValue: true,
      group: "Display",
      tooltip: "Show or hide the filter dropdowns"
    }),
    departmentFilterLabel: props.Text({
      name: "Department Filter Label",
      defaultValue: "Department",
      group: "Content",
      tooltip: "Label text for the department filter dropdown"
    }),
    departmentFilterPlaceholder: props.Text({
      name: "Department Filter Placeholder",
      defaultValue: "All Departments",
      group: "Content",
      tooltip: "Placeholder text for department filter"
    }),
    locationFilterLabel: props.Text({
      name: "Location Filter Label",
      defaultValue: "Location",
      group: "Content",
      tooltip: "Label text for the location filter dropdown"
    }),
    locationFilterPlaceholder: props.Text({
      name: "Location Filter Placeholder",
      defaultValue: "All Locations",
      group: "Content",
      tooltip: "Placeholder text for location filter"
    }),
    applyButtonText: props.Text({
      name: "Apply Button Text",
      defaultValue: "Apply Now",
      group: "Content",
      tooltip: "Text displayed on the apply button for each job card"
    }),
    loadingText: props.Text({
      name: "Loading Text",
      defaultValue: "Loading positions...",
      group: "Content",
      tooltip: "Text displayed during API data fetch"
    }),
    showLoadingSpinner: props.Boolean({
      name: "Show Loading Spinner",
      defaultValue: true,
      group: "Display",
      tooltip: "Show animated spinner during loading"
    }),
    errorHeading: props.Text({
      name: "Error Heading",
      defaultValue: "Unable to Load Positions",
      group: "Content",
      tooltip: "Heading text displayed when API call fails"
    }),
    errorMessage: props.Text({
      name: "Error Message",
      defaultValue: "We're having trouble loading our open positions. Please try again later or contact us directly.",
      group: "Content",
      tooltip: "Error message body text"
    }),
    errorRetryButtonText: props.Text({
      name: "Error Retry Button Text",
      defaultValue: "Try Again",
      group: "Content",
      tooltip: "Text for the retry button in error state"
    }),
    showErrorRetryButton: props.Boolean({
      name: "Show Error Retry Button",
      defaultValue: true,
      group: "Display",
      tooltip: "Show retry button in error state"
    }),
    emptyStateHeading: props.Text({
      name: "Empty State Heading",
      defaultValue: "No Positions Found",
      group: "Content",
      tooltip: "Heading displayed when no jobs match filters"
    }),
    emptyStateMessage: props.Text({
      name: "Empty State Message",
      defaultValue: "There are no open positions matching your criteria. Try adjusting your filters or check back later.",
      group: "Content",
      tooltip: "Message displayed in empty state"
    }),
    emptyStateResetButtonText: props.Text({
      name: "Empty State Reset Button Text",
      defaultValue: "Clear Filters",
      group: "Content",
      tooltip: "Text for reset filters button in empty state"
    }),
    showEmptyStateResetButton: props.Boolean({
      name: "Show Empty State Reset Button",
      defaultValue: true,
      group: "Display",
      tooltip: "Show reset filters button in empty state"
    }),
    enablePagination: props.Boolean({
      name: "Enable Pagination",
      defaultValue: true,
      group: "Behavior",
      tooltip: "Enable Load More button for pagination"
    }),
    initialJobsPerPage: props.Number({
      name: "Initial Jobs Per Page",
      defaultValue: 9,
      group: "Behavior",
      tooltip: "Number of jobs to display initially"
    }),
    jobsPerPageIncrement: props.Number({
      name: "Jobs Per Page Increment",
      defaultValue: 9,
      group: "Behavior",
      tooltip: "Number of additional jobs loaded when Load More is clicked"
    }),
    loadMoreButtonText: props.Text({
      name: "Load More Button Text",
      defaultValue: "Load More Positions",
      group: "Content",
      tooltip: "Text for the Load More button"
    }),
    showJobCount: props.Boolean({
      name: "Show Job Count",
      defaultValue: true,
      group: "Display",
      tooltip: "Display total number of jobs above the grid"
    }),
    jobCountText: props.Text({
      name: "Job Count Text",
      defaultValue: "{count} open positions",
      group: "Content",
      tooltip: "Template for job count display (use {count} as placeholder)"
    }),
    showDepartmentOnCard: props.Boolean({
      name: "Show Department On Card",
      defaultValue: true,
      group: "Display",
      tooltip: "Display department name on job cards"
    }),
    showLocationOnCard: props.Boolean({
      name: "Show Location On Card",
      defaultValue: true,
      group: "Display",
      tooltip: "Display location on job cards"
    }),
    openLinksInNewTab: props.Boolean({
      name: "Open Links In New Tab",
      defaultValue: true,
      group: "Behavior",
      tooltip: "Open job application links in a new browser tab"
    }),
    departmentLabel: props.Text({
      name: "Department Label",
      defaultValue: "Department:",
      group: "Content",
      tooltip: "Label prefix for department on cards"
    }),
    locationLabel: props.Text({
      name: "Location Label",
      defaultValue: "Location:",
      group: "Content",
      tooltip: "Label prefix for location on cards"
    }),
  },
});