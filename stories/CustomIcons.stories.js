import { Gantt } from "../src";

import { CustomIcons } from "./CustomIcons";

const Template = props => {
  return <CustomIcons {...props} />;
};

export default {
  title: "CustomIcons",
  component: Gantt,
};

export const CustomIcons = {
  render: Template.bind({}),
  name: "CustomIcons",
};
