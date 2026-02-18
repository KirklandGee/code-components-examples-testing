# JobBoard

A comprehensive job board component that integrates with the Greenhouse API to display open positions in a responsive grid layout.

## Getting Started

Install dependencies:
```bash
npm install
```

Share the component to your Webflow workspace:
```bash
npx webflow library share
```

For local development:
```bash
npm run dev
```

## Designer Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| ID | Id | — | HTML ID attribute for the component |
| Board Token | Text | — | Greenhouse board token for API authentication |
| Heading | TextNode | Open Positions | Main heading displayed above the job board |
| Subheading | Text | Join our team and help us build the future | Subheading text below the main heading |
| Layout | Variant | 3-column | Grid layout columns for desktop view (2-column, 3-column, 4-column) |
| Card Style | Variant | elevated | Visual style of job cards (minimal, bordered, elevated) |
| Show Filters | Boolean | true | Show or hide the filter dropdowns |
| Department Filter Label | Text | Department | Label text for the department filter dropdown |
| Department Filter Placeholder | Text | All Departments | Placeholder text for department filter |
| Location Filter Label | Text | Location | Label text for the location filter dropdown |
| Location Filter Placeholder | Text | All Locations | Placeholder text for location filter |
| Apply Button Text | Text | Apply Now | Text displayed on the apply button for each job card |
| Loading Text | Text | Loading positions... | Text displayed during API data fetch |
| Show Loading Spinner | Boolean | true | Show animated spinner during loading |
| Error Heading | Text | Unable to Load Positions | Heading text displayed when API call fails |
| Error Message | Text | We're having trouble loading our open positions. Please try again later or contact us directly. | Error message body text |
| Error Retry Button Text | Text | Try Again | Text for the retry button in error state |
| Show Error Retry Button | Boolean | true | Show retry button in error state |
| Empty State Heading | Text | No Positions Found | Heading displayed when no jobs match filters |
| Empty State Message | Text | There are no open positions matching your criteria. Try adjusting your filters or check back later. | Message displayed in empty state |
| Empty State Reset Button Text | Text | Clear Filters | Text for reset filters button in empty state |
| Show Empty State Reset Button | Boolean | true | Show reset filters button in empty state |
| Enable Pagination | Boolean | true | Enable Load More button for pagination |
| Initial Jobs Per Page | Number | 9 | Number of jobs to display initially |
| Jobs Per Page Increment | Number | 9 | Number of additional jobs loaded when Load More is clicked |
| Load More Button Text | Text | Load More Positions | Text for the Load More button |
| Show Job Count | Boolean | true | Display total number of jobs above the grid |
| Job Count Text | Text | {count} open positions | Template for job count display (use {count} as placeholder) |
| Show Department On Card | Boolean | true | Display department name on job cards |
| Show Location On Card | Boolean | true | Display location on job cards |
| Open Links In New Tab | Boolean | true | Open job application links in a new browser tab |
| Department Label | Text | Department: | Label prefix for department on cards |
| Location Label | Text | Location: | Label prefix for location on cards |

## Styling

This component automatically adapts to your Webflow site's design system through site variables and inherited properties.

### Site Variables

To match your site's design system, define these CSS variables in your Webflow project settings. The component will use the fallback values shown below until you configure them.

| Site Variable | What It Controls | Fallback |
|---------------|------------------|----------|
| --background-primary | Main background color for cards, containers, and select inputs | #ffffff |
| --background-secondary | Hover states and subtle backgrounds | #f5f5f5 |
| --text-primary | Main text color for headings, body text, and primary buttons | #1a1a1a |
| --text-secondary | Muted text for labels, meta information, and placeholders | #737373 |
| --border-color | Borders, dividers, card outlines, and input borders | #e5e5e5 |
| --accent-color | Primary action buttons, selected states, and focus indicators | #1a1a1a |
| --accent-text-color | Text color on accent-colored backgrounds | #ffffff |
| --border-radius | Corner rounding for cards, buttons, and input fields | 8px |

### Inherited Properties

The component inherits these CSS properties from its parent element:
- `font-family` — Typography style
- `color` — Text color
- `line-height` — Text spacing

## Extending in Code

### Custom API Integration

Replace the Greenhouse API with your own job board API:

```typescript
// Modify the fetch logic to use your custom endpoint
const fetchJobs = async () => {
  const response = await fetch(`https://your-api.com/jobs?token=${boardToken}`);
  const data = await response.json();
  // Transform your API response to match the expected job structure
  return data.jobs.map(job => ({
    id: job.id,
    title: job.title,
    department: job.department.name,
    location: job.location.name,
    absolute_url: job.apply_url
  }));
};
```

### Custom Filter Logic

Add additional filters beyond department and location:

```typescript
// Add a job type filter (Full-time, Part-time, Contract)
const [jobTypeFilter, setJobTypeFilter] = useState('all');

const filteredJobs = jobs.filter(job => {
  const matchesDepartment = !departmentFilter || job.department === departmentFilter;
  const matchesLocation = !locationFilter || job.location === locationFilter;
  const matchesJobType = jobTypeFilter === 'all' || job.metadata?.job_type === jobTypeFilter;
  return matchesDepartment && matchesLocation && matchesJobType;
});
```

## Dependencies

No external dependencies.