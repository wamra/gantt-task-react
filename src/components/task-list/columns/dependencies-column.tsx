import React from "react";

import { ColumnProps } from "../../../types/public-types";

export const DependenciesColumn: React.FC<ColumnProps> = ({
  data: {
    dependencies,
    colors
  },
}) => {
  return (
    <div style={{
      "color": colors.barLabelColor
    }}>
      {dependencies.map(({ name }) => name).join(', ')}
    </div>
  );
};
