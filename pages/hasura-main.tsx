import { useQuery } from '@apollo/client'
import Link from 'next/link'
import { VFC } from 'react'
import { Layout } from '../components/Layout'
import { GET_USERS } from '../queries/queries'
import { GetUsersQuery } from '../types/generated/graphql'

const FetchMain: VFC = () => {
  const { data, loading, error } = useQuery<GetUsersQuery>(GET_USERS, {
    // fetchPolicy: 'network-only',
    fetchPolicy: 'cache-and-network',
    // fetchPolicy: 'cache-first',
    // fetchPolicy: 'no-cache',
  })
  if (error) {
    return (
      <Layout title="Hausra fetchPolicy">
        <p>Error: {error.message}</p>
      </Layout>
    )
  }
  return (
    <Layout title="Hasura fetchPolicy">
      <p className="mb-6 font-bold">Hasura main page</p>
      {console.log(data)}
      {data?.users.map((user) => {
        return (
          <p className="my-1" key={user.id}>
            {user.name}
          </p>
        )
      })}
      <Link href="/hasura-sub">
        <button className="mt-6 py-1 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl focus:outline-none">
          Next
        </button>
      </Link>
    </Layout>
  )
}
export default FetchMain
