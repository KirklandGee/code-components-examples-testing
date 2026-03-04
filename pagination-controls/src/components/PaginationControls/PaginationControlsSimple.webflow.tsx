import PaginationControls from "./PaginationControls";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./PaginationControls.css";

export default declareComponent(PaginationControls, {
  name: "PaginationControls (Simple)",
  description: "A flexible pagination component for navigating through pages of content. Displays page numbers with Previous/Next buttons, current page indicator, and total pages count. Supports three visual styles: numbered buttons with ellipsis truncation for many pages (e.g., 1 2 3 ... 18 19 20), simple prev/next arrows only, and a load-more button style. The active page is visually highlighted with accent styling. Previous and Next buttons are automatically disabled at boundaries (first/last page). Includes optional items-per-page display and a compact variant that reduces spacing and button sizes for mobile layouts. Fully responsive with touch-friendly tap targets.",
  group: "Navigation",
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
    currentPage: props.Number({
      name: "Current Page",
      defaultValue: 1,
      group: "Content",
      tooltip: "Currently active page number"
    }),
    totalPages: props.Number({
      name: "Total Pages",
      defaultValue: 20,
      group: "Content",
      tooltip: "Total number of pages available"
    }),
    previousText: props.Text({
      name: "Previous Button Text",
      defaultValue: "Previous",
      group: "Content",
      tooltip: "Text label for Previous button"
    }),
    nextText: props.Text({
      name: "Next Button Text",
      defaultValue: "Next",
      group: "Content",
      tooltip: "Text label for Next button"
    }),
    loadMoreText: props.Text({
      name: "Load More Text",
      defaultValue: "Load More",
      group: "Content",
      tooltip: "Text label for Load More button (loadMore style only)"
    }),
    showPageInfo: props.Boolean({
      name: "Show Page Info",
      defaultValue: true,
      group: "Display",
      tooltip: "Display 'Page X of Y' text indicator"
    }),
    showPreviousNext: props.Boolean({
      name: "Show Previous/Next Buttons",
      defaultValue: true,
      group: "Display",
      tooltip: "Show Previous and Next navigation buttons"
    })
  }
});