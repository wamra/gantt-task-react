import type { MutableRefObject } from "react";
import { TaskOrEmpty } from "../../../types/public-types";

export type SensorContext = MutableRefObject<{
  items: TaskOrEmpty[];
  offset: number;
}>;
