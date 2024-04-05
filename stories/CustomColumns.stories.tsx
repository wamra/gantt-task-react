import { Gantt } from "../src";

import { CustomColumns } from "./CustomColumns";
import React from "react";

const Template = (props: any) => {
  return <CustomColumns {...props} />;
};

export default {
  title: "CustomColumns",
  component: Gantt,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
};

export const CustomColumnsGantt = {
  render: Template.bind({}),
  name: "CustomColumns",
};
