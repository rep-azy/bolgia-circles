'use client';

import React, { FormEventHandler, useState } from 'react'
import { LuClipboardPlus } from "react-icons/lu";
import Modal from './Modal';
import { addTodo } from '@/api';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from "uuid";

const AddTask = () => {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [newTaskValue, setNewTaskValue] = useState<string>('');

    const handleSubmitTodo: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        await addTodo({
            id: uuidv4(),
            text: newTaskValue
        })
        setNewTaskValue('');
        setModalOpen(false);
        router.refresh();
    }

    return (
        <div>
            <button className='btn btn-primary w-full mb-4' onClick={() => setModalOpen(true)}>
                ADD NEW TASK
                <LuClipboardPlus className='ml-1' size={18} />
            </button>

            <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
                <form onSubmit={handleSubmitTodo}>
                    <h3 className='font-bold text-lg'>Add New Task</h3>
                    <div className='modal-action'>
                        <input
                            value={newTaskValue}
                            onChange={e => setNewTaskValue(e.target.value)}
                            type="text"
                            placeholder="Type here"
                            className='input w-full'
                        />
                        <button type="submit" className='btn'>Submit</button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default AddTask
