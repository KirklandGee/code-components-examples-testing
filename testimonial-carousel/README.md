# TestimonialCarousel

A responsive testimonial carousel powered by Swiper.js that displays customer testimonials in card format.

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
| ID | Id | — | HTML ID attribute for the carousel container |
| Heading | TextNode | What Our Customers Say | Main heading displayed above the carousel |
| Subheading | Text | Trusted by thousands of satisfied customers worldwide | Subheading text below the main heading |
| Show Navigation | Boolean | true | Show or hide the prev/next arrow buttons |
| Show Pagination | Boolean | true | Show or hide the dot pagination indicators |
| Enable Autoplay | Boolean | true | Enable automatic slide progression |
| Autoplay Delay | Number | 5000 | Delay between slide transitions in milliseconds |
| Testimonial 1 Text | RichText | This product has completely transformed how we work. The team is responsive and the features are exactly what we needed. | First testimonial quote text |
| Testimonial 1 Author Name | Text | Sarah Johnson | First testimonial author name |
| Testimonial 1 Author Role | Text | Marketing Director | First testimonial author job title |
| Testimonial 1 Author Company | Text | TechCorp Inc. | First testimonial author company name |
| Testimonial 1 Avatar | Image | — | First testimonial author avatar image URL |
| Testimonial 1 Visible | Visibility | — | Show or hide the first testimonial |
| Testimonial 2 Text | RichText | Outstanding service and support. We've seen a 300% increase in productivity since implementing this solution. | Second testimonial quote text |
| Testimonial 2 Author Name | Text | Michael Chen | Second testimonial author name |
| Testimonial 2 Author Role | Text | CEO | Second testimonial author job title |
| Testimonial 2 Author Company | Text | Growth Solutions | Second testimonial author company name |
| Testimonial 2 Avatar | Image | — | Second testimonial author avatar image URL |
| Testimonial 2 Visible | Visibility | — | Show or hide the second testimonial |
| Testimonial 3 Text | RichText | The best investment we've made this year. Intuitive, powerful, and reliable. Highly recommended! | Third testimonial quote text |
| Testimonial 3 Author Name | Text | Emily Rodriguez | Third testimonial author name |
| Testimonial 3 Author Role | Text | Product Manager | Third testimonial author job title |
| Testimonial 3 Author Company | Text | Innovate Labs | Third testimonial author company name |
| Testimonial 3 Avatar | Image | — | Third testimonial author avatar image URL |
| Testimonial 3 Visible | Visibility | — | Show or hide the third testimonial |
| Testimonial 4 Text | RichText | Exceptional quality and attention to detail. Our clients have noticed the difference immediately. | Fourth testimonial quote text |
| Testimonial 4 Author Name | Text | David Thompson | Fourth testimonial author name |
| Testimonial 4 Author Role | Text | Operations Lead | Fourth testimonial author job title |
| Testimonial 4 Author Company | Text | Premier Services | Fourth testimonial author company name |
| Testimonial 4 Avatar | Image | — | Fourth testimonial author avatar image URL |
| Testimonial 4 Visible | Visibility | — | Show or hide the fourth testimonial |
| Testimonial 5 Text | RichText | A game-changer for our business. Simple to use yet incredibly powerful. Worth every penny. | Fifth testimonial quote text |
| Testimonial 5 Author Name | Text | Jessica Williams | Fifth testimonial author name |
| Testimonial 5 Author Role | Text | Founder | Fifth testimonial author job title |
| Testimonial 5 Author Company | Text | Startup Studio | Fifth testimonial author company name |
| Testimonial 5 Avatar | Image | — | Fifth testimonial author avatar image URL |
| Testimonial 5 Visible | Visibility | — | Show or hide the fifth testimonial |

## Styling

This component automatically adapts to your Webflow site's design system through site variables and inherited properties.

### Site Variables

To match your site's design system, define these CSS variables in your Webflow project settings. The component will use the fallback values shown below until you configure them.

| Site Variable | What It Controls | Fallback |
|---------------|------------------|----------|
| --background-primary | Card backgrounds and navigation button backgrounds | #ffffff |
| --background-secondary | Navigation button hover states | #f5f5f5 |
| --text-primary | Main text, headings, and author names | #1a1a1a |
| --text-secondary | Subheading, author role, and company text | #737373 |
| --border-color | Card borders, author section divider, and inactive pagination dots | #e5e5e5 |
| --accent-color | Quote icon color and active pagination dots | #1a1a1a |
| --border-radius | Card and button corner rounding | 8px |

### Inherited Properties

The component inherits these CSS properties from its parent element:
- `font-family` — Typography style
- `color` — Text color
- `line-height` — Text spacing

## Extending in Code

### Adjusting Responsive Breakpoints

Modify the number of slides shown at different screen sizes by editing the Swiper configuration:

```typescript
const swiperConfig = {
  breakpoints: {
    320: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 4 } // Show 4 testimonials on large screens
  }
}
```

### Customizing Transition Effects

Change the slide transition effect by modifying the Swiper effect property:

```typescript
const swiperConfig = {
  effect: 'fade', // Options: 'slide', 'fade', 'cube', 'coverflow', 'flip'
  fadeEffect: {
    crossFade: true
  }
}
```

## Dependencies

- **swiper** — Modern mobile touch slider with hardware accelerated transitions