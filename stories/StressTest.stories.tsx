import { Gantt } from "../src";

import { StressTest } from "./StressTest";

// eslint-disable-next-line
const Template = (props: any) => {
  return <StressTest {...props} />;
};

export default {
  title: "StressTest",
  component: Gantt,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  argTypes: {
    numberOfRoots: {
      control: "number",
    },

    numberOfSubtasks: {
      control: "number",
    },

    depth: {
      control: "number",
    },
  },

  args: {
    numberOfRoots: 4,
    numberOfSubtasks: 4,
    depth: 4,
  },
};

export const StressTestGantt = {
  render: Template.bind({}),
  name: "StressTest",
};
