import { serverApiClient } from '~/lib/api/serverApiClient'

export const getUserDetails = async () => {
  const endpoint = 'accounts/user/profile/'

  return await serverApiClient({
    endpoint: endpoint,
  })
}

