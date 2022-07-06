import { useReactiveVar } from '@apollo/client'
import Link from 'next/link'
import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from 'react'
import { todoVar } from '../cache'

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
        <button
          disabled={!input}
          type="submit"
          className="disabled:opacity-40 mb-3 py-1 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl focus:outline-none"
        >
          Add New State
        </button>
      </form>
      <Link href="/local-state-b">
        <a>Next</a>
      </Link>
    </>
  )
}
