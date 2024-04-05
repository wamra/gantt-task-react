import { Gantt } from "../src";

import { Comparison } from "./Comparison";
import React from "react";
import { Meta, StoryObj } from "@storybook/react";

const Template = (props: any) => {
  return <Comparison {...props} />;
};

const meta: Meta<typeof Gantt> = {
  title: "Comparison",
  component: Gantt,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
}

export default meta;
type GanttStory = StoryObj<typeof Gantt>;

export const ComparisonGantt: GanttStory = {
  render: Template.bind({}),
  name: "Comparison",
};
