import { Dispatch, memo, SetStateAction, VFC } from 'react'
import { Users, DeleteUserMutationFn } from '../types/generated/graphql'
import { Button } from '../components/common/Button'

interface Props {
  user: {
    __typename?: 'users'
  } & Pick<Users, 'id' | 'name' | 'createdAt'>
  delete_users_by_pk: DeleteUserMutationFn
  setEditedUser: Dispatch<SetStateAction<{ id: string; name: string }>>
}

export const UserItem: VFC<Props> = memo(
  ({ user, delete_users_by_pk, setEditedUser }) => {
    return (
      <div className="my-1 flex justify-center items-center border-b pb-2">
        <div>
          <span className="mr-2 font-bold text-blue-500">name</span>
          <span className="mr-2">{user.name}</span>
          <br />
          <span className="mr-2 font-bold text-blue-500">createdAt</span>
          <span className="mr-2">{user.createdAt}</span>
        </div>
        <div>
          <Button
            className="bg-green-600 hover:bg-green-700 "
            title="Edit"
            onClick={() => setEditedUser(user)}
            dataTestId={`edit-${user.id}`}
          ></Button>
          <Button
            className="bg-pink-600 hover:bg-pink-700 "
            title="Delete"
            onClick={async () => {
              await delete_users_by_pk({ variables: { id: user.id } })
            }}
            dataTestId={`delete-${user.id}`}
          ></Button>
        </div>
      </div>
    )
  }
)
