import CarouselSlider from "./CarouselSlider";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./CarouselSlider.css";

export default declareComponent(CarouselSlider, {
  name: "CarouselSlider (Simple)",
  description: "An advanced carousel component that displays one slide at a time with smooth transitions between slides. Each slide is a card containing an image, title, description, and optional CTA button with link. Features navigation arrows on both sides, dot indicators below for position tracking, and supports auto-play with pause-on-hover. Offers configurable transition effects (slide or fade), aspect ratios, and loop mode. Responsive design displays full-width slides on mobile and optionally shows a peek of adjacent slides on desktop. Supports touch/swipe gestures for mobile interaction and can accommodate 2-12 slides with individual visibility controls.",
  group: "Interactive",
  options: {
    ssr: false,
    applyTagSelectors: true
  },
  props: {
    id: props.Id({
      name: "Element ID",
      group: "Settings",
      tooltip: "HTML ID attribute for targeting and accessibility"
    }),
    slide1Visible: props.Visibility({
      name: "Visible",
      group: "Slide 1",
      tooltip: "Show or hide slide 1"
    }),
    slide1Image: props.Image({
      name: "Image",
      group: "Slide 1",
      tooltip: "Slide 1 background or featured image"
    }),
    slide1Title: props.Text({
      name: "Title",
      defaultValue: "Discover Amazing Features",
      group: "Slide 1",
      tooltip: "Slide 1 main heading text"
    }),
    slide1CtaText: props.Text({
      name: "CTA Text",
      defaultValue: "Learn More",
      group: "Slide 1",
      tooltip: "Slide 1 call-to-action button text"
    }),
    slide1CtaLink: props.Link({
      name: "CTA Link",
      group: "Slide 1",
      tooltip: "Slide 1 call-to-action button link"
    }),
    slide2Visible: props.Visibility({
      name: "Visible",
      group: "Slide 2",
      tooltip: "Show or hide slide 2"
    }),
    slide2Image: props.Image({
      name: "Image",
      group: "Slide 2",
      tooltip: "Slide 2 background or featured image"
    }),
    slide2Title: props.Text({
      name: "Title",
      defaultValue: "Built for Performance",
      group: "Slide 2",
      tooltip: "Slide 2 main heading text"
    }),
    slide2CtaText: props.Text({
      name: "CTA Text",
      defaultValue: "Get Started",
      group: "Slide 2",
      tooltip: "Slide 2 call-to-action button text"
    }),
    slide2CtaLink: props.Link({
      name: "CTA Link",
      group: "Slide 2",
      tooltip: "Slide 2 call-to-action button link"
    }),
    slide3Visible: props.Visibility({
      name: "Visible",
      group: "Slide 3",
      tooltip: "Show or hide slide 3"
    }),
    slide3Image: props.Image({
      name: "Image",
      group: "Slide 3",
      tooltip: "Slide 3 background or featured image"
    }),
    slide3Title: props.Text({
      name: "Title",
      defaultValue: "Trusted by Thousands",
      group: "Slide 3",
      tooltip: "Slide 3 main heading text"
    }),
    slide3CtaText: props.Text({
      name: "CTA Text",
      defaultValue: "View Testimonials",
      group: "Slide 3",
      tooltip: "Slide 3 call-to-action button text"
    }),
    slide3CtaLink: props.Link({
      name: "CTA Link",
      group: "Slide 3",
      tooltip: "Slide 3 call-to-action button link"
    }),
    slide4Visible: props.Visibility({
      name: "Visible",
      group: "Slide 4",
      tooltip: "Show or hide slide 4"
    }),
    slide4Image: props.Image({
      name: "Image",
      group: "Slide 4",
      tooltip: "Slide 4 background or featured image"
    }),
    slide4Title: props.Text({
      name: "Title",
      defaultValue: "Seamless Integration",
      group: "Slide 4",
      tooltip: "Slide 4 main heading text"
    }),
    slide4CtaText: props.Text({
      name: "CTA Text",
      defaultValue: "Explore Integrations",
      group: "Slide 4",
      tooltip: "Slide 4 call-to-action button text"
    }),
    slide4CtaLink: props.Link({
      name: "CTA Link",
      group: "Slide 4",
      tooltip: "Slide 4 call-to-action button link"
    }),
    slide5Visible: props.Visibility({
      name: "Visible",
      group: "Slide 5",
      tooltip: "Show or hide slide 5"
    }),
    slide5Image: props.Image({
      name: "Image",
      group: "Slide 5",
      tooltip: "Slide 5 background or featured image"
    }),
    slide5Title: props.Text({
      name: "Title",
      defaultValue: "Enterprise Ready",
      group: "Slide 5",
      tooltip: "Slide 5 main heading text"
    }),
    slide5CtaText: props.Text({
      name: "CTA Text",
      defaultValue: "Contact Sales",
      group: "Slide 5",
      tooltip: "Slide 5 call-to-action button text"
    }),
    slide5CtaLink: props.Link({
      name: "CTA Link",
      group: "Slide 5",
      tooltip: "Slide 5 call-to-action button link"
    }),
    slide6Visible: props.Visibility({
      name: "Visible",
      group: "Slide 6",
      tooltip: "Show or hide slide 6"
    }),
    slide6Image: props.Image({
      name: "Image",
      group: "Slide 6",
      tooltip: "Slide 6 background or featured image"
    }),
    slide6Title: props.Text({
      name: "Title",
      defaultValue: "24/7 Support",
      group: "Slide 6",
      tooltip: "Slide 6 main heading text"
    }),
    slide6CtaText: props.Text({
      name: "CTA Text",
      defaultValue: "Get Support",
      group: "Slide 6",
      tooltip: "Slide 6 call-to-action button text"
    }),
    slide6CtaLink: props.Link({
      name: "CTA Link",
      group: "Slide 6",
      tooltip: "Slide 6 call-to-action button link"
    })
  }
});