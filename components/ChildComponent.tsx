import { Button } from './common/Button'
import { FormEvent, memo, VFC } from 'react'

interface Props {
  printBug: () => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>
}

export const Child: VFC<Props> = memo(({ printBug, handleSubmit }) => {
  return (
    <>
      {console.log('child rendered')}
      <p className="mt-2">Child Component</p>
      <Button
        title="click"
        type="button"
        onClick={printBug}
        className="bg-indigo-600 hover:bg-indigo-700"
      />
    </>
  )
})
