import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSquare,
  faCheckSquare
} from '@fortawesome/free-regular-svg-icons'
import { useRouter } from 'next/router'
import { WorkType } from '../../pages/doi.org/[...doi]'
import AuthorsFacet from '../AuthorsFacet/AuthorsFacet'
import Link from 'next/link'

type Props = {
  data: Facets
  model: string
  url: string
  loading: boolean
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
  nodes: WorkType[]
}

interface Facet {
  id: string
  title: string
  count: number
}

const WorkFacets: React.FunctionComponent<Props> = ({
  data,
  model,
  url,
  loading
}) => {
  const router = useRouter()

  if (loading) return <div className="col-md-3"></div>

  if (!loading && data.nodes.length == 0)
    return <div className="col-md-3"></div>

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
        <a>
          <FontAwesomeIcon icon={icon} />{' '}
        </a>
      </Link>
    )
  }

  return (
    <div className="panel panel-transparent">
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

      <div className="panel facets add">
        <div className="panel-body">
          <h4>Work Type</h4>
          <ul id="work-type-facets">
            {data.resourceTypes.map((facet) => (
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

      {data.licenses && data.licenses.length > 0 && (
        <div className="panel facets add">
          <div className="panel-body">
            <h4>License</h4>
            <ul id="license-facets">
              {data.licenses.map((facet) => (
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

      {model == "person"
        ? <AuthorsFacet authors={data.authors} title="Co-Authors" url={url} model={model} />
        : <AuthorsFacet authors={data.authors} title="Authors" url={url} model={model} />
      }

    </div>
  )
}
export default WorkFacets
