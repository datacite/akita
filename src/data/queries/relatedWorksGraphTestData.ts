import {
  ForceDirectedGraphNode,
  ForceDirectedGraphLink
} from 'src/components/ForceDirectedGraph/ForceDirectedSpec'

export const TEST_NODES_Large: ForceDirectedGraphNode[] = [
  { title: 'Preprint', count: 22357 },
  { title: 'Software', count: 136204 },
  { title: 'Dataset', count: 7524645 },
  { title: 'Organization', count: 97795 },
  { title: 'Journal Article', count: 14043135 },
  { title: 'People', count: 8718993 }
]

export const TEST_NODES_SMALL: ForceDirectedGraphNode[] = [
  { title: 'Preprint', count: 22 },
  { title: 'Software', count: 13 },
  { title: 'Dataset', count: 75 },
  { title: 'Organization', count: 9 },
  { title: 'Journal Article', count: 140 },
  { title: 'People', count: 871 }
]

export const TEST_LINKS_SMALL: ForceDirectedGraphLink[] = [
  { source: 'Preprint', target: 'Software', count: 79 },
  { source: 'Preprint', target: 'Dataset', count: 682 },
  { source: 'Preprint', target: 'Journal Article', count: 252 },

  { source: 'Software', target: 'Dataset', count: 19 },
  { source: 'Software', target: 'People', count: 286 },
  { source: 'Software', target: 'Organization', count: 2 },

  { source: 'Dataset', target: 'Organization', count: 117 },
  { source: 'Dataset', target: 'People', count: 546 },
  { source: 'Dataset', target: 'Journal Article', count: 3876 },

  { source: 'Organization', target: 'Journal Article', count: 17 },
  { source: 'Organization', target: 'People', count: 39 },

  { source: 'Journal Article', target: 'People', count: 3847 },
  { source: 'Journal Article', target: 'Journal Article', count: 20 }
]

export const TEST_LINKS_LARGE: ForceDirectedGraphLink[] = [
  { source: 'Preprint', target: 'Software', count: 7992 },
  { source: 'Preprint', target: 'Dataset', count: 68292 },
  { source: 'Preprint', target: 'Journal Article', count: 25263 },

  { source: 'Software', target: 'Dataset', count: 1983 },
  { source: 'Software', target: 'People', count: 28612 },
  { source: 'Software', target: 'Organization', count: 24 },

  { source: 'Dataset', target: 'Organization', count: 11657 },
  { source: 'Dataset', target: 'People', count: 546454 },
  { source: 'Dataset', target: 'Journal Article', count: 387906 },

  { source: 'Organization', target: 'Journal Article', count: 1777 },
  { source: 'Organization', target: 'People', count: 3009 },

  { source: 'Journal Article', target: 'People', count: 3847926 },
  { source: 'Journal Article', target: 'Journal Article', count: 2043502 }
]
