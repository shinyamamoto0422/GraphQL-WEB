import { VFC } from 'react'
import { Layout } from '../components/Layout'
import { LocalStateA } from '../components/LocalStateA'

const LocalStatePageA: VFC = () => {
  return (
    <Layout title="local-state-A">
      <LocalStateA />
    </Layout>
  )
}
export default LocalStatePageA
