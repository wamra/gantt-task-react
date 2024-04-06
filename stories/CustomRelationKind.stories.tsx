import { Gantt } from "../src";

import { CustomRelationKind } from "./CustomRelationKind";

// eslint-disable-next-line
const Template = (props: any) => {
  return <CustomRelationKind {...props} />;
};

export default {
  title: "CustomRelationKind",
  component: Gantt,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
};

export const CustomRelationKindGantt = {
  render: Template.bind({}),
  name: "CustomRelationKind",
};
