// Generiert eine eindeutige ID für jede Aufgabe
const getId = () => {
    let id;
    do {
        const array = new Uint32Array(1);
        id = window.crypto.getRandomValues(array)[0];
    } while (tasks.open.some(task => task.id === id) || tasks.done.some(task => task.id === id));
    return id;
};

// Lädt die Aufgaben aus dem localStorage
const loadTasks = () => {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : { open: [], done: [] };
};

// Speichert die Aufgaben im localStorage
const saveTasks = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Initialisiert die Aufgaben mit den geladenen Daten
let tasks = loadTasks();

// Filtert die Aufgaben basierend auf der Suchanfrage
const searchTasks = (query) => {
    return query === "" ? tasks.open : tasks.open.filter(task => task.task.includes(query) || task.createdAt.includes(query));
};

// Rendert die Aufgaben in der Tabelle
const renderTasks = (query = "") => {
    const filteredTasks = searchTasks(query);

    // Offene Aufgaben rendern
    const tasksBody = filteredTasks.map(currentTask => `
        <div class="row" data-id="${currentTask.id}" draggable="true" ondragstart="onDragStart(event)" ondragover="onDragOver(event)" ondrop="onDrop(event)">
            <div class="cell" class="task-cell">${currentTask.task}</div>
            <div class="cell">${currentTask.createdAt}</div>
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

    addEventListeners();
};

// Fügt eine neue Aufgabe hinzu
const addTask = (event) => {
    event.preventDefault();
    const taskInput = document.getElementById("taskInput");

    if (taskInput.value.trim() === "") {
        taskInput.setCustomValidity("Bitte etwas eintragen!");
        taskInput.reportValidity();
        return;
    } else {
        taskInput.setCustomValidity("");
    }

    const newTask = {
        id: getId(),
        task: taskInput.value,
        createdAt: new Date().toLocaleString()
    };

    tasks.open.push(newTask);
    saveTasks(tasks);
    renderTasks();
    taskInput.value = "";
};

// Löscht eine Aufgabe
const deleteTask = (id, isCompleted) => {
    if (isCompleted) {
        tasks.done = tasks.done.filter(task => task.id !== id);
    } else {
        tasks.open = tasks.open.filter(task => task.id !== id);
    }
    saveTasks(tasks);
    renderTasks();
};

// Verschiebt eine Aufgabe zu "Erledigt"
const moveToCompleted = (id) => {
    const taskIndex = tasks.open.findIndex(task => task.id === id);
    if (taskIndex > -1) {
        const [task] = tasks.open.splice(taskIndex, 1);
        tasks.done.push(task);
        saveTasks(tasks);
        renderTasks();
    }
};

// Bearbeitet eine Aufgabe
const editTask = (id) => {
    const taskRow = document.querySelector(`tr[data-id="${id}"]`);
    const taskCell = taskRow.querySelector(".task-cell");
    const originalTask = taskCell.textContent;
    taskCell.innerHTML = `<input type="text" value="${originalTask}" />`;
    const inputField = taskCell.querySelector("input");
    inputField.focus();
    inputField.setSelectionRange(inputField.value.length, inputField.value.length);

    const actionsCell = taskCell.nextElementSibling.nextElementSibling;
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
        addEventListeners();
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

// Fügt Event Listener hinzu
const addEventListeners = () => {
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

// Drag-and-Drop Handler
const onDragStart = (event) => {
    event.dataTransfer.setData('text/plain', event.target.dataset.id);
    event.currentTarget.style.backgroundColor = 'yellow';
};

const onDragOver = (event) => {
    event.preventDefault();
};

const onDrop = (event) => {
    event.preventDefault();
    const id = event.dataTransfer.getData('text');
    // Logik für das Verschieben oder Sortieren von Aufgaben bei Drag-and-Drop ergänzen.
};

// Dark Mode Funktionalität
const toggleDarkMode = () => {
    const body = document.body;
    const button = document.getElementById('darkModeToggle');

    body.classList.toggle('dark-mode');

    // Ändere das Icon des Buttons
    if (body.classList.contains('dark-mode')) {
        button.innerHTML = '🌞'; // Sonne für Light Mode
    } else {
        button.innerHTML = '🌙'; // Mond für Dark Mode
    }
};

// Event Listener für den Dark Mode Button
document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

// Initiales Rendern der Aufgaben
renderTasks();
