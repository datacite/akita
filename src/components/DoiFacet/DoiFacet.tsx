import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons'
import { useRouter } from 'next/router'
import { DoiType } from '../DoiContainer/DoiContainer'
import Link from 'next/link'

type Props = {
  data: Facets
  model: string
  loading: boolean
}

interface Facets {
  published: ContentFacet[]
  resourceTypes: ContentFacet[]
  languages?: ContentFacet[]
  licenses?: ContentFacet[]
  repositories?: ContentFacet[]
  affiliations?: ContentFacet[]
  fieldsOfScience?: ContentFacet[]
  registrationAgencies?: ContentFacet[]
  nodes: DoiType[]
}

interface ContentFacet {
  id: string
  title: string
  count: number
}

const DoiFacet: React.FunctionComponent<Props> = ({
  data,
  model,
  loading,
}) => {
  const router = useRouter()
  if (loading) return <div className="col-md-3"></div>

  if (!loading && data.nodes.length == 0)
    return <div className="col-md-3"></div>

  function facetLink(param: string, value: string) {
    let url = '?'
    let icon = faSquare

    // get current query parameters from next router
    let params = new URLSearchParams(router.query as any)

    // delete person parameter
    params.delete(model)

    // delete cursor parameter
    params.delete('cursor')

    if (params.get(param) == value) {
      // if param is present, delete from query and use checked icon
      params.delete(param)
      icon = faCheckSquare
    } else {
      // otherwise replace param with new value and use unchecked icon
      params.set(param, value)
    }

    url += params.toString()
    return (
      <Link href={url}>
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
              <ul id="repository-facets">
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
export default DoiFacet