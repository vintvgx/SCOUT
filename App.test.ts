import React from "react";
import renderer from "react-test-renderer";
import App from "./App";
// const TestRenderer = require('react-test-renderer');

it("renders correctly", () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});
