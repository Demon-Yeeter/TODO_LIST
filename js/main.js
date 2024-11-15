
import { toggleDarkMode } from './darkMode.js';
import { startCountdown } from './countdown.js';

// Rendert die Aufgaben in der Tabelle
const renderTasks = (query = "") => {
    const filteredTasks = searchTasks(query);

    // Offene Aufgaben rendern
    const tasksBody = filteredTasks.map(currentTask => `
        <div class="row" data-id="${currentTask.id}" draggable="true" ondragstart="onDragStart(event)" ondragover="onDragOver(event)" ondrop="onDrop(event)">
            <div class="cell task-cell">${currentTask.task}</div>
            <div class="cell">${currentTask.createdAt}</div>
            <div class="cell">${currentTask.deadline}</div>
            <div class="cell countdown">${currentTask.countdown}</div>
            <div class="cell action">
                <button class="check" data-id="${currentTask.id}">✔</button>
                <button class="edit" data-id="${currentTask.id}">✎</button>
                <button class="delete" data-id="${currentTask.id}">🗑️</button>
            </div>
        </div>`).join('');
    document.getElementById('tasks-body').innerHTML = tasksBody;

    // Erledigte Aufgaben rendern
    const completedBody = tasks.done.map(currentTask => `
        <div class="row" data-id="${currentTask.id}">
            <div class="cell">${currentTask.task}</div>
            <div class="cell">${currentTask.createdAt}</div>
            <div class="cell actions">
                <button class="delete" data-id="${currentTask.id}">🗑️</button>
            </div>
        </div>`).join('');
    document.getElementById('completed-body').innerHTML = completedBody;
};
 
// Fügt eine neue Aufgabe hinzu
export const addTask = (event) => {
    event.preventDefault();
    const taskInput = document.getElementById("taskInput");
    const dateInput = document.getElementById("dateInput");

    if (taskInput.value.trim() === "" || dateInput.value.trim() === "") {
        taskInput.setCustomValidity("Bitte Aufgabe und Datum eintragen!");
        taskInput.reportValidity();
        return;
    } else {
        taskInput.setCustomValidity("");
    }

    const newTask = {
        id: getId(),
        task: taskInput.value,
        createdAt: new Date().toLocaleString(),
        deadline: new Date(dateInput.value).toLocaleString(),
        countdown: "" // Platzhalter für den Countdown
    };

    tasks.open.push(newTask);
    saveTasks(tasks);
    renderTasks(tasks);
    startCountdown(newTask); // Countdown starten
    taskInput.value = "";
    dateInput.value = "";
};

export const getId = () => {
    let id;
    do {
        const array = new Uint32Array(1);
        id = window.crypto.getRandomValues(array)[0];
    } while (tasks.open.some(task => task.id === id) || tasks.done.some(task => task.id === id));
    return id;
};

export const loadTasks = () => {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : { open: [], done: [] };
};

let tasks = loadTasks();

export const saveTasks = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const deleteTask = (id, isCompleted) => {
    if (isCompleted) {
        tasks.done = tasks.done.filter(task => task.id !== id);
    } else {
        tasks.open = tasks.open.filter(task => task.id !== id);
    }
    saveTasks(tasks);
};

export const moveToCompleted = (id) => {
    const taskIndex = tasks.open.findIndex(task => task.id === id);
    if (taskIndex > -1) {
        const [task] = tasks.open.splice(taskIndex, 1);
        tasks.done.push(task);
        saveTasks(tasks);
    }
};

export const editTask = (id, newTaskText) => {
    const task = tasks.open.find(task => task.id === id);
    if (task) {
        task.task = newTaskText;
        saveTasks(tasks);
    }
};




// Event Listener für den Dark Mode Button
document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

document.getElementById('taskForm').addEventListener('submit', addTask);


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
    renderTasks(tasks, event.target.value);
});