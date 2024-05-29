import { notFound, redirect } from "next/navigation"
import { GRID_GQL, QueryData, QueryVar } from "src/data/queries/gridQuery"
import apolloClient from "src/utils/apolloClient"
import { rorFromUrl } from "src/utils/helpers"

interface Props {
  params: { grid: string[] }
}

export default async function GridPage({ params }: Props) {
  const gridId = 'grid.ac/' + params.grid.join('/')

  // Redirect to organization page
  const { data } = await apolloClient.query<QueryData, QueryVar>({
    query: GRID_GQL,
    variables: { gridId },
    errorPolicy: 'all'
  })

  if (!data) notFound()
  redirect(`/ror.org${rorFromUrl(data.organization.id)}`)
}
