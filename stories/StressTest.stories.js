import { Gantt } from "../src";

import { StressTest } from "./StressTest";

const Template = props => {
  return <StressTest {...props} />;
};

export default {
  title: "StressTest",
  component: Gantt,

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

export const StressTest = {
  render: Template.bind({}),
  name: "StressTest",
};
