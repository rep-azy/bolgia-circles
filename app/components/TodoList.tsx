'use client';

import { ITask } from '@/types/tasks'
import Task from './Task'
import React, { useState, useEffect, useCallback, useMemo } from 'react'

interface TodoListProps {
    tasks: ITask[];
    onReorderTasks?: (reorderedTasks: ITask[]) => void;
}

const TodoList: React.FC<TodoListProps> = ({ tasks, onReorderTasks }) => {
  const [localTasks, setLocalTasks] = useState<ITask[]>(tasks);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragModeTaskId, setDragModeTaskId] = useState<string | null>(null);

  // Sort tasks: incomplete tasks first, then completed tasks
  const sortedTasks = useMemo(() => {
    const incompleteTasks = localTasks.filter(task => !task.completed);
    const completedTasks = localTasks.filter(task => task.completed);
    return [...incompleteTasks, ...completedTasks];
  }, [localTasks]);

  // Sync local tasks with props and auto-sort
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // Update parent component when tasks are reordered
  useEffect(() => {
    // Only call onReorderTasks if the sorted order is different from the original
    const originalOrder = localTasks.map(task => task.id).join(',');
    const sortedOrder = sortedTasks.map(task => task.id).join(',');
    
    if (originalOrder !== sortedOrder && onReorderTasks) {
      onReorderTasks(sortedTasks);
    }
  }, [sortedTasks, localTasks, onReorderTasks]);

    const handleToggleDragMode = useCallback((taskId: string) => {
        setDragModeTaskId(current => current === taskId ? null : taskId);
    }, []);

    const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
        // Prevent dragging completed tasks
        const task = localTasks.find(t => t.id === taskId);
        if (task?.completed) {
            e.preventDefault();
            return;
        }

        setDraggedTaskId(taskId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', taskId);
        
        // Create a simple, clean drag image
        const dragImage = document.createElement('div');
        dragImage.textContent = e.currentTarget.querySelector('span')?.textContent || 'Task';
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-1000px';
        dragImage.style.left = '-1000px';
        dragImage.style.padding = '8px 16px';
        dragImage.style.backgroundColor = '#fef08a';
        dragImage.style.border = '2px solid #eab308';
        dragImage.style.borderRadius = '6px';
        dragImage.style.fontSize = '14px';
        dragImage.style.fontWeight = '500';
        dragImage.style.color = '#000';
        dragImage.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        dragImage.style.whiteSpace = 'nowrap';
        
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 50, 20);
        
        setTimeout(() => {
            if (document.body.contains(dragImage)) {
            document.body.removeChild(dragImage);
            }
        }, 100);
    }, [localTasks]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, targetTaskId: string) => {
        e.preventDefault();
        
        if (!draggedTaskId || draggedTaskId === targetTaskId) {
        setDraggedTaskId(null);
        return;
        }

        // Prevent dropping on completed tasks
        const targetTask = localTasks.find(t => t.id === targetTaskId);
        if (targetTask?.completed) {
            setDraggedTaskId(null);
            return;
        }

        const draggedIndex = localTasks.findIndex(task => task.id === draggedTaskId);
        const targetIndex = localTasks.findIndex(task => task.id === targetTaskId);

        if (draggedIndex === -1 || targetIndex === -1) {
        setDraggedTaskId(null);
        return;
        }

        // Reorder tasks
        const newTasks = [...localTasks];
        const [draggedTask] = newTasks.splice(draggedIndex, 1);
        newTasks.splice(targetIndex, 0, draggedTask);

        setLocalTasks(newTasks);
        
        // Clean up drag state
        setDraggedTaskId(null);
        setDragModeTaskId(null);
    }, [localTasks, draggedTaskId]);

    const handleDragEnd = useCallback(() => {
        setDraggedTaskId(null);
        setDragModeTaskId(null);
    }, []);

  // Click outside to exit drag mode
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
        if (dragModeTaskId && !(e.target as Element)?.closest('tr')) {
            setDragModeTaskId(null);
        }
        };

        if (dragModeTaskId) {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [dragModeTaskId]);

    if (localTasks.length === 0) {
        return (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-lg font-medium mb-1">No tasks yet</p>
            <p className="text-sm">Add a task to get started!</p>
            </div>
        </div>
        );
    }

    // Get counts for section headers
    const incompleteCount = sortedTasks.filter(task => !task.completed).length;
    const completedCount = sortedTasks.filter(task => task.completed).length;

    return (
        <div className="rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
                <thead className="border-b">
                    <tr>
                        <th className="text-left text-white font-medium py-3 px-4">
                            Tasks
                            {incompleteCount > 0 && completedCount > 0 && (
                                <span className="ml-2 text-sm font-normal text-gray-300">
                                    ({incompleteCount} active, {completedCount} completed)
                                </span>
                            )}
                        </th>
                        <th className="text-right text-white font-medium py-3 px-4">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-blue-950">
                    {/* Render incomplete tasks first */}
                    {sortedTasks.map((task, index) => {
                        // Add a visual separator between incomplete and completed tasks
                        const isFirstCompleted = task.completed && 
                            index > 0 && 
                            !sortedTasks[index - 1].completed;
                        
                        return (
                            <React.Fragment key={task.id}>
                                {isFirstCompleted && (
                                    <tr className="bg-green-900/10">
                                        <td colSpan={2} className="py-2 px-4">
                                            <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                                                <div className="h-px bg-green-400/30 flex-1"></div>
                                                <span>Completed Tasks</span>
                                                <div className="h-px bg-green-400/30 flex-1"></div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                <Task 
                                    task={task} 
                                    onDragStart={handleDragStart}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onDragEnd={handleDragEnd}
                                    isDragging={draggedTaskId === task.id}
                                    isDragMode={dragModeTaskId === task.id}
                                    onToggleDragMode={handleToggleDragMode}
                                />
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
            
            {/* Drag mode indicator */}
            {dragModeTaskId && (
                <div className="px-4 py-2 rounded-b-lg border-2 text-sm text-yellow-100">
                    <span className="font-medium">Drag mode active</span> - Drag the task to reorder, or click outside to exit
                    <span className="block text-xs text-yellow-200 mt-1">
                        Note: Only incomplete tasks can be reordered
                    </span>
                </div>
            )}
        </div>
    );
};

export default TodoList