import { Gantt } from "../src";

import { CustomPalette } from "./CustomPalette";

// eslint-disable-next-line
const Template = (props: any) => {
  return <CustomPalette {...props} />;
};

export default {
  title: "CustomPalette",
  component: Gantt,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
};

export const CustomPaletteGantt = {
  render: Template.bind({}),
  name: "CustomPalette",
};
