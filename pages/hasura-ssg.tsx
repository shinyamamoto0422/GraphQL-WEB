import { GetStaticProps } from 'next'
import Link from 'next/link'
import { VFC } from 'react'
import { Layout } from '../components/Layout'
import { initializeApollo } from '../lib/apollo.client'
import { GET_USERS } from '../queries/queries'
import { GetUsersQuery, Users } from '../types/generated/graphql'

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo()
  const { data } = await apolloClient.query<GetUsersQuery>({ query: GET_USERS })
  return {
    props: { users: data.users },
    revalidate: 1,
  }
}

interface Props {
  users: ({
    __typename: string
  } & Pick<Users, 'id' | 'name' | 'createdAt'>)[]
}

const HasuraSSG: VFC<Props> = ({ users }) => {
  return (
    <Layout title="Hasura SSG">
      <p className="mb-3 font-bold">SSG + ISR</p>
      {users.map((user) => {
        return (
          <Link key={user.id} href={`/users/${user.id}`}>
            <a
              className="my-1 cursor-pointer text-blue-400 hover:text-blue-700"
              datatype={`link-${user.id}`}
            >
              {user.name}
            </a>
          </Link>
        )
      })}
    </Layout>
  )
}
export default HasuraSSG
