const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

function generateId() {
    return +new Date();
}

function generateTodoObject(id, title, author, date, isCompleted) {
    return {
        id,
        title,
        author,
        date,
        isCompleted
    }
}

function findTodo(todoId) {
    for (const todoItem of todos) {
        if (todoItem.id === todoId) {
            return todoItem;
        }
    }
    return null;
}

function findTodoIndex(todoId) {
    for (const index in todos) {
        if (todos[index].id === todoId) {
            return index;
        }
    }
    return -1;
}


function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}


function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const todo of data) {
            todos.push(todo);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}


function makeTodo(todoObject) {
    const { id, title, author, date, isCompleted } = todoObject;

    const textTitle = document.createElement('h2');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = author;
    const textdate = document.createElement('p');
    textdate.innerText = date;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textdate);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow')
    container.append(textContainer);
    container.setAttribute('id', `todo-${id}`);

    if (isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.addEventListener('click', function() {
            undoTaskFromCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', function() {
            removeTaskFromCompleted(id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        checkButton.addEventListener('click', function() {
            addTaskToCompleted(id);
        });
        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', function() {
            removeTaskFromCompleted(id);
        });


        container.append(checkButton, trashButton);
    }

    return container;
}

function addTodo() {
    const textTitle = document.getElementById('title').value;
    const textAuthor = document.getElementById('author').value;
    const date = document.getElementById('date').value;

    const generatedID = generateId();
    const todoObject = generateTodoObject(generatedID, textTitle, textAuthor, date, false);
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addTaskToCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);

    if (todoTarget === -1) return;

    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTaskFromCompleted(todoId) {

    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function() {

    const submitForm = document.getElementById('form');

    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addTodo();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

// document.addEventListener(SAVED_EVENT, () => {
//     alert('Data berhasil di simpan.');
// });

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedTODOList = document.getElementById('todos');
    const listCompleted = document.getElementById('completed-todos');

    // clearing list item
    uncompletedTODOList.innerHTML = '';
    listCompleted.innerHTML = '';

    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (todoItem.isCompleted) {
            listCompleted.append(todoElement);
        } else {
            uncompletedTODOList.append(todoElement);
        }
    }
})