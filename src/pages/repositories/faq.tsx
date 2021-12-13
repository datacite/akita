import React from 'react'
import ReactHtmlParser from 'react-html-parser'
import Layout from '../../components/Layout/Layout'
import FAQ from '../../data/faq'

export const getStaticProps = async () => {
  return {
    props: {
      faqs: FAQ
    }
  }
}

type FaqItemProps = {
  question: string
  answer: string
}
const FaqItem: React.FunctionComponent<FaqItemProps>= (props) => {
  return(
    <>
      <h4 className="repository">{props.question}</h4>
      <p>{ReactHtmlParser(props.answer)}</p>
    </>
  )
}


const RepositoryFaqPage = ({faqs}) => {
  return (
    <Layout path={'/repositories'}>
      <div className="container-fluid">
        <div className='col-sm-8 col-sm-offset-2'>
          <h2 className="doi">FAQ</h2>
          {faqs.map((faq, index) => (
            <FaqItem key={index.toString()}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}
export default RepositoryFaqPage
