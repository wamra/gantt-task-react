import { Gantt } from "../src";

import { Warnings } from "./Warnings";

const Template = props => {
  return <Warnings {...props} />;
};

export default {
  title: "Warnings",
  component: Gantt,
};

export const Warnings = {
  render: Template.bind({}),
  name: "Warnings",
};
