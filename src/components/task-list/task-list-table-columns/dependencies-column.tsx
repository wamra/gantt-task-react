import React from "react";

import { ColumnProps } from "../../../types/public-types";

export const DependenciesColumn: React.FC<ColumnProps> = ({
  data: {
    dependencies,
  },
}) => {
  return (
    <>
      {dependencies.map(({ name }) => name).join(', ')}
    </>
  );
};
