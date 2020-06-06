import React from "react";
import { render } from "@testing-library/react";
import Layout from "./Layout";

test('renders layout', () => {
  const { getByText } = render(<Layout title={'DataCite Commons'}/>)

  expect(getByText("DataCite Commons")).toBeInTheDocument()
});
