import { Gantt } from "../src";

import { Warnings } from "./Warnings";
import React from "react";

const Template = (props: any) => {
  return <Warnings {...props} />;
};

export default {
  title: "Warnings",
  component: Gantt,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
};

export const WarningsGantt = {
  render: Template.bind({}),
  name: "Warnings",
};
