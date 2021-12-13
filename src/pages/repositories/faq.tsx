import React from 'react'
import Layout from '../../components/Layout/Layout'

const RepositoryFaqPage = () => {
  return (
    <Layout path={'/repositories'}>
      <div className="container-fluid">
        <div className='col-sm-8 col-sm-offset-2'>
          <h2 className="doi">FAQ</h2>

          <h4 className="repository">Why would I use Repository Finder?</h4>

          <p>Repository Finder was designed to make it easy for researchers to find repositories that accept deposit of research data.
            As a secondary goal, we hope the tool can help to promote good practices related to research data and serve as a reference
            for listing funder, publisher, and other repository recommendations.</p>

          <h4 className="repository">What is DataCite?</h4>

          <p><a href="https://www.datacite.org">DataCite</a> is an international, non-profit, member organization that has a goal of
    helping the research community locate, identify, and cite research data with confidence. They are the leading global
    provider of Digital Objects Identifiers (DOIs) for research data. DataCite hosts the Repository Finder tool.</p>

  <h4 className="repository">What is re3data?</h4>

  <p><a href="https://www.re3data.org">re3data</a> is a service of DataCite that provides a searchable and machine-actionable
    registry of research data repositories. The Repository Finder tool provides a front-end to re3data to simplify the interface
    for researchers to use to find an appropriate data repositories to deposit their data. The results from Repository Finder
    are linked to more detailed information and additional functionality that are also available in the native re3data interface.</p>

  <h4 className="repository">What does FAIR mean?</h4>

  <p>The FAIR Data Principles are a set of guiding principles in order to make data findable, accessible, interoperable and
    reusable (<a href="https://doi.org/10.1038/sdata.2016.18">Wilkinson et al., 2016</a>). The design and development of the tool was directly informed by the work of targeted
    adoption groups (TAGs) within the Enabling FAIR project and its resulting <a href="http://www.copdess.org/enabling-fair-data-project/commitment-to-enabling-fair-data-in-the-earth-space-and-environmental-sciences">commitment</a> statement.</p>

  <h4 className="repository">What criteria are used in determining relevance and order of results when searching by keyword?</h4>

  <p>The order of results is determined by the re3data search index. Search terms found in the repository name, subject area and
    keywords fields have higher relevance, to lesser extend also search terms found in the repository description.</p>

  <h4 className="repository">What criteria are used to include repositories in the Enabling FAIR for Earth and Space Sciences Community list?</h4>

  <p>The Enabling FAIR project brought together over 300 stakeholders in the earth and space sciences in a series of workshops
    and targeted adoption groups (TAGs) that included researchers, publishers, funders, repositories and data facilities,
    librarians, professional associations, and others in the research community. Their initial list of criteria include data
    repositories in the earth and space sciences domain that support open access, provide persistent identifiers, and accept
    data for deposit. Data repositories that have gone through a process to be certified as trustworthy, such as the
    Core Trust Seal, are highlighted. In the future, we hope to add additional lists of recommendations as they become available
    and are suggested.</p>

  <h4 className="repository">Why are there fewer repositories in Repository Finder compared to the re3data website?</h4>

  <p>Repository Finder only shows the repositories from [re3data](https://www.re3data.org) that allow data uploads (properties <em>open</em> or <em>restricted</em>).</p>

  <h4 className="repository">A repository that I expected to see isn&apos;t listed in the results. What can I do?</h4>

  <p>Repository Finder queries and provides results from re3data. New repositories and changes to repositories in re3data can
    be <a href="https://www.re3data.org/suggest">suggested</a> and incorporated to improve listing and relevance. If you are a repository manager,
    <a href="https://docs.google.com/document/d/1Va24n9ExY6zHy6uCxKz2OwGFW8bXFW7Cbrx03x2NKaE/edit?usp=sharing">these guidelines</a> are a
    good place to start.</p>

  <h4 className="repository">How can I ask questions or give feedback on the Repository Finder tool?</h4>

  <p>We&apos;re interested in problems you&apos;re experiencing with the tool and your ideas for improving it. Please contact us at
    <a href="mailto:repositoryfinder@datacite.org">repositoryfinder@datacite.org</a>.</p>
</div>
</div>
    </Layout>
  )
}
export default RepositoryFaqPage
