import dynamic from 'next/dynamic'

import { PoolUI } from 'lib/components/PoolUI'
import { Layout } from 'lib/components/Layout'

// shouldn't this go in Layout as well?
const DynamicWalletContextProvider = dynamic(() =>
  import('lib/components/WalletContextProvider').then(mod => mod.WalletContextProvider),
  { ssr: false }
)

export default function IndexPage() {
  return <>
    <DynamicWalletContextProvider>
      <Layout>
        <PoolUI />
      </Layout>
    </DynamicWalletContextProvider>
  </>
}
