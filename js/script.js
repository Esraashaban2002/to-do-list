const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
const notification = document.querySelector('#notification');

// Load tasks from localStorage
document.addEventListener('DOMContentLoaded', loadTasks);

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task.text, task.completed));
}

// Add task event listener
taskForm.addEventListener('submit', addTask);

// Add task
function addTask(e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    addTaskToDOM(taskText, false);
    saveTask(taskText, false);

    taskInput.value = ''; // Clear the input
    showNotification('Task added successfully.');
}

// Add task to DOM
function addTaskToDOM(taskText, completed) {
    const li = document.createElement('li');
    if (completed)li.classList.add('completed');

    li.innerHTML = `
        <span>${taskText}</span>
        <div>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </div>
    `;

    taskList.appendChild(li);

    setTimeout(() => {
        li.classList.add('show');
    }, 200);

    // Mark as completed
    li.addEventListener('click', () => {
        // e.preventDefault()
        li.classList.toggle('completed');
        updateTaskStatus(taskText);
    });

    // Delete task
    li.querySelector('.delete').addEventListener('click', () => {
        li.remove();
        deleteTask(taskText);
        showNotification('Task deleted successfully.');
    });

    // Edit task
    li.querySelector('.edit').addEventListener('click', () => {
        const newText = prompt('Edit task', taskText);
        if (newText && newText.trim() !== '') {
            li.querySelector('span').textContent = newText;
            editTask(taskText, newText.trim());
            showNotification('Task edited successfully.');
        }
    });
}

// Save task to localStorage
function saveTask(text, completed) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text, completed });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update task status in localStorage
function updateTaskStatus(taskText) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(task => {
        if (task.text === taskText) task.completed = !task.completed;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Delete task from localStorage
function deleteTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Edit task in localStorage
function editTask(oldText, newText) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(task => {
        if (task.text === oldText) task.text = newText;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Show notification
function showNotification(message) {
    notification.textContent = message;
    notification.classList.remove('hidden');
    setTimeout(() => notification.classList.add('hidden'), 2000);
}
