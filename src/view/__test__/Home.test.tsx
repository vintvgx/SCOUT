import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { Provider } from "react-redux";
import Home from "../Home";
import store from "../../redux/store";
import { fetchProjects } from "../../redux/slices/SentryDataSlice";

jest.mock("../../redux/slices/SentryDataSlice", () => ({
  ...jest.requireActual("../../redux/slices/SentryDataSlice"),
  fetchProjects: jest.fn(() => ({
    type: "issues/fetchProjects/fulfilled",
    payload: [{ id: "1", name: "Test Project", issues: [], errors: [] }],
  })),
}));

test("renders projects and handles refresh", () => {
  render(
    <Provider store={store}>
      <Home />
    </Provider>
  );

  expect(screen.getByText("Test Project")).toBeTruthy();

  fireEvent(screen.getByText("Test Project"), "press");
  expect(fetchProjects).toHaveBeenCalled();
});
