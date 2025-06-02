'use client';

import React, { FormEventHandler, useState } from 'react'
import { ITask } from '@/types/tasks'
import { TbEditCircle, TbTrashXFilled, TbArrowsMove, TbCheck, TbRotateClockwise } from "react-icons/tb";
import { useRouter } from 'next/navigation';
import Modal from './Modal';
import { deleteTodo, editTodo, completeTodo } from '@/api';

interface TaskProps {
    task: ITask;
    onDragStart: (e: React.DragEvent, taskId: string) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, targetTaskId: string) => void;
    onDragEnd: () => void;
    isDragging: boolean;
    isDragMode: boolean;
    onToggleDragMode: (taskId: string) => void;
}

const Task: React.FC<TaskProps> = ({ 
    task, 
    onDragStart, 
    onDragOver, 
    onDrop, 
    onDragEnd,
    isDragging,
    isDragMode,
    onToggleDragMode
}) => {
  const router = useRouter();
  const [modalEditOpen, setModalEditOpen] = useState<boolean>(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<string>(task.text);

  const handleCompleteTodo = async (id: string) => {
    await completeTodo(id);
    router.refresh();
  };

  const handleEditTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await editTodo({
      id: task.id,
      text: taskToEdit,
      completed: task.completed
    });
    setModalEditOpen(false);
    router.refresh();
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
    setModalDeleteOpen(false);
    router.refresh();
  };

  const handleGripClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleDragMode(task.id);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (!isDragMode) {
      e.preventDefault();
      return;
    }
    onDragStart(e, task.id);
  };

  const handleDragEnd = () => {
    // Reset drag mode when drag ends
    onToggleDragMode('');
    onDragEnd();
  };

  return (
    <tr 
      draggable={isDragMode}
      onDragStart={handleDragStart}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, task.id)}
      onDragEnd={handleDragEnd}
      className={`
        transition-all duration-200
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${isDragMode ? 'border-l-4 border-yellow-400 shadow-md cursor-move' : 'hover:bg-blue-900/30 border-l-4 border-transparent hover:border-blue-300'}
      `}
    >
      <td className='py-3 px-4'>
        <div className='flex items-center gap-3'>
          <TbArrowsMove 
            onClick={handleGripClick}
            className={`
              flex-shrink-0 transition-all duration-200
              ${isDragMode 
                ? 'text-yellow-400 scale-110' 
                : 'text-gray-400 hover:text-gray-600 hover:scale-110'
              }
              cursor-pointer
            `}
            size={18} 
          />
          <span className={`flex-1 select-none ${isDragMode ? 'text-white font-medium' : 'text-white font-light'}`}>
            {task.text}
          </span>
        </div>
      </td>
      
      <td className='py-3 px-4'>
        <div className='flex gap-2 justify-end'>
          <button
            onClick={() => {
              if (!isDragMode) handleCompleteTodo(task.id);
            }}
            disabled={isDragMode}
            className={`
              transition-all duration-200
              ${isDragMode
                ? 'text-yellow-400/70 cursor-not-allowed'
                : task.completed 
                  ? 'text-orange-500 hover:text-orange-300 hover:scale-110 cursor-pointer' 
                  : 'text-green-500 hover:text-green-300 hover:scale-110 cursor-pointer'
              }
            `}
            title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.completed ? <TbRotateClockwise size={20} /> : <TbCheck size={20} />}
          </button>
          {!task.completed && (
            <TbEditCircle 
              onClick={() => {
                if (!isDragMode) setModalEditOpen(true);
              }}
              className={`
                transition-all duration-200
                ${isDragMode 
                  ? 'text-yellow-400/70 cursor-not-allowed' 
                  : 'text-blue-500 hover:text-blue-300 hover:scale-110 cursor-pointer'
                }
              `} 
              size={20}
              title="Edit task"
            />
          )}
          
          <TbTrashXFilled 
            onClick={() => {
              if (!isDragMode) setModalDeleteOpen(true);
            }}
            className={`
              transition-all duration-200
              ${isDragMode 
                ? 'text-yellow-400/70 cursor-not-allowed' 
                : 'text-red-500 hover:text-red-300 hover:scale-110 cursor-pointer'
              }
            `}
            size={20}
            title={task.completed ? "Delete completed task" : "Delete task"}
          />
        </div>

        {/* Edit Modal */}
        <Modal modalOpen={modalEditOpen} setModalOpen={setModalEditOpen}>
          <form onSubmit={handleEditTodo} className='space-y-4'>
            <h3 className='font-bold text-lg'>Edit Task</h3>
            <div className='flex gap-2'>
              <input
                value={taskToEdit}
                onChange={e => setTaskToEdit(e.target.value)}
                type="text"
                placeholder="Type here"
                className='input flex-1'
                autoFocus
              />
              <button type="submit" className='btn btn-primary'>
                Save
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Modal */}
        <Modal modalOpen={modalDeleteOpen} setModalOpen={setModalDeleteOpen}>
          <div className='space-y-4'>
            <h3 className='font-bold text-lg'>Delete Task</h3>
            <p className='text-gray-600'>Are you sure you want to delete this task?</p>
            <div className='flex gap-2 justify-end'>
              <button 
                onClick={() => setModalDeleteOpen(false)} 
                className='btn btn-ghost'
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteTodo(task.id)} 
                className='btn btn-error'
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </td>
    </tr>
  )
}

export default Task