import TestimonialCarousel from "./TestimonialCarousel";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./TestimonialCarousel.css";

export default declareComponent(TestimonialCarousel, {
  name: "TestimonialCarousel (Simple)",
  description: "A responsive testimonial carousel powered by Swiper.js that displays customer testimonials in card format. Each card features a decorative quote icon at the top, the testimonial text, and author information below including name, role, company, and an optional avatar image. The carousel shows 1 slide on mobile, 2 on tablet, and 3 on desktop. Includes navigation arrows for manual control, dot pagination indicators at the bottom, and autoplay functionality with configurable delay that pauses on hover. Supports up to 5 testimonial slots with individual visibility controls.",
  group: "Marketing",
  options: {
    ssr: false,
    applyTagSelectors: true
  },
  props: {
    id: props.Id({
      name: "Element ID",
      group: "Settings",
      tooltip: "HTML ID attribute for the carousel container"
    }),
    heading: props.TextNode({
      name: "Heading",
      defaultValue: "What Our Customers Say",
      group: "Content",
      tooltip: "Main heading displayed above the carousel"
    }),
    testimonial1Text: props.RichText({
      name: "Text",
      group: "Testimonial 1",
      tooltip: "First testimonial quote text"
    }),
    testimonial1AuthorName: props.Text({
      name: "Author Name",
      defaultValue: "Sarah Johnson",
      group: "Testimonial 1",
      tooltip: "First testimonial author name"
    }),
    testimonial1Avatar: props.Image({
      name: "Avatar",
      group: "Testimonial 1",
      tooltip: "First testimonial author avatar image"
    }),
    testimonial1Visible: props.Visibility({
      name: "Visible",
      group: "Testimonial 1",
      tooltip: "Show or hide the first testimonial"
    }),
    testimonial2Text: props.RichText({
      name: "Text",
      group: "Testimonial 2",
      tooltip: "Second testimonial quote text"
    }),
    testimonial2AuthorName: props.Text({
      name: "Author Name",
      defaultValue: "Michael Chen",
      group: "Testimonial 2",
      tooltip: "Second testimonial author name"
    }),
    testimonial2Avatar: props.Image({
      name: "Avatar",
      group: "Testimonial 2",
      tooltip: "Second testimonial author avatar image"
    }),
    testimonial2Visible: props.Visibility({
      name: "Visible",
      group: "Testimonial 2",
      tooltip: "Show or hide the second testimonial"
    }),
    testimonial3Text: props.RichText({
      name: "Text",
      group: "Testimonial 3",
      tooltip: "Third testimonial quote text"
    }),
    testimonial3AuthorName: props.Text({
      name: "Author Name",
      defaultValue: "Emily Rodriguez",
      group: "Testimonial 3",
      tooltip: "Third testimonial author name"
    }),
    testimonial3Avatar: props.Image({
      name: "Avatar",
      group: "Testimonial 3",
      tooltip: "Third testimonial author avatar image"
    }),
    testimonial3Visible: props.Visibility({
      name: "Visible",
      group: "Testimonial 3",
      tooltip: "Show or hide the third testimonial"
    }),
    testimonial4Text: props.RichText({
      name: "Text",
      group: "Testimonial 4",
      tooltip: "Fourth testimonial quote text"
    }),
    testimonial4AuthorName: props.Text({
      name: "Author Name",
      defaultValue: "David Thompson",
      group: "Testimonial 4",
      tooltip: "Fourth testimonial author name"
    }),
    testimonial4Avatar: props.Image({
      name: "Avatar",
      group: "Testimonial 4",
      tooltip: "Fourth testimonial author avatar image"
    }),
    testimonial4Visible: props.Visibility({
      name: "Visible",
      group: "Testimonial 4",
      tooltip: "Show or hide the fourth testimonial"
    }),
    testimonial5Text: props.RichText({
      name: "Text",
      group: "Testimonial 5",
      tooltip: "Fifth testimonial quote text"
    }),
    testimonial5AuthorName: props.Text({
      name: "Author Name",
      defaultValue: "Jessica Williams",
      group: "Testimonial 5",
      tooltip: "Fifth testimonial author name"
    }),
    testimonial5Avatar: props.Image({
      name: "Avatar",
      group: "Testimonial 5",
      tooltip: "Fifth testimonial author avatar image"
    }),
    testimonial5Visible: props.Visibility({
      name: "Visible",
      group: "Testimonial 5",
      tooltip: "Show or hide the fifth testimonial"
    }),
  },
});