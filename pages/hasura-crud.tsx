import { useState, FormEvent } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_USERS,
  CREATE_USER,
  DELETE_USER,
  UPDATE_USER,
} from '../queries/queries'
import { Layout } from '../components/Layout'
import {
  GetUsersQuery,
  CreateUserMutation,
  DeleteUserMutation,
  UpdateUserMutation,
} from '../types/generated/graphql'
import { Button } from '../components/common/Button'
import { UserItem } from '../components/UserItem'

const HasuraCRUD = () => {
  const [editedUser, setEditedUser] = useState({ id: '', name: '' })

  const { data, error } = useQuery<GetUsersQuery>(GET_USERS, {
    fetchPolicy: 'cache-and-network',
  })

  const [update_users_by_pk] = useMutation<UpdateUserMutation>(UPDATE_USER)

  const [insert_users_one] = useMutation<CreateUserMutation>(CREATE_USER, {
    update(cache, { data: { insert_users_one } }) {
      const cacheId = cache.identify(insert_users_one)
      cache.modify({
        fields: {
          users(existingUsers, { toReference }) {
            return [toReference(cacheId), ...existingUsers]
          },
        },
      })
    },
  })

  const [delete_users_by_pk] = useMutation<DeleteUserMutation>(DELETE_USER, {
    update(cache, { data: { delete_users_by_pk } }) {
      cache.modify({
        fields: {
          users(existingUsers, { readField }) {
            return existingUsers.filter(
              (user) => delete_users_by_pk.id !== readField('id', user)
            )
          },
        },
      })
    },
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedUser.id) {
      // 更新
      try {
        await update_users_by_pk({
          variables: {
            id: editedUser.id,
            name: editedUser.name,
          },
        })
      } catch (error) {
        alert(error.message)
      }
      setEditedUser({ id: '', name: '' })
    } else {
      // 新規作成
      try {
        await insert_users_one({
          variables: {
            name: editedUser.name,
          },
        })
      } catch (error) {
        alert(error.message)
      }
      setEditedUser({ id: '', name: '' })
    }
  }

  if (error) return <Layout title="Hasura CRUD">Error: {error.message}</Layout>

  return (
    <Layout title="CRUD(Hasura)">
      <p className="mb-3 font-bold">CRUD(Hasura)</p>
      <input
        type="text"
        className="px-3 py-2 border border-gray-300"
        placeholder="New User ?"
        value={editedUser.name}
        onChange={(e) => {
          setEditedUser({ ...editedUser, name: e.target.value })
        }}
      />
      <form
        className="flex flex-col justify-center items-center"
        onSubmit={handleSubmit}
      >
        <Button
          title={editedUser.id ? 'Update' : 'Create'}
          className="disabled:opacity-40 bg-indigo-600 hover:bg-indigo-700 "
          type="submit"
          disabled={!editedUser.name}
          dataTestId="new"
          onClick={() => handleSubmit}
        ></Button>
      </form>

      {data?.users.map((user) => {
        return (
          <UserItem
            key={user.id}
            user={user}
            setEditedUser={setEditedUser}
            delete_users_by_pk={delete_users_by_pk}
          />
        )
      })}
    </Layout>
  )
}
export default HasuraCRUD
