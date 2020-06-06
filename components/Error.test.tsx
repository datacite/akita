import React from "react";
import { render } from "@testing-library/react";
import Error from "./Error";

const errorTitle = "Error title"
const errorMessage = "An error has occured."

test('renders error', () => {
  const { getByText } = render(<Error title={errorTitle} message={errorMessage} />)

  expect(getByText("Error title")).toBeInTheDocument()
  expect(getByText("An error has occured.")).toBeInTheDocument()
});
