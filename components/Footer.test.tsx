import React from "react";
import { render } from "@testing-library/react";
import Footer from "./Footer";

test('renders footer', () => {
  const { getByText } = render(<Footer />)

  expect(getByText("About DataCite")).toBeInTheDocument()
  expect(getByText("Services")).toBeInTheDocument()
  expect(getByText("Resources")).toBeInTheDocument()
  expect(getByText("Community")).toBeInTheDocument()
});
