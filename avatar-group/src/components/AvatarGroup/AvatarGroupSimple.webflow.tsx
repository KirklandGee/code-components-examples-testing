import AvatarGroup from "./AvatarGroup";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./AvatarGroup.css";

export default declareComponent(AvatarGroup, {
  name: "AvatarGroup (Simple)",
  description: "A flexible avatar component that displays user profile images in circular containers with configurable sizes (small, medium, large, extra-large). When no image is provided, automatically generates initials from a name prop with a colored background. Supports both single avatar and group modes, where group mode overlaps multiple avatars horizontally with configurable overlap spacing. When the group exceeds a maximum count, displays a '+N' overflow indicator. Features an optional status indicator dot (online green, offline gray, busy red) positioned at the bottom-right corner. Includes optional border ring styling for enhanced visual separation.",
  group: "Content",
  options: {
    ssr: false,
    applyTagSelectors: false
  },
  props: {
    id: props.Id({
      name: "Element ID",
      group: "Settings",
      tooltip: "HTML ID attribute for targeting with CSS or JavaScript"
    }),
    avatar1Image: props.Image({
      name: "Image",
      group: "Avatar 1",
      tooltip: "First avatar image URL"
    }),
    avatar1Name: props.Text({
      name: "Name",
      defaultValue: "John Doe",
      group: "Avatar 1",
      tooltip: "First avatar name for initials fallback"
    }),
    avatar1Visible: props.Visibility({
      name: "Visible",
      group: "Avatar 1",
      tooltip: "Show or hide the first avatar"
    }),
    avatar2Image: props.Image({
      name: "Image",
      group: "Avatar 2",
      tooltip: "Second avatar image URL"
    }),
    avatar2Name: props.Text({
      name: "Name",
      defaultValue: "Jane Smith",
      group: "Avatar 2",
      tooltip: "Second avatar name for initials fallback"
    }),
    avatar2Visible: props.Visibility({
      name: "Visible",
      group: "Avatar 2",
      tooltip: "Show or hide the second avatar"
    }),
    avatar3Image: props.Image({
      name: "Image",
      group: "Avatar 3",
      tooltip: "Third avatar image URL"
    }),
    avatar3Name: props.Text({
      name: "Name",
      defaultValue: "Mike Johnson",
      group: "Avatar 3",
      tooltip: "Third avatar name for initials fallback"
    }),
    avatar3Visible: props.Visibility({
      name: "Visible",
      group: "Avatar 3",
      tooltip: "Show or hide the third avatar"
    }),
    avatar4Image: props.Image({
      name: "Image",
      group: "Avatar 4",
      tooltip: "Fourth avatar image URL"
    }),
    avatar4Name: props.Text({
      name: "Name",
      defaultValue: "Sarah Williams",
      group: "Avatar 4",
      tooltip: "Fourth avatar name for initials fallback"
    }),
    avatar4Visible: props.Visibility({
      name: "Visible",
      group: "Avatar 4",
      tooltip: "Show or hide the fourth avatar"
    }),
    avatar5Image: props.Image({
      name: "Image",
      group: "Avatar 5",
      tooltip: "Fifth avatar image URL"
    }),
    avatar5Name: props.Text({
      name: "Name",
      defaultValue: "David Brown",
      group: "Avatar 5",
      tooltip: "Fifth avatar name for initials fallback"
    }),
    avatar5Visible: props.Visibility({
      name: "Visible",
      group: "Avatar 5",
      tooltip: "Show or hide the fifth avatar"
    })
  }
});