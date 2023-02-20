import { NextApiRequest, NextApiResponse } from "next"

export default async function downloadReportsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  // User with id exists
	const url = 'https://api.datacite.org/dois/text/xml?query=%22german+internet+panel%22&data-center-id=gesis.gesis&style=apa&page[size]=200'
	const data = await fetch(url)
	res.setHeader('Content-Disposition',  'attachment; filename="report.txt"')
  return res.status(200).json(data)
}