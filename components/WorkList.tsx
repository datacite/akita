// this interface defines the shape of the data returned by the works query.
export interface IWork {
  id: string;
  doi: string;
  titles: {
    title: string;
  }
  creators: {
    name: string;
  }
}

interface IProps {
  works: IWork[];
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