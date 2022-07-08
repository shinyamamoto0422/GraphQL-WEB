import { Layout } from '../../components/Layout'
import { ChevronDoubleLeftIcon } from '@heroicons/react/solid'
import { initializeApollo } from '../../lib/apollo.client'
import { GET_USERIDS, GET_USERBY_ID } from '../../queries/queries'
import {
  GetUserIdsQuery,
  GetUserByIdQuery,
  Users,
} from '../../types/generated/graphql'
import { GetStaticProps, GetStaticPaths } from 'next'
import { VFC } from 'react'
import Link from 'next/link'

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo()
  const { data } = await apolloClient.query<GetUserIdsQuery>({
    query: GET_USERIDS,
  })
  const paths = data.users.map((user) => ({
    params: { id: user.id },
  }))
  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo()
  const { data } = await apolloClient.query<GetUserByIdQuery>({
    query: GET_USERBY_ID,
    variables: { id: params.id },
  })
  return {
    props: {
      user: data.users_by_pk,
    },
    revalidate: 1,
  }
}

interface Props {
  user: {
    __typename?: string
  } & Pick<Users, 'id' | 'name' | 'createdAt'>
}

const UserDetail: VFC<Props> = ({ user }) => {
  if (!user) {
    return <Layout title="loading">Loading...</Layout>
  }
  return (
    <Layout title={user.name}>
      <p className="text-xl font-bold">User Detail</p>
      <p className="mt-4">
        <span className="font-bold text-red-400">ID:</span>
        {user.id}
      </p>
      <p className="mt-4">
        <span className="font-bold text-red-400">CREATED_AT:</span>
        {user.createdAt}
      </p>
      <Link href="/hasura-ssg">
        <div className="flex cursor-pointer mt-12">
          <ChevronDoubleLeftIcon
            data-testid="auth-to-main"
            className="w-6 h-6 mr-3 text-blue-500"
          />
          <span className="text-blue-500 hover:text-blue-800">
            Back to main-ssg-page
          </span>
        </div>
      </Link>
    </Layout>
  )
}
export default UserDetail
