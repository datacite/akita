import React from "react"
import ContentLoader from "react-content-loader"

interface Props {
  count?: number
  numberOfLines?: number
}

function LoadingFacetList({
  count = 1,
  numberOfLines = 5
}: Props) {
  const _numberOfLines = numberOfLines
  const baseSize=20
  const lineHeight=1.2 * baseSize
  const doubleLineHeight=2 * lineHeight
  const lineSpace=.5 * baseSize
  const totalWidth=400
  const totalHeight= ((_numberOfLines+3) * (lineHeight + lineSpace))
  const randomWidths = Array(_numberOfLines*count).fill(0).map(() => 10 + Math.floor(Math.random() * 5))
  const randomLabelWidths = Array(_numberOfLines*count).fill(0).map(() => 40 + Math.floor(Math.random() * 30))
  const randomHeaders = Array(count).fill(0).map(() => 200 + Math.floor(Math.random() * 150))

  return (
    Array(count).fill(0).map((_,index) => (
        <ContentLoader
          speed={2}
          title="Loading Facets..."
          width={totalWidth}
          // height="100%"
          viewBox={`0 0 400 ${totalHeight}`}
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
          style={{ height: '100%' }}
          key={'facet-placeholder-' + randomHeaders[index]}
          >
          <rect x={ 3 } y={ 0 } rx={ 5 } ry={ 5 } width={`${randomHeaders[index]}`} height={`${doubleLineHeight}`} />
          <rect x={ 3 } y={`${doubleLineHeight+lineSpace}`} rx={ 0 } ry={ 0 } width={totalWidth} height={ 2 } />
          {Array(_numberOfLines).fill(0).map((_,index2) => (
            <React.Fragment key={`facet-group-${index}-${index2}`}>
              <rect
                x={ baseSize }
                y={((index2+2) * (lineHeight + lineSpace))}
                rx={ 0 }
                ry={ 0 }
                width={lineHeight}
                height={lineHeight}
                key={`facet-${index}-${index2}-check-${Math.random().toString(36).substring(2, 9)}`}
              />
              <rect
                x={baseSize * 3}
                y={((index2+2) * (lineHeight + lineSpace))}
                rx={ 5 }
                ry={ 5 }
                width={randomLabelWidths[index*_numberOfLines +index2]*4}
                height={`${lineHeight}`}
                key={`facet-${index}-${index2}-label-${Math.random().toString(36).substring(2, 9)}`}
              />
              <rect
                x={400 - randomWidths[index*_numberOfLines +index2]*4}
                y={(index2+2) * (lineHeight + lineSpace)}
                rx={5}
                ry={5}
                width={randomWidths[index*_numberOfLines +index2]*4}
                height={lineHeight}
                key={`facet-${index}-${index2}-count-${Math.random().toString(36).substring(2, 9)}`}
              />
            </React.Fragment>
          ))}
        </ContentLoader>
                            ))
  )
}

export default LoadingFacetList
