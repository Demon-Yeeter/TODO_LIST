// renderer.js

import { deleteTask, moveToCompleted, editTask, renderTasks, tasks } from './taskManager.js';

export const addEventListeners = () => {
    document.getElementById('tasks-body').addEventListener('click', (event) => {
        const id = parseInt(event.target.dataset.id);
        if (event.target.classList.contains('delete')) {
            deleteTask(id, false);
        } else if (event.target.classList.contains('check')) {
            moveToCompleted(id);
        } else if (event.target.classList.contains('edit')) {
            editTask(id);
        }
    });

    document.getElementById('completed-body').addEventListener('click', (event) => {
        const id = parseInt(event.target.dataset.id);
        if (event.target.classList.contains('delete')) {
            deleteTask(id, true);
        }
    });

    document.getElementById('searchInput').addEventListener('input', (event) => {
        renderTasks(event.target.value);
    });
};
