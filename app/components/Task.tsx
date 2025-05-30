'use client';

import React, { FormEventHandler, useState } from 'react'
import { ITask } from '@/types/tasks'
import { TbEditCircle } from "react-icons/tb";
import { TbTrashXFilled } from "react-icons/tb";
import { useRouter } from 'next/navigation';
import Modal from './Modal';
import { deleteTodo, editTodo } from '@/api';

interface TaskProps {
    task: ITask
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const router = useRouter();
  const [modalEditOpen, setModalEditOpen] = useState<boolean>(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<string>(task.text);

  const handleEditTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await editTodo({
      id: task.id,
      text: taskToEdit,
    });
    setModalEditOpen(false);
    router.refresh();
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
    setModalDeleteOpen(false);
    router.refresh()
  };

  return (
    <tr key={task.id}>
        <td className='w-full'>{task.text}</td>
        <td className='flex gap-5'>
          <TbEditCircle onClick={() => setModalEditOpen(true)} cursor="pointer" className='text-blue-500' size={20} />
          {/* Edit Modal */}
          <Modal modalOpen={modalEditOpen} setModalOpen={setModalEditOpen}>
            <form onSubmit={handleEditTodo}>
                <h3 className='font-bold text-lg'>Edit Task</h3>
                <div className='modal-action'>
                    <input
                        value={taskToEdit}
                        onChange={e => setTaskToEdit(e.target.value)}
                        type="text"
                        placeholder="Type here"
                        className='input w-full'
                    />
                    <button type="submit" className='btn'>Submit</button>
                </div>
            </form>
          </Modal>
          <TbTrashXFilled onClick={() => setModalDeleteOpen(true)} cursor="pointer" className='text-red-500' size={20} />
          {/* Delete Modal */}
          <Modal modalOpen={modalDeleteOpen} setModalOpen={setModalDeleteOpen}>
            <h3 className='font-bold text-lg'>Are you sure, you want to DELETE this task?</h3>
            <div className='modal-action'>
                <button onClick={() => handleDeleteTodo(task.id)} className='btn'>Yes</button>
            </div>
          </Modal>
        </td>
    </tr>
  )
}

export default Task
