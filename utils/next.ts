import { withAuthentication as originWithAuthentication } from '@billyunq/react-utils/next'

import { checkLogin } from './storage'

export const withAuthentication = originWithAuthentication(checkLogin)
