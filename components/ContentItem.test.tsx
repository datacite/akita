import React from 'react';
import { render } from '@testing-library/react';
import ContentItem from './ContentItem';

const exampleItem = {
    id: "https://handle.stage.datacite.org/10.21945/xs62-rp71",
    doi: "10.21945/xs62-rp71",
    url: "http://example.com",
    types: { resourceTypeGeneral: "Dataset", resourceType: "CSV file" },
    titles: [{ title: "Example title of the item" }],
    descriptions: [{ description: "Example description of the item." }],
    creators: [{ id: null, name: "Smith, John", givenName: "John", familyName: "Smith" }],
    publisher: "SURFsara",
    publicationYear: 2019,
    version: "1.0",
    citationCount: 4,
    viewCount: 8,
    downloadCount: 3
}

test('renders content item', () => {
  const { getByText } = render(<ContentItem item={exampleItem}/>);

  expect(getByText("Example title of the item")).toBeInTheDocument();
  expect(getByText("Example description of the item.")).toBeInTheDocument();
});
