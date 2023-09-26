import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSquare,
  faCheckSquare
} from '@fortawesome/free-regular-svg-icons'
import { useRouter } from 'next/router'
import { WorkType } from '../../pages/doi.org/[...doi]'
import SearchBox from '../SearchBox/SearchBox'
import AuthorsFacet from '../AuthorsFacet/AuthorsFacet'
import Link from 'next/link'

type Props = {
  data: Facets
  model: string
  url: string
  loading: boolean
  connectionTypesCounts?: { references: number, citations: number, parts: number, partOf: number, /* other: number */ }
}

interface Facets {
  published: Facet[]
  resourceTypes: Facet[]
  languages?: Facet[]
  licenses?: Facet[]
  repositories?: Facet[]
  affiliations?: Facet[]
  fieldsOfScience?: Facet[]
  registrationAgencies?: Facet[]
  authors?: Facet[]
  creatorsAndContributors?: Facet[]
  nodes: WorkType[]
}

interface Facet {
  id: string
  title: string
  count: number
}

function removeOtherAndMissing(facet: Facet) {
  return facet.id !== '__other__' && facet.id !== '__missing__'
}

const WorkFacets: React.FunctionComponent<Props> = ({
  data,
  model,
  url,
  loading,
  connectionTypesCounts
}) => {
  const router = useRouter()

  if (loading) return <div className="col-md-3"></div>

  function facetLink(param: string, value: string) {
    let icon = faSquare

    // get current query parameters from next router
    const params = new URLSearchParams(router.query as any)

    // delete model and cursor parameters
    params.delete(model)
    params.delete('cursor')

    if (params.get(param) == value) {
      // if param is present, delete from query and use checked icon
      params.delete(param)
      icon = faCheckSquare
    } else {
      // otherwise replace param with new value and use unchecked icon
      params.set(param, value)
    }

    return (
      <Link href={url + params.toString()}>
        <a className={"facet-"+param}>
          <FontAwesomeIcon icon={icon} />{' '}
        </a>
      </Link>
    )
  }

  // remove %2F? at the end of url
  const path = url.substring(0, url.length - 2)

  const connectionTypeList: Facet[] = [
    { id: 'references', title: 'References', count: connectionTypesCounts.references },
    { id: 'citations', title: 'Citations', count: connectionTypesCounts.citations },
    { id: 'parts', title: 'Parts', count: connectionTypesCounts.parts },
    { id: 'partOf', title: 'Is Part Of', count: connectionTypesCounts.partOf },
    // { id: 'other', title: 'Other', count: connectionTypes.other }
  ]

  return (
    <div className="panel panel-transparent">
      {!['/doi.org?', '/orcid.org?', '/ror.org?'].includes(url) && (
        <div className="panel facets add">
          <div className="panel-body">
            <SearchBox path={path} />
          </div>
        </div>
      )}

      {model == "person"
        ? <AuthorsFacet authors={data.authors} title="Co-Authors" url={url} model={model} />
        : <AuthorsFacet authors={data.creatorsAndContributors} title="Creators & Contributors" url={url} model={model} />
      }

      {connectionTypesCounts && connectionTypesCounts.references +
      connectionTypesCounts.citations +
      connectionTypesCounts.parts +
      connectionTypesCounts.partOf // +
      // connectionTypes.other
       > 0 && (
      <div className="panel facets add">
        <div className="panel-body">
          <h4>Connection Types</h4>
          <ul id="connections-type-facets">
            {connectionTypeList.filter(f => f.count > 0).map((facet) => (
              <li key={facet.id}>
                {facetLink('connection-type', facet.id)}
                <div className="facet-title">{facet.title}</div>
                <span className="number pull-right">
                  {facet.count.toLocaleString('en-US')}
                </span>
                <div className="clearfix" />
              </li>
            ))}
          </ul>
        </div>
      </div>
      )}

      {data.published && data.published.length > 0 && (
      <div className="panel facets add">
        <div className="panel-body">
          <h4>Publication Year</h4>
          <ul id="published-facets">
            {data.published.map((facet) => (
              <li key={facet.id}>
                {facetLink('published', facet.id)}
                <div className="facet-title">{facet.title}</div>
                <span className="number pull-right">
                  {facet.count.toLocaleString('en-US')}
                </span>
                <div className="clearfix" />
              </li>
            ))}
          </ul>
        </div>
      </div>
      )}

      {data.resourceTypes && data.resourceTypes.length > 0 && (
      <div className="panel facets add">
        <div className="panel-body">
          <h4>Work Type</h4>
          <ul id="work-type-facets">
            {data.resourceTypes.filter(removeOtherAndMissing).map((facet) => (
              <li key={facet.id}>
                {facetLink('resource-type', facet.id)}
                <div className="facet-title">{facet.title}</div>
                <span className="number pull-right">
                  {facet.count.toLocaleString('en-US')}
                </span>
                <div className="clearfix" />
              </li>
            ))}
          </ul>
        </div>
      </div>
      )}

      {data.licenses && data.licenses.length > 0 && (
        <div className="panel facets add">
          <div className="panel-body">
            <h4>License</h4>
            <ul id="license-facets">
              {data.licenses.filter(removeOtherAndMissing).map((facet) => (
                <li key={facet.id}>
                  {facetLink('license', facet.id)}
                  <div className="facet-title">{facet.title}</div>
                  <span className="number pull-right">
                    {facet.count.toLocaleString('en-US')}
                  </span>
                  <div className="clearfix" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {data.languages && data.languages.length > 0 && (
        <div className="panel facets add">
          <div className="panel-body">
            <h4>Language</h4>
            <ul id="language-facets">
              {data.languages.map((facet) => (
                <li key={facet.id}>
                  {facetLink('language', facet.id)}
                  <div className="facet-title">{facet.title}</div>
                  <span className="number pull-right">
                    {facet.count.toLocaleString('en-US')}
                  </span>
                  <div className="clearfix" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {data.fieldsOfScience && data.fieldsOfScience.length > 0 && (
        <div className="panel facets add">
          <div className="panel-body">
            <h4>Field of Science</h4>
            <ul>
              {data.fieldsOfScience.map((facet) => (
                <li key={facet.id}>
                  {facetLink('field-of-science', facet.id)}
                  <div className="facet-title">{facet.title}</div>
                  <span className="number pull-right">
                    {facet.count.toLocaleString('en-US')}
                  </span>
                  <div className="clearfix" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {data.registrationAgencies && data.registrationAgencies.length > 0 && (
        <div className="panel facets add">
          <div className="panel-body">
            <h4>Registration Agency</h4>
            <ul id="registration-agency-facets">
              {data.registrationAgencies.map((facet) => (
                <li key={facet.id}>
                  {facetLink('registration-agency', facet.id)}
                  <div className="facet-title">{facet.title}</div>
                  <span className="number pull-right">
                    {facet.count.toLocaleString('en-US')}
                  </span>
                  <div className="clearfix" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  )
}
export default WorkFacets
