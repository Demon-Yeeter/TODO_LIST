
import { toggleDarkMode } from './darkMode.js';
import { startCountdown } from './countdown.js';
import { addTask, deleteTask, moveToCompleted, editTask, renderTasks, tasks} from './taskManager.js';
import { addEventListeners } from './renderer.js';
import './draganddrop.js';



// Event Listener für den Dark Mode Button
document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
document.getElementById('taskForm').addEventListener('submit', addTask);

addEventListeners();
renderTasks();