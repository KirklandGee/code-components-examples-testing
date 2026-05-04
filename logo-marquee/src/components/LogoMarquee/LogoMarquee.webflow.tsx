import LogoMarquee from "./LogoMarquee";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./LogoMarquee.css";

export default declareComponent(LogoMarquee, {
  name: "LogoMarquee",
  description: "An infinite horizontal scrolling strip of client / partner / press logos — the classic 'trusted by' trust bar. Uses a pure-CSS keyframe animation (no JavaScript tick) with a duplicated row so the loop is seamless. Configurable direction (left or right), speed in seconds-per-loop, pause on hover, optional grayscale filter that restores color on hover, and optional fade-to-transparent edges via a CSS mask. Each of the 12 logo slots accepts an image, optional link, and individual visibility toggle so designers can trim unused slots. Logos are sized to a configurable height with auto width, so any aspect ratio stays balanced. Optional heading above the marquee (e.g. 'Trusted by teams at 500+ companies'). Responsive: speeds up and tightens gaps on narrow screens so the marquee never looks empty. Respects prefers-reduced-motion by pausing the animation for users who've opted out of motion.",
  group: "Marketing",
  options: {
    ssr: false,
    applyTagSelectors: true
  },
  props: {
    id: props.Id({
      name: "Element ID",
      group: "Settings",
      tooltip: "HTML ID for targeting with CSS or JavaScript"
    }),
    heading: props.TextNode({
      name: "Heading",
      defaultValue: "Trusted by teams at",
      group: "Content",
      tooltip: "Optional heading above the logo strip (e.g. 'Trusted by')"
    }),
    showHeading: props.Boolean({
      name: "Show Heading",
      defaultValue: true,
      group: "Display",
      tooltip: "Show or hide the heading"
    }),
    direction: props.Variant({
      name: "Direction",
      options: ["left", "right"],
      defaultValue: "left",
      group: "Behavior",
      tooltip: "Direction of the marquee scroll"
    }),
    speed: props.Number({
      name: "Speed",
      defaultValue: 40,
      group: "Behavior",
      tooltip: "Duration of one full loop in seconds — lower is faster"
    }),
    pauseOnHover: props.Boolean({
      name: "Pause on Hover",
      defaultValue: true,
      group: "Behavior",
      tooltip: "Pause the animation while the user is hovering the marquee"
    }),
    grayscale: props.Boolean({
      name: "Grayscale",
      defaultValue: true,
      group: "Style",
      tooltip: "Render logos in grayscale; they regain color on hover"
    }),
    fadeEdges: props.Boolean({
      name: "Fade Edges",
      defaultValue: true,
      group: "Style",
      tooltip: "Fade the left and right edges to transparent using a CSS mask"
    }),
    logoHeight: props.Number({
      name: "Logo Height",
      defaultValue: 40,
      group: "Style",
      tooltip: "Height of each logo in pixels (width scales proportionally)"
    }),
    logoGap: props.Number({
      name: "Logo Gap",
      defaultValue: 64,
      group: "Style",
      tooltip: "Gap between logos in pixels"
    }),
    ariaLabel: props.Text({
      name: "ARIA Label",
      defaultValue: "Partner and customer logos",
      group: "Settings",
      tooltip: "Accessible label describing the marquee for screen readers"
    }),
    logo1: props.Image({
      name: "Logo 1",
      group: "Logo 1",
      tooltip: "First logo image"
    }),
    logo1Link: props.Link({
      name: "Logo 1 Link",
      group: "Logo 1",
      tooltip: "Optional link for the first logo"
    }),
    logo1Visible: props.Visibility({
      name: "Logo 1 Visible",
      group: "Logo 1",
      tooltip: "Show or hide the first logo"
    }),
    logo2: props.Image({
      name: "Logo 2",
      group: "Logo 2",
      tooltip: "Second logo image"
    }),
    logo2Link: props.Link({
      name: "Logo 2 Link",
      group: "Logo 2",
      tooltip: "Optional link for the second logo"
    }),
    logo2Visible: props.Visibility({
      name: "Logo 2 Visible",
      group: "Logo 2",
      tooltip: "Show or hide the second logo"
    }),
    logo3: props.Image({
      name: "Logo 3",
      group: "Logo 3",
      tooltip: "Third logo image"
    }),
    logo3Link: props.Link({
      name: "Logo 3 Link",
      group: "Logo 3",
      tooltip: "Optional link for the third logo"
    }),
    logo3Visible: props.Visibility({
      name: "Logo 3 Visible",
      group: "Logo 3",
      tooltip: "Show or hide the third logo"
    }),
    logo4: props.Image({
      name: "Logo 4",
      group: "Logo 4",
      tooltip: "Fourth logo image"
    }),
    logo4Link: props.Link({
      name: "Logo 4 Link",
      group: "Logo 4",
      tooltip: "Optional link for the fourth logo"
    }),
    logo4Visible: props.Visibility({
      name: "Logo 4 Visible",
      group: "Logo 4",
      tooltip: "Show or hide the fourth logo"
    }),
    logo5: props.Image({
      name: "Logo 5",
      group: "Logo 5",
      tooltip: "Fifth logo image"
    }),
    logo5Link: props.Link({
      name: "Logo 5 Link",
      group: "Logo 5",
      tooltip: "Optional link for the fifth logo"
    }),
    logo5Visible: props.Visibility({
      name: "Logo 5 Visible",
      group: "Logo 5",
      tooltip: "Show or hide the fifth logo"
    }),
    logo6: props.Image({
      name: "Logo 6",
      group: "Logo 6",
      tooltip: "Sixth logo image"
    }),
    logo6Link: props.Link({
      name: "Logo 6 Link",
      group: "Logo 6",
      tooltip: "Optional link for the sixth logo"
    }),
    logo6Visible: props.Visibility({
      name: "Logo 6 Visible",
      group: "Logo 6",
      tooltip: "Show or hide the sixth logo"
    }),
    logo7: props.Image({
      name: "Logo 7",
      group: "Logo 7",
      tooltip: "Seventh logo image"
    }),
    logo7Link: props.Link({
      name: "Logo 7 Link",
      group: "Logo 7",
      tooltip: "Optional link for the seventh logo"
    }),
    logo7Visible: props.Visibility({
      name: "Logo 7 Visible",
      group: "Logo 7",
      tooltip: "Show or hide the seventh logo"
    }),
    logo8: props.Image({
      name: "Logo 8",
      group: "Logo 8",
      tooltip: "Eighth logo image"
    }),
    logo8Link: props.Link({
      name: "Logo 8 Link",
      group: "Logo 8",
      tooltip: "Optional link for the eighth logo"
    }),
    logo8Visible: props.Visibility({
      name: "Logo 8 Visible",
      group: "Logo 8",
      tooltip: "Show or hide the eighth logo"
    }),
    logo9: props.Image({
      name: "Logo 9",
      group: "Logo 9",
      tooltip: "Ninth logo image"
    }),
    logo9Link: props.Link({
      name: "Logo 9 Link",
      group: "Logo 9",
      tooltip: "Optional link for the ninth logo"
    }),
    logo9Visible: props.Visibility({
      name: "Logo 9 Visible",
      group: "Logo 9",
      tooltip: "Show or hide the ninth logo"
    }),
    logo10: props.Image({
      name: "Logo 10",
      group: "Logo 10",
      tooltip: "Tenth logo image"
    }),
    logo10Link: props.Link({
      name: "Logo 10 Link",
      group: "Logo 10",
      tooltip: "Optional link for the tenth logo"
    }),
    logo10Visible: props.Visibility({
      name: "Logo 10 Visible",
      group: "Logo 10",
      tooltip: "Show or hide the tenth logo"
    }),
    logo11: props.Image({
      name: "Logo 11",
      group: "Logo 11",
      tooltip: "Eleventh logo image"
    }),
    logo11Link: props.Link({
      name: "Logo 11 Link",
      group: "Logo 11",
      tooltip: "Optional link for the eleventh logo"
    }),
    logo11Visible: props.Visibility({
      name: "Logo 11 Visible",
      group: "Logo 11",
      tooltip: "Show or hide the eleventh logo"
    }),
    logo12: props.Image({
      name: "Logo 12",
      group: "Logo 12",
      tooltip: "Twelfth logo image"
    }),
    logo12Link: props.Link({
      name: "Logo 12 Link",
      group: "Logo 12",
      tooltip: "Optional link for the twelfth logo"
    }),
    logo12Visible: props.Visibility({
      name: "Logo 12 Visible",
      group: "Logo 12",
      tooltip: "Show or hide the twelfth logo"
    }),
  },
});