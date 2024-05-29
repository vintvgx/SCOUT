import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Header from "../Header";

describe("Header", () => {
  it("renders the SCOUT text", () => {
    const { getByText } = render(<Header onPress={() => {}} />);

    // Check for SCOUT text
    expect(getByText("SCOUT")).toBeTruthy();
  });

  it("calls onPress when the header is pressed", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Header onPress={onPressMock} />);

    fireEvent.press(getByText("SCOUT"));

    // Check if onPress function is called
    expect(onPressMock).toHaveBeenCalled();
  });
});
