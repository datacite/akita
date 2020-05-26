import Layout from '../components/Layout'

const IndexPage = () => (
  <Layout title="DataCite Commons Stage">
    <div className="centered">
      <img className="img-big" src="/images/logo-big.png" />
    </div>
    <div className="row">
      <div className="col-md-6 col-md-offset-3 panel-list" id="content">
        <form className="form-horizontal">
          <div id="search" className="input-group">
            <input name="query" placeholder="Type to search..." className="form-control" type="text" />
            <div className="input-group-btn">
              <button className="btn btn-primary hidden-xs" type="submit">Search</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </Layout>
)

export default IndexPage
