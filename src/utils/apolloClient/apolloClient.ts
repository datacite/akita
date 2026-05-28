import apolloClientBuilder from './builder'
import { getAuthToken } from 'src/utils/auth'

const apolloClient = apolloClientBuilder(getAuthToken)
export default apolloClient
