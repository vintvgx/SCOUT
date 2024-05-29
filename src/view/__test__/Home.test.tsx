import React from "react";
import { render } from "@testing-library/react-native";
import Home from "../Home";

jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

jest.mock("expo-notifications", () => {
  return {
    addNotificationResponseReceivedListener: jest.fn(),
  };
});

// Mock the useAppSelector and useDispatch hooks from redux
jest.mock("../../redux/store", () => ({
  useAppSelector: jest.fn().mockImplementation((selector) =>
    selector({
      issues: {
        projects: [
          { name: "Project 1", id: 1 },
          { name: "Project 2", id: 2 },
        ],
        projectsLoading: false,
      },
      register: {
        expoPushToken: "dummyToken",
      },
    })
  ),
  useDispatch: jest.fn(),
}));

describe("Home", () => {
  it("renders the home page with SCOUT text and projects", () => {
    const { getByText } = render(<Home />);

    // Check for SCOUT text
    expect(getByText("SCOUT")).toBeTruthy();

    // Check for projects
    expect(getByText("Project 1")).toBeTruthy();
    expect(getByText("Project 2")).toBeTruthy();
  });
});
