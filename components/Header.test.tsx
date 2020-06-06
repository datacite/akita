import React from "react";
import { render } from "@testing-library/react";
import Header from "./Header";

test('renders header', () => {
  const { getByText } = render(<Header title={'DataCite Commons'}/>)

  expect(getByText("DataCite Commons")).toBeInTheDocument()
  expect(getByText("About")).toBeInTheDocument()
  expect(getByText("Support")).toBeInTheDocument()
});
