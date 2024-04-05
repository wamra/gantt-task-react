import { Gantt } from "../src";

import { CriticalPath } from "./CriticalPath";

const Template = props => {
  return <CriticalPath {...props} />;
};

export default {
  title: "CriticalPath",
  component: Gantt,
};

export const CriticalPath = {
  render: Template.bind({}),
  name: "CriticalPath",
};
