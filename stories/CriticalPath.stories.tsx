import { Gantt } from "../src";

import { CriticalPath } from "./CriticalPath";

const Template = (props: any) => {
  return <CriticalPath {...props} />;
};

export default {
  title: "CriticalPath",
  component: Gantt,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
};

export const CriticalPathGantt = {
  render: Template.bind({}),
  name: "CriticalPath",
};
