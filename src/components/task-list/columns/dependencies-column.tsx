import React from "react";

import { ColumnProps } from "../../../types/public-types";

export const DependenciesColumn: React.FC<ColumnProps> = ({
  data: {
    dependencies,
    style
  },
}) => {
  return (
    <div style={{
      "color": style.barLabelColor
    }}>
      {dependencies.map(({ name }) => name).join(', ')}
    </div>
  );
};
