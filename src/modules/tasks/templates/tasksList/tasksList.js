/****** VARIABLES ******/
const title = document.querySelector('.title');
const closeBtn = document.querySelector('.closeBtn');
const modalWrapper = document.querySelector('.modal-wrapper');
const descrShort = document.querySelector('.descrShort');
const descrLong = document.querySelector('.descrLong');
const creator = document.querySelector('.creator');
const dateStart = document.querySelector('.dateStart');
const dateEnd = document.querySelector('.dateEnd');
const assigned = document.querySelector('.assigned-list');
const weight = document.querySelector('.weight');
const startBtn = document.querySelector('.start-task-btn');
const tasksListContainer = document.querySelector('.tasks-container');
let documents; // Gets list of tasks on page load
let taskDocument; // Currently displayed task
const URL = 'http://127.0.0.1:3000/api/tasks';

/****** ASSISTIVE FUNCTIONS ******/
const renderTask = tasks => {
  // Renders task list items
  const elementsArr = tasks.map(task => {
    const status = task.status ? 'W trakcie' : 'Nie podjęte';
    const statusColor = task.status ? '#4caf50' : '#f50303';
    return `
      <div class="task-module" data-id=${task._id}>
        <span style="background:${statusColor};" class="task-status">${status}</span>
        <span class="task-description">${task.descrShort}</span>
        <span class='deleteBtn'>Usuń</span>
      </div>
    `;
  });

  return elementsArr.join('');
};

const deleteTask = async id => {
  const erase = await fetch(`${URL}/${id}`, {
    method: 'DELETE'
  });
  const deleted = await erase.json();
  console.log(`Document has been deleted properly.`);
};

/****** FETCHING DATA ******/
// Loads documents on page start
const request = fetch(`${URL}`, {
  method: 'GET'
});

request
  .then(tasks => tasks.json())
  .then(tasks => {
    console.log(tasks);
    documents = tasks;
    tasksListContainer.innerHTML = renderTask(tasks);
  })
  .catch(err => {
    console.log(err);
  });

/****** EVENT LISTENERS ******/
// Closes task's details
closeBtn.addEventListener('click', e => {
  modalWrapper.style.display = 'none';
});

window.addEventListener('keydown', e => {
  console.log(e);
  if (e.key === 'Escape') {
    modalWrapper.style.display = 'none';
  }
});

// Displays modal window with task's details or erases a task
tasksListContainer.addEventListener('click', e => {
  // Gets id of a clicked task and saves it's id on a modalWrapper element
  const id = e.target.parentElement.dataset.id;
  modalWrapper.dataset.id = id;

  // Gets a clicked task
  taskDocument = documents.find(document => {
    return document._id === id;
  });

  // Erases a task
  if (e.target.classList.item(0) === 'deleteBtn') {
    deleteTask(id);
    tasksListContainer.removeChild(e.target.parentElement);
  }
  // Displays modal window with task's details
  else {
    // Assistive variables for setting values into a modal window
    const startDate = new Date(taskDocument.dateStart);
    const endDate = taskDocument.dateEnd
      ? new Date(taskDocument.dateEnd)
      : 'nieokreślone';

    const descrLongRender = taskDocument.descrLong
      ? `${taskDocument.descrLong}`
      : 'Brak opisu zadania';

    const assignedRender =
      taskDocument.assigned.length !== 0
        ? taskDocument.assigned
            .map(person => {
              return `
        <li>${person}</li>
      `;
            })
            .join('')
        : 'Brak';

    // Sets proper values into a modal window
    descrShort.textContent = taskDocument.descrShort;
    creator.textContent = `${taskDocument.creator}`;
    dateStart.textContent = `${startDate.getDate() + 1}.${startDate.getMonth() +
      1}.${startDate.getFullYear()}`;
    assigned.innerHTML = assignedRender;
    dateEnd.textContent =
      endDate !== 'nieokreślone'
        ? `${endDate.getDate() + 1}.${endDate.getMonth() +
            1}.${endDate.getFullYear()}`
        : `${endDate}`;
    descrLong.innerHTML = descrLongRender;
    weight.textContent = taskDocument.weight;

    //Start button value
    console.log(taskDocument.status);
    taskDocument.status === true
      ? (startBtn.textContent = 'Zamknij')
      : (startBtn.textContent = 'Rozpocznij');

    // Makes modal window visible
    modalWrapper.style.display = 'block';
  }
});

// Starts working on a task
startBtn.addEventListener('click', async e => {
  try {
    if (!taskDocument.status) {
      // Makes a PUT request in order to update db (changes status of task)
      const id = modalWrapper.dataset.id;
      console.log(`${URL}/${id}`);
      const response = await fetch(`${URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: true })
      });
      const json = await response.json();

      /* 
      Changes value for a clicked task(updated document) in documents variable to prevents application from
      making an another GET request for all documents, because one has been updated 
      */
      documents.filter(document => {
        return document._id === id ? (taskDocument.status = true) : null;
      });

      // Changes status color and description on displayed task
      const tasksArray = Array.from(tasksListContainer.children);
      const statusElement = tasksArray.find(element => {
        return element.dataset.id === id;
      });
      statusElement.firstElementChild.style.backgroundColor = '#4caf50';
      statusElement.firstElementChild.textContent = 'W trakcie';

      // Changes button name
      json.status === true ? (startBtn.textContent = 'Zamknij') : 'Rozpocznij';
    } else {
      // Close modal window if task already started
      modalWrapper.style.display = 'none';
    }
  } catch (err) {
    console.log(err.message);
  }
});
