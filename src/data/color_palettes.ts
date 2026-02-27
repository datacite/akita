export const otherDomain = ['Other', 'Missing', 'Unknown']
export const otherRange = ['gray', '#555', '#555']



// Source: https://gist.github.com/kjgarza/30558b663d4fd36e7d9970a6b5bdebe6
export const resourceTypeDomain = [
	...otherDomain,
	'Audiovisual',
	'Award',
	'Book',
	'Book Chapter',
	'Collection',
	'Computational Notebook',
	'Conference Paper',
	'Conference Proceeding',
	'Data Paper',
	'Dataset',
	'Dissertation',
	'Event',
	'Image',
	'Instrument',
	'Interactive Resource',
	'Journal',
	'Journal Article',
	'Model',
	'Output Management Plan',
	'Peer Review',
	'Physical Object',
	'Poster',
	'Preprint',
	'Presentation',
	'Project',
	'Report',
	'Service',
	'Software',
	'Sound',
	'Standard',
	'Study Registration',
	'Text',
	'Workflow',
	'Other'
]


// Source:  https://gist.github.com/kjgarza/30558b663d4fd36e7d9970a6b5bdebe6
export const resourceTypeRange = [
	...otherRange,
	'#AEC7E8',
	'#D4AF37',
	'#FF7F0E',
	'#FFBB78',
	'#D62728',
	'#FF9896',
	'#9467BD',
	'#C5B0D5',
	'#8C564B',
	'#1F77B4',
	'#C49C94',
	'#E377C2',
	'#F7B6D2',
	'#35424A',
	'#7F7F7F',
	'#C7C7C7',
	'#BCBD22',
	'#DBDB8D',
	'#17BECF',
	'#9EDAE5',
	'#31bdbb',
	'#3182BD',
	'#6BAED6',
	'#7d6bd6',
	'#AB8DF8',
	'#9ECAE1',
	'#C6DBEF',
	'#E6550D',
	'#FD8D3C',
	'#FDAE6B',
	'#6DBB5E',
	'#FDD0A2',
	'#9F4639',
	'#C59088'
]


// Source:  https://r-charts.com/color-palettes/#discrete
// paletteer_d("ggthemes::Tableau_20")
export const licenseRange = [
	'#4E79A7',
	'#A0CBE8',
	'#F28E2B',
	'#FFBE7D',
	'#59A14F',
	'#8CD17D',
	'#B6992D',
	'#F1CE63',
	'#499894',
	'#86BCB6',
	'#E15759',
	'#FF9D9A',
	'#79706E',
	'#BAB0AC',
	'#D37295',
	'#FABFD2',
	'#B07AA1',
	'#D4A6C8',
	'#9D7660',
	'#D7B5A6',
]


export const identifierDomain = [
	'DOI',
	...otherDomain
]

// Source:  https://r-charts.com/color-palettes/#discrete
// paletteer_d("ggthemes::Classic_Green_Orange_6")
export const identifierRange = [
	'#7B66D2FF',
	// '#DC5FBDFF',
	// '#94917BFF',
	// '#995688FF',
	// '#D098EEFF',
	// '#D7D5C5FF',
	...otherRange
]


// ORCID: #2CA02C


export const contributorDomain = [
	'Creator',
	'Data Curator',
	'Project Leader'
]

export const contributorRange = [
	'red',
	'green',
	'blue'
]


export const affiliationDomain = [
	'Affiliation 1',
	'Affiliation 2',
	'Affiliation 3'
]

export const affiliationRange = [
	'red',
	'green',
	'blue'
]



export const fieldOfScienceDomain = [
	'No Field of Science',
	'Natural sciences',
	'Mathematics',
	'Computer and information sciences',
	'Physical sciences',
	'Chemical sciences',
	'Earth and related environmental sciences',
	'Biological sciences',
	'Other natural sciences',
	'Engineering and technology',
	'Civil engineering',
	'Electrical engineering, electronic engineering, information engineering',
	'Mechanical engineering',
	'Chemical engineering',
	'Materials engineering',
	'Medical engineering',
	'Environmental engineering',
	'Environmental biotechnology',
	'Industrial biotechnology',
	'Nano-technology',
	'Other engineering and technologies',
	'Medical and health sciences',
	'Basic medicine',
	'Clinical medicine',
	'Health sciences',
	'Medical biotechnology',
	'Other medical sciences',
	'Agricultural sciences',
	'Agriculture, forestry, and fisheries',
	'Animal and dairy science',
	'Veterinary science',
	'Agricultural biotechnology',
	'Other agricultural sciences',
	'Social sciences',
	'Psychology',
	'Economics and business',
	'Educational sciences',
	'Sociology',
	'Law',
	'Political science',
	'Social and economic geography',
	'Media and communications',
	'Other social sciences',
	'Humanities',
	'History and archaeology',
	'Languages and literature',
	'Philosophy, ethics and religion',
	'Arts (arts, history of arts, performing arts, music)',
	'Other humanities'
]

export const fieldOfScienceRange = [
	'#d9d9d9',
	'#ffffb3',
	'#ccebc5',
	'#8dd3c7',
	'#8dd3c7',
	'#8dd3c7',
	'#8dd3c7',
	'#8dd3c7',
	'#80b1d3',
	'#80b1d3',
	'#80b1d3',
	'#80b1d3',
	'#80b1d3',
	'#80b1d3',
	'#80b1d3',
	'#80b1d3',
	'#8dd3c7',
	'#80b1d3',
	'#b3de69',
	'#fdb462',
	'#fccde5',
	'#ccebc5',
	'#ccebc5',
	'#ffed6f'
]


export const registrationAgencyDomain = [
	'No Registration Agency',
	'Airiti',
	'CNKI',
	'Crossref',
	'DataCite',
	'ISTIC',
	'JaLC',
	'KISTI',
	'mEDRA',
	'OP'
]

export const registrationAgencyRange = [
	'#d9d9d9',
	'#ffffb3',
	'#ccebc5',
	'#E81A31',
	'#159DEA',
	'#8dd3c7',
	'#8dd3c7',
	'#8dd3c7',
	'#80b1d3',
	'#80b1d3',
	'#80b1d3',
	'#80b1d3',
	'#80b1d3',
	'#80b1d3',
	'#80b1d3',
	'#80b1d3',
	'#8dd3c7',
	'#80b1d3',
	'#b3de69',
	'#fdb462',
	'#fccde5',
	'#ccebc5',
	'#ccebc5',
	'#ffed6f'
]
