import { RORV2Client } from 'src/data/clients/ror-v2-client'

const rorClient = new RORV2Client()
const FUNDREF_PREFIX = '10.13039/'

export async function fetchCrossrefFunder(crossrefFunderId: string) {
  const fundrefId = crossrefFunderId.startsWith(FUNDREF_PREFIX)
    ? crossrefFunderId.slice(FUNDREF_PREFIX.length)
    : crossrefFunderId

  const response = await rorClient.searchOrganizations({
    queryAdvanced: `external_ids.all:${fundrefId}`,
  })

  const rorId = response.items[0]?.id ?? null
  return { data: rorId ? { organization: { id: rorId } } : null }
}
