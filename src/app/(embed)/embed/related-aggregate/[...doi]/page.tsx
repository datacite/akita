import React, { Suspense } from 'react';
import RelatedAggregateGraph from 'src/app/(main)/doi.org/[...doi]/RelatedAggregateGraph';

type Props = {
  params: Promise<{ doi: string[] }>
};

export default async function EmbedRelatedAggregateGraphPage({ params }: Props) {
  const { doi } = await params;
  const doiString = doi.join('/');

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <Suspense>
        <RelatedAggregateGraph doi={doiString} isEmbed={true} />
      </Suspense>
    </div>
  );
} 