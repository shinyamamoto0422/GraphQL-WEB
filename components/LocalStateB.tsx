import { useReactiveVar } from '@apollo/client'
import { todoVar } from '../cache'
import Link from 'next/link'

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
      <Link href="/local-state-a">
        <a>Back</a>
      </Link>
    </>
  )
}
