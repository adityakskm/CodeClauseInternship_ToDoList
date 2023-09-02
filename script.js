// Constants
const TODO_INPUT_CLASS = "todo-input";
const TODO_BUTTON_CLASS = "todo-button";
const TODO_LIST_CLASS = "todo-list";
const FILTER_OPTION_CLASS = "filter-todo";

// Element creation function
function createElement(tag, classes, innerHTML = "") {
    const element = document.createElement(tag);
    if (classes) element.classList.add(...classes);
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

// Event listener setup
function setupEventListeners() {
    const todoButton = document.querySelector(`.${TODO_BUTTON_CLASS}`);
    const todoList = document.querySelector(`.${TODO_LIST_CLASS}`);
    const filterOption = document.querySelector(`.${FILTER_OPTION_CLASS}`);

    todoButton.addEventListener("click", addTodo);
    todoList.addEventListener("click", deleteCheck);
    filterOption.addEventListener("change", filterTodo);
}

// DOMContentLoaded event
document.addEventListener("DOMContentLoaded", () => {
    getLocalTodos();
    setupEventListeners();
});

// Add todo function
function addTodo(event) {
    event.preventDefault();
    const todoInput = document.querySelector(`.${TODO_INPUT_CLASS}`);
    const todoList = document.querySelector(`.${TODO_LIST_CLASS}`);
    const newTodoText = todoInput.value.trim();

    if (newTodoText === "") return;

    const todoDiv = createElement("div", ["todo"]);
    const newTodo = createElement("li", ["todo-item"], newTodoText);
    todoDiv.appendChild(newTodo);

    const completedButton = createElement("button", ["complete-btn"], '<i class="fas fa-check-circle"></i>');
    const trashButton = createElement("button", ["trash-btn"], '<i class="fas fa-trash"></i>');

    todoDiv.appendChild(completedButton);
    todoDiv.appendChild(trashButton);

    todoList.appendChild(todoDiv);
    todoInput.value = "";

    // Adding to local storage
    saveLocalTodos(newTodoText);
}

// Delete or check todo function
function deleteCheck(e) {
    const item = e.target;
    const todoList = document.querySelector(`.${TODO_LIST_CLASS}`);

    if (item.classList.contains("trash-btn")) {
        const todo = item.parentElement;
        todo.classList.add("slide");

        removeLocalTodos(todo);
        todo.addEventListener("transitionend", () => {
            todo.remove();
        });
    }

    if (item.classList.contains("complete-btn")) {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    }
}

// Filter todo function
function filterTodo() {
    const filterOption = document.querySelector(`.${FILTER_OPTION_CLASS}`);
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        switch (filterOption.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                todo.style.display = todo.classList.contains("completed") ? "flex" : "none";
                break;
            case "incomplete":
                todo.style.display = !todo.classList.contains("completed") ? "flex" : "none";
                break;
        }
    });
}

// Local storage functions
function saveLocalTodos(todo) {
    const todos = getLocalTodosArray();
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodosArray() {
    return JSON.parse(localStorage.getItem("todos")) || [];
}

function getLocalTodos() {
    const todos = getLocalTodosArray();
    const todoList = document.querySelector(`.${TODO_LIST_CLASS}`);

    todos.forEach((todoText) => {
        const todoDiv = createElement("div", ["todo"]);
        const newTodo = createElement("li", ["todo-item"], todoText);
        todoDiv.appendChild(newTodo);

        const completedButton = createElement("button", ["complete-btn"], '<i class="fas fa-check-circle"></i>');
        const trashButton = createElement("button", ["trash-btn"], '<i class="fas fa-trash"></i>');

        todoDiv.appendChild(completedButton);
        todoDiv.appendChild(trashButton);

        todoList.appendChild(todoDiv);
    });
}

function removeLocalTodos(todo) {
    const todoText = todo.querySelector(".todo-item").innerText;
    const todos = getLocalTodosArray();
    const todoIndex = todos.indexOf(todoText);

    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}
