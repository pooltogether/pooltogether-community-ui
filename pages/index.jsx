import dynamic from 'next/dynamic'

import { IndexContent } from 'lib/components/IndexContent'
import { Layout } from 'lib/components/Layout'

const DynamicWalletContextProvider = dynamic(() =>
  import('lib/components/WalletContextProvider').then(mod => mod.WalletContextProvider),
  { ssr: false }
)

export default function IndexPage() {
  return <>
    <DynamicWalletContextProvider>
      <Layout>
        <IndexContent />
      </Layout>
    </DynamicWalletContextProvider>
  </>
}
