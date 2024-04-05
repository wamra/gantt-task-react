import { Gantt } from "../src";

import { CustomRelationKind } from "./CustomRelationKind";

const Template = props => {
  return <CustomRelationKind {...props} />;
};

export default {
  title: "CustomRelationKind",
  component: Gantt,
};

export const CustomRelationKind = {
  render: Template.bind({}),
  name: "CustomRelationKind",
};
