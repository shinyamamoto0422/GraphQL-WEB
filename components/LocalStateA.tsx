import { useReactiveVar } from '@apollo/client'
import Link from 'next/link'
import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from 'react'
import { todoVar } from '../cache'
import { Button } from './common/Button'

export const LocalStateA = () => {
  const [input, setInput] = useState('')
  const todos = useReactiveVar(todoVar)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    todoVar([...todoVar(), { title: input }])
    setInput('')
  }
  return (
    <>
      <p className="mb-3 font-bold">makeVar</p>
      {todos?.map((task, index) => {
        return (
          <p className="mb-3 gap-y-1" key={index}>
            {task.title}
          </p>
        )
      })}
      <form
        className="flex flex-col justify-center items-center"
        onSubmit={handleSubmit}
      >
        <input
          type="text "
          className="mb-3 px-3 py-2 border border-gray-300"
          placeholder="New Task?"
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setInput(e.target.value)
          }}
        />
        <Button
          type="submit"
          disabled={!input}
          title="Add New State"
          className="disabled:opacity-40 bg-indigo-600 hover:bg-indigo-700 "
        />
      </form>
      <Button
        title="Next"
        href="/local-state-b"
        className="bg-indigo-600 hover:bg-indigo-700 "
      />
    </>
  )
}
