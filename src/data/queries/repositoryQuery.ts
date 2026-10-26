import { Repository } from 'src/data/types'
import { DATACITE_API_URL, DATACITE_API_HEADERS } from 'src/data/constants'
import { mapJsonToRepository } from 'src/utils/helpers'

function convertToQueryData(repository: any): QueryData {
  return {
    repository: mapJsonToRepository(repository)
  }
}

export async function fetchRepository(id: string) {
  try {
    const options = {
      method: 'GET',
      headers: { ...DATACITE_API_HEADERS, accept: 'application/vnd.api+json' }
    }

    const res = await fetch(`${DATACITE_API_URL}/reference-repositories/${id}`, options)

    if (!res.ok)
      throw new Error(`API returned ${res.status}`)

    const json = await res.json()

    const data = convertToQueryData(json.data)
    return { data }
  } catch (error) {
    return { error }
  }
}

export interface QueryData {
  repository: Repository
}

export interface QueryVar {
  id: string
}
