import { ITask } from '@/types/tasks'
import Task from './Task'
import React from 'react'

interface TodoListProps {
    tasks: ITask[]
}

const TodoList: React.FC<TodoListProps> = ({ tasks }) => {
  return (
    <table className="table">
        {/* head */}
        <thead>
            <tr>
                <th>Tasks</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {tasks.map(task => (
                <Task key={task.id} task={task} />
            ))}
        </tbody>
    </table>
  )
}

export default TodoList
