import { gql } from '@apollo/client'
import { GetServerSideProps } from 'next'
import { rorFromUrl } from '../../utils/helpers'
import apolloClient from '../../utils/apolloClient'

export const GRID_GQL = gql`
  query getOrganizationQuery(
    $gridId: ID
  ) {
    organization(
      gridId: $gridId
    ) {
      id
    }
  }
`

interface GridQueryData {
  organization: GridType
}

interface GridType {
  id: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {	
  const gridId = 'grid.ac/' + (context.params.grid as String[]).join('/')	
  const { data } = await apolloClient.query({
    query: GRID_GQL,
    variables: { gridId }
  })

  context.res.statusCode = 302
  context.res.setHeader('Location', '/ror.org' + rorFromUrl(data.organization.id))
  return {props: {}}
}

function GridPage() {
  return null
}

export default GridPage