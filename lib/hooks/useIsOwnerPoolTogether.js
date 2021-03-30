import { CONTRACT_ADDRESSES } from 'lib/constants'
import { useNetwork } from 'lib/hooks/useNetwork'

export const useIsOwnerPoolTogether = (address) => {
  const { chainId } = useNetwork()
  return (
    CONTRACT_ADDRESSES[chainId].GovernanceTimelock &&
    address === CONTRACT_ADDRESSES[chainId].GovernanceTimelock
  )
}
