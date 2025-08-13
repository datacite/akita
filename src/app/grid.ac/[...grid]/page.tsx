import { notFound, redirect } from "next/navigation"
import { fetchGrid } from "src/data/queries/gridQuery"
import { rorFromUrl } from "src/utils/helpers"

interface Props {
  params: Promise<{ grid: string[] }>
}

export default async function GridPage(props: Props) {
  const params = await props.params;
  const gridId = 'grid.ac/' + params.grid.join('/')

  // Redirect to organization page
  const { data } = await fetchGrid({ gridId })

  if (!data) notFound()
  redirect(`/ror.org${rorFromUrl(data.organization.id)}`)
}
