import { startCountdown } from "./countdown.js";

// taskManager.js


export const loadTasks = () => {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : { open: [], done: [] };
};


export let tasks = loadTasks();


// Filtert die Aufgaben basierend auf der Suchanfrage
const searchTasks = async (query) => {
    return query === "" ? tasks.open : tasks.open.filter(task => task.task.includes(query) || task.createdAt.includes(query));
};

// Rendert die Aufgaben in der Tabelle
export const renderTasks = async (query = "") => {
    console.log(query);
    const filteredTasks = await searchTasks(query);

    // Offene Aufgaben rendern
    const tasksBody = filteredTasks.map(currentTask => `
        <div class="row item" data-id="${currentTask.id}" draggable="true" ondragstart="onDragStart(event)" ondragover="onDragOver(event)" ondrop="onDrop(event)">
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


export const getId = () => {
    let id;
    do {
        const array = new Uint32Array(1);
        id = window.crypto.getRandomValues(array)[0];
    } while (tasks.open.some(task => task.id === id) || tasks.done.some(task => task.id === id));
    return id;
};


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
    renderTasks();
};

export const moveToCompleted = (id) => {
    const taskIndex = tasks.open.findIndex(task => task.id === id);
    if (taskIndex > -1) {
        const [task] = tasks.open.splice(taskIndex, 1);
        tasks.done.push(task);
        saveTasks(tasks);
        renderTasks();
    }
};

// Bearbeitet eine Aufgabe
export const editTask = (id) => {
    const taskRow = document.querySelector(`.row[data-id="${id}"]`);
    const taskCell = taskRow.querySelector(".task-cell");
    const originalTask = taskCell.textContent;
    taskCell.innerHTML = `<input type="text" value="${originalTask}" />`;
    const inputField = taskCell.querySelector("input");
    inputField.focus();
    inputField.setSelectionRange(inputField.value.length, inputField.value.length);

    const actionsCell = taskRow.querySelector('.action');
    const originalActions = actionsCell.innerHTML;

    actionsCell.innerHTML = `
        <button class="finish">Fertig</button>
        <button class="cancel">Zurück</button>
    `;

    const finishEdit = () => {
        const newTaskText = inputField.value.trim();
        if (newTaskText) {
            const task = tasks.open.find(task => task.id === id);
            if (task) {
                task.task = newTaskText;
                saveTasks(tasks);
                renderTasks();
            }
        } else {
            taskCell.textContent = originalTask;
        }
    };

    const cancelEdit = () => {
        taskCell.textContent = originalTask;
        actionsCell.innerHTML = originalActions;
    };

    inputField.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            finishEdit();
        }
    });

    const finishButton = actionsCell.querySelector(".finish");
    const cancelButton = actionsCell.querySelector(".cancel");

    finishButton.addEventListener('click', finishEdit);
    cancelButton.addEventListener('click', cancelEdit);
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
    renderTasks();
   // startCountdown(newTask); // Countdown starten
    taskInput.value = "";
    dateInput.value = "";
};