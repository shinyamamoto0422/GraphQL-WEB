import { makeVar } from '@apollo/client'

// 複数のタスクを管理するstate
interface Task {
  title: string
}

export const todoVar = makeVar<Task[]>([])
