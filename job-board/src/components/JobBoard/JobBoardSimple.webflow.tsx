import JobBoard from "./JobBoard";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./JobBoard.css";

export default declareComponent(JobBoard, {
  name: "JobBoard (Simple)",
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
    applyButtonText: props.Text({
      name: "Apply Button Text",
      defaultValue: "Apply Now",
      group: "Content",
      tooltip: "Text displayed on the apply button for each job card"
    }),
    loadMoreButtonText: props.Text({
      name: "Load More Button Text",
      defaultValue: "Load More Positions",
      group: "Content",
      tooltip: "Text for the Load More button"
    }),
    showFilters: props.Boolean({
      name: "Show Filters",
      defaultValue: true,
      group: "Display",
      tooltip: "Show or hide the filter dropdowns"
    }),
    showJobCount: props.Boolean({
      name: "Show Job Count",
      defaultValue: true,
      group: "Display",
      tooltip: "Display total number of jobs above the grid"
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
    enablePagination: props.Boolean({
      name: "Enable Pagination",
      defaultValue: true,
      group: "Behavior",
      tooltip: "Enable Load More button for pagination"
    }),
    openLinksInNewTab: props.Boolean({
      name: "Open Links In New Tab",
      defaultValue: true,
      group: "Behavior",
      tooltip: "Open job application links in a new browser tab"
    }),
  },
});