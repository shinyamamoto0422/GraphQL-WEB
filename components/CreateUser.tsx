import { VFC } from 'react'
import { useCreateForm } from '../hooks/useCreateForm'
import { Button } from '../components/common/Button'
import { Child } from './ChildComponent'

export const CreateUser: VFC = () => {
  const {
    text,
    userName,
    handleTextChange,
    usernameChange,
    handleSubmit,
    printBug,
  } = useCreateForm()

  return (
    <>
      {console.log('create user rendered')}
      <p className="mb-3 font-bold">Custom Hook + useCallback + memo</p>
      <div className="flex mb-3 flex-col justify-center items-center">
        <label>Text</label>
        <input
          className="px-3 py-2 border border-gray-400"
          type="text"
          value={text}
          onChange={handleTextChange}
        />
      </div>
      <label>User Name</label>
      <form className="mb-3 px-3 py-2" onClick={handleSubmit}>
        <input
          className="px-3 py-2 border border-gray-400"
          type="New User ?"
          value={userName}
          onChange={usernameChange}
        />
      </form>
      <Button
        title="submit"
        className="disabled:opacity-40 bg-indigo-600 hover:bg-indigo-700 "
        type="submit"
      ></Button>
      <Child printBug={printBug} handleSubmit={handleSubmit} />
    </>
  )
}
