import React from "react"
import ContentLoader from "react-content-loader"

interface Props {
  count: number
}
const numberOfLines=10
const lineHeight=1.2
const lineSpace=.5
const totalHeightEm = 0.1+ lineSpace + (numberOfLines * (lineHeight + lineSpace))

function LoadingFacetList({ count, ...props }: Props) {

  return (
    Array(count).fill(0).map((_,index) =>
        <ContentLoader
          speed={2}
          width={"100%"}
          height={`${totalHeightEm}em`}
          viewBox={`0 0 400 ${totalHeightEm*16 +32}`}
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
          key={index}
          {...props}
          >
          <rect x="1em" y="0" rx="0" ry="0" width="75%" height="2em" />
          <rect x="1em" y="2.1em" rx="0" ry="0" width="100%" height="2" />
          {Array(numberOfLines).fill(0).map((_,index2) =>
                                            <>
              <rect
                x="1em"
                y={`${1+ ((index2+1) * (lineHeight + lineSpace))}em`}
                rx="0"
                ry="0"
                width={`${lineHeight}em`}
                height={`${lineHeight}em`}
                key={"chec"+index+index2}
              />
              <rect
                x="3em"
                y={`${1+ ((index2+1) * (lineHeight + lineSpace))}em`}
                rx="0"
                ry="0"
                width="85%"
                height={`${lineHeight}em`}
                key={"rec"+index+index2}
              />
                                           </>
                                           )}
        </ContentLoader>
                            )

  )
}

export default LoadingFacetList
