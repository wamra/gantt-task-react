import React from "react";

import { ColumnProps } from "../../../types";

export const DependenciesColumn: React.FC<ColumnProps> = ({
  data: { dependencies },
}) => {
  return <>{dependencies.map(({ name }) => name).join(", ")}</>;
};
