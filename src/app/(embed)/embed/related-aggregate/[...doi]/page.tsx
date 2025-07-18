import React, { Suspense } from 'react';
import RelatedAggregateGraph from 'src/app//doi.org/[...doi]/RelatedAggregateGraph';

type Props = {
  params: { doi: string[] }
};

export default function EmbedRelatedAggregateGraphPage({ params }: Props) {
  const doi = params.doi.join('/');

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <Suspense>
        <RelatedAggregateGraph doi={doi} isEmbed={true} />
      </Suspense>
    </div>
  );
} 