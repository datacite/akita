import React from 'react'
import ReactHtmlParser from 'html-react-parser'
import FAQ from '../../../data/faq'

type FaqItemProps = {
  question: string
  answer: string
}

function FaqItem (props: FaqItemProps) {
  return(
    <>
      <h4 className="repository">{ReactHtmlParser(props.question)}</h4>
      <p>{ReactHtmlParser(props.answer)}</p>
    </>
  )
}


function RepositoryFaqPage () {
  return (
    <div className="container-fluid">
      <div className='col-sm-8 col-sm-offset-2'>
        <h2 className="doi">FAQ</h2>
        {FAQ.map((faq, index) => (
          <FaqItem key={index.toString()}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </div>
  )
}
export default RepositoryFaqPage
