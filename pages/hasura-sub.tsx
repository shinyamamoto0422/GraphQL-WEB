import { useQuery } from '@apollo/client'
import Link from 'next/link'
import { VFC } from 'react'
import { Layout } from '../components/Layout'
import { GET_USERS_LOCAL } from '../queries/queries'
import { GetUsersQuery } from '../types/generated/graphql'

const FetchSub: VFC = () => {
  const { data } = useQuery<GetUsersQuery>(GET_USERS_LOCAL)
  return (
    <Layout title="Fetch Sub">
      <p className="mb-6 font-bold">Direct read out from cache</p>
      {data?.users.map((user) => {
        return (
          <p className="my-1" key={user.id}>
            {user.name}
          </p>
        )
      })}
      <Link href="/hasura-main">
        <button className="mt-6 py-1 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl focus:outline-none">
          Back
        </button>
      </Link>
    </Layout>
  )
}
export default FetchSub
