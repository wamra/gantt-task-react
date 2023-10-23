import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { it } from "vitest";

it("renders without crashing", () => {
  ReactDOM.render(<App />, document.createElement("root"));
});
