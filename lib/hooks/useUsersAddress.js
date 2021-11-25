import { useOnboard } from '@pooltogether/bnc-onboard-hooks'

export const useUsersAddress = () => {
  const { address } = useOnboard()
  return address
}
