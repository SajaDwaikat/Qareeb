import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Button from "../Button";

describe("Button", () => {
  it("renders the button title", () => {
    const { getByText } = render(
      <Button title="Login" />
    );

    expect(getByText("Login")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const mockPress = jest.fn();

    const { getByText } = render(
      <Button
        title="Login"
        onPress={mockPress}
      />
    );

    fireEvent.press(getByText("Login"));

    expect(mockPress).toHaveBeenCalled();
  });

  it("does not crash without onPress", () => {
    const { getByText } = render(
      <Button title="Signup" />
    );

    fireEvent.press(getByText("Signup"));

    expect(getByText("Signup")).toBeTruthy();
  });
});