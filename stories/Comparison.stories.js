import { Gantt } from "../src";

import { Comparison } from "./Comparison";

const Template = props => {
  return <Comparison {...props} />;
};

export default {
  title: "Comparison",
  component: Gantt,
};

export const Comparison = {
  render: Template.bind({}),
  name: "Comparison",
};
