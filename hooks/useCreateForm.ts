import { useMutation } from '@apollo/client'
import { useState, useCallback, ChangeEvent, FormEvent } from 'react'
import { CREATE_USER } from '../queries/queries'
import { CreateUserMutation } from '../types/generated/graphql'

export const useCreateForm = () => {
  const [text, setText] = useState('')
  const [userName, setUserName] = useState('')

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
  //   userがtypingをしたときにtextのstateを更新する
  const handleTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }, [])

  const usernameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value)
  }, [])

  const printBug = useCallback(() => {
    console.log('Bug')
  }, [])

  //   submitの処理
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        await insert_users_one({
          variables: {
            name: userName,
          },
        })
      } catch (error) {
        alert(error.message)
      }
      setUserName('')
    },
    [userName]
  )

  return {
    text,
    userName,
    handleTextChange,
    usernameChange,
    handleSubmit,
    printBug,
  }
}
