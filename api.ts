import { ITask } from "./types/tasks";

const baseURL = 'http://localhost:3001';

export const getAllTodos = async (): Promise<ITask[]> => {
    const res = await fetch(`${baseURL}/tasks`, { cache: 'no-store' });
    const todos = await res.json();
    return todos;
};

export const addTodo = async (todo: ITask): Promise<ITask> => {
    const res = await fetch(`${baseURL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    })
    const newTodo = await res.json();
    return newTodo;
};

export const editTodo = async (todo: ITask): Promise<ITask> => {
    const res = await fetch(`${baseURL}/tasks/${todo.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    })
    const updatedTodo = await res.json();
    return updatedTodo;
};

export const completeTodo = async (id: string): Promise<ITask> => {
    // First, get the current task to check its completion status
    const getRes = await fetch(`${baseURL}/tasks/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const currentTask = await getRes.json();
    
    // Toggle the completed status
    const updatedTask = {
        ...currentTask,
        completed: !currentTask.completed // Toggle: false becomes true, true becomes false
    };
    
    // Update the task with the new completion status
    const res = await fetch(`${baseURL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
    });
    
    const completedTodo = await res.json();
    return completedTodo;
};

export const deleteTodo = async (id: string): Promise<void> => {
    await fetch(`${baseURL}/tasks/${id}`, {
        method: 'DELETE',
    })
};