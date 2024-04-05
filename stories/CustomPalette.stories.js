import { Gantt } from "../src";

import { CustomPalette } from "./CustomPalette";

const Template = props => {
  return <CustomPalette {...props} />;
};

export default {
  title: "CustomPalette",
  component: Gantt,
};

export const CustomPalette = {
  render: Template.bind({}),
  name: "CustomPalette",
};
