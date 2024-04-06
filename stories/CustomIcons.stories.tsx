import { Gantt } from "../src";

import { CustomIcons } from "./CustomIcons";

// eslint-disable-next-line
const Template = (props: any) => {
  return <CustomIcons {...props} />;
};

export default {
  title: "CustomIcons",
  component: Gantt,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
};

export const CustomIconsGantt = {
  render: Template.bind({}),
  name: "CustomIcons",
};
