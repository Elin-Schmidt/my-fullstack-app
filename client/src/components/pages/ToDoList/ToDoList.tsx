import React, { useState } from 'react';
import style from './ToDoList.module.css';

const ToDoList: React.FC = () => {
    const [tasks, setTasks] = useState<string[]>(['Task 1', 'Task 2', 'Task 3']);
    const [newTask, setNewTask] = useState<string>('');

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setNewTask(event.target.value);
    }

    function addTask(): void {
        if (newTask.trim() !== '') {
            setTasks((prevTasks) => [...prevTasks, newTask]);
            setNewTask('');
        }
    }

    function deleteTask(index: number): void {
        setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
    }

    function moveTaskUp(index: number): void {
        if (index > 0) {
            setTasks((prevTasks) => {
                const updatedTasks = [...prevTasks];
                [updatedTasks[index - 1], updatedTasks[index]] = [
                    updatedTasks[index],
                    updatedTasks[index - 1]
                ];
                return updatedTasks;
            });
        }
    }

    function moveTaskDown(index: number): void {
        if (index < tasks.length - 1) {
            setTasks((prevTasks) => {
                const updatedTasks = [...prevTasks];
                [updatedTasks[index], updatedTasks[index + 1]] = [
                    updatedTasks[index + 1],
                    updatedTasks[index]
                ];
                return updatedTasks;
            });
        }
    }

    return (
        <div className={style.toDoList}>
            <h1>To Do List</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter a task..."
                    value={newTask}
                    onChange={handleInputChange}
                />
                <button className={style.addButton} onClick={addTask}>
                    Add Task
                </button>
            </div>
            <ol>
                {tasks.map((task, index) => (
                    <li key={index} className={style.taskItem}>
                        {task}
                        <button onClick={() => deleteTask(index)}>Delete</button>
                        <button onClick={() => moveTaskUp(index)} aria-label="Move Up">
                            ☝️
                        </button>
                        <button onClick={() => moveTaskDown(index)} aria-label="Move Down">
                            👇
                        </button>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default ToDoList;
