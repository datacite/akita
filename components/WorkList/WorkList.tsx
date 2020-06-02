// this interface defines the shape of the data returned by the works query.
export interface WorkQueryResult {
  id: string;
  doi: string;
  url: string;
  creators: [{
    name: string
  }]
  titles: [{
    title: string
  }]
  publicationYear: number
  publisher: string
  descriptions: [{
      description: string
  }]
}

interface IProps {
  works: WorkQueryResult[];
}

const WorkList = ({ works }: IProps) => {
  console.log(works)
  // const listItems = works.map((work) => {
  //   return (
  //     <div key={work.id}>
  //       {work.doi}
  //     </div>
  //   )
  // })
  
  // return (
  //   <div>
  //     {listItems}
  //   </div>
  // )
  return (
    <div className="centered">
      <img className="img-big" src="/images/logo-big.png" />
    
      <style jsx global>{`
          .img-big {
              margin-top: 24px;
          }
        `}</style>
    </div>
  )
}

export default WorkList