import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import { CONTENT_GQL, Search } from './Search';

const mocks = [
  {
    request: {
      query: CONTENT_GQL,
      variables: {
        query: '',
        cursor: ''
      },
    },
    result: {
      data: {
        works: {
          nodes: [
            {
              id: 'https://handle.test.datacite.org/10.24427/141E-N846',
              doi: '10.24427/141E-N846' ,
              titles: [{
                title: "This is a test service."
              }],
              descriptions: [{
                description: "This test service is rendered using mocked data.",
                descriptionType: ""
              }],
              creators: [{
                name: "Example Inc"
              }],
              citationCount: 2,
              viewCount: 5,
              downloadCount: 10
            },
            {
              id: 'https://handle.test.datacite.org/10.24427/8gt9-nk59',
              doi: '10.24427/8gt9-nk59' ,
              titles: [{
                title: "This is a test service."
              }],
              descriptions: [{
                description: "This test service is rendered using mocked data.",
                descriptionType: ""
              }],
              creators: [{
                name: "Acme Inc"
              }],
              citationCount: 1,
              viewCount: 6,
              downloadCount: 13
            }],
            pageInfo: {
              endCursor: "NA",
              hasNextPage: false,
            },
            totalCount: 2,
            resourceTypes: [{
              id: "dataset",
              title: "Dataset",
              count: 2
            }],
            published: [{
              id: "2020",
              title: "2020",
              count: 2
            }],
            registrationAgencies: [{
              id: "datacite",
              title: "DataCite",
              count: 2
            }],
        }
      },
    },
  },
];


test('renders', async () => {
  const { container } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Search />
    </MockedProvider>
  );

  expect(container).toMatchSnapshot();

  // wait for content
  await waitFor(()=> container);

  // take a snapshot of the rendered content (error or data)
  expect(container).toMatchSnapshot();
});
