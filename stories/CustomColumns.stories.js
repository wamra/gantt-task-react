import { Gantt } from "../src";

import { CustomColumns } from "./CustomColumns";

const Template = props => {
  return <CustomColumns {...props} />;
};

export default {
  title: "CustomColumns",
  component: Gantt,
};

export const CustomColumns = {
  render: Template.bind({}),
  name: "CustomColumns",
};
