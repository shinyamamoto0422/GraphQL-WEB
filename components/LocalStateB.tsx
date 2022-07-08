import { useReactiveVar } from '@apollo/client'
import { todoVar } from '../cache'
import Link from 'next/link'
import { Button } from './common/Button'

export const LocalStateB = () => {
  const todos = useReactiveVar(todoVar)
  return (
    <>
      {todos.map((task, index) => {
        return (
          <p className="mb-3" key={index}>
            {task.title}
          </p>
        )
      })}
      <Button
        title="Back"
        href="/local-state-a"
        className="bg-indigo-600 hover:bg-indigo-700 "
      />
    </>
  )
}
