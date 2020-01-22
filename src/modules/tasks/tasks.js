const URL = 'http://127.0.0.1:3000/api/tasks';

let documents; // Gets list of tasks on page load
let taskDocument; // Currently displayed task

export const addTask = async function(city) {
  $('.showhome').hide();
  $('.content').show();

  $.get('/modules/tasks/templates/addTask/addTask.mst', function(template) {
    const result = Mustache.render(template);
    $('.content').html(result);
    loadingPage();
    validationInput();
    createTask();
  });
};

export const tasksList = async function(city) {
  $('.showhome').hide();
  $('.content').show();

  $.get('/modules/tasks/templates/tasksList/tasksList.mst', function(template) {
    const result = Mustache.to_html(template);
    $('.content').html(result);
    renderTasksList();
    displayTaskDetails();
    startTask();
    closeTasksDetails();
  });
};

/***** ADD TASK *****/
function createTask() {
  document.querySelector('.add-task-btn').addEventListener('click', postTask);
}

function loadingPage() {
  const wrapper = document.querySelector('.wrapper');
  const loader = document.querySelector('.ui.active');
  const projectsListSelect = document.getElementById('assigned-select');
  let userId = JSON.parse(localStorage.getItem('user')).id;

  fetch(`http://127.0.0.1:3000/api/projects/${userId}`)
    .then(resp => resp.json())
    .then(resp => {
      wrapper.style.display = 'block';
      loader.style.display = 'none';

      if (resp.length !== 0) {
        const projectsList = resp
          .map(project => {
            return `
            <option value="${project.name}">${project.name}</option>
          `;
          })
          .join('');

        projectsListSelect.innerHTML = projectsList;
      } else {
        projectsListSelect.setAttribute('disabled', 'true');
      }
    })
    .catch(err => {
      console.log(err.message);
      wrapper.style.display = 'block';
      loader.style.display = 'none';
    });
}

function validationInput() {
  const inputDescr = document.querySelector('.description-short-input');
  const validationInfo = document.querySelector('.validation-info');

  inputDescr.addEventListener('blur', e => {
    e.target.classList.add(
      'description-short-input-valid',
      'description-short-input-invalid'
    );
  });

  inputDescr.addEventListener('invalid', e => {
    validationInfo.classList.add('validation-info-after');
    setTimeout(() => {
      validationInfo.classList.remove('validation-info-after');
    }, 2000);
  });
}

function postTask() {
  const form = document.querySelector('.task-elements-form');
  const savedInfo = document.querySelector('.saved-info');
  let userId = JSON.parse(localStorage.getItem('user')).id;
  let token = localStorage.getItem('token');

  form.addEventListener('submit', e => {
    e.preventDefault();

    if (e.handled !== true) {
      //Prevents jQuery events from firing multiple times
      const formData = new FormData(form);
      const searchParams = new URLSearchParams();

      for (const pair of formData) {
        searchParams.append(pair[0], pair[1]);
      }

      searchParams.append('creator', userId);

      fetch('http://127.0.0.1:3000/api/tasks/', {
        method: 'POST',
        body: searchParams,
        headers: {
          'x-auth-token': token
        }
      })
        .then(resp => {
          return resp.text();
        })
        .then(resp => {
          savedInfo.textContent = resp;
          savedInfo.classList.add('saved-info-visible');
          setTimeout(() => {
            savedInfo.classList.remove('saved-info-visible');
          }, 2000);
        })
        .catch(err => {
          console.log(err.message);
          savedInfo.textContent = err.message;
          savedInfo.classList.add('saved-info-visible');
          setTimeout(() => {
            savedInfo.classList.remove('saved-info-visible');
          }, 2000);
        });

      e.handled = true;
    }
  });
}

/***** TASKS LIST *****/
function renderTask(tasks) {
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
}

function renderTasksList() {
  const tasksListContainer = document.querySelector('.tasks-container');
  let userId = JSON.parse(localStorage.getItem('user')).id;
  let token = localStorage.getItem('token');

  const request = fetch(`${URL}/${userId}`, {
    method: 'GET',
    headers: {
      'x-auth-token': token
    }
  });

  request
    .then(tasks => tasks.json())
    .then(tasks => {
      documents = tasks;
      tasksListContainer.innerHTML = renderTask(tasks);
    })
    .catch(err => {
      console.log(err);
    });
}

const deleteTask = async id => {
  const erase = await fetch(`${URL}/${id}`, {
    method: 'DELETE'
  });
  const deleted = await erase.json();
  if (deleted) console.log(`Document has been deleted properly.`);
};

function displayTaskDetails() {
  const tasksListContainer = document.querySelector('.tasks-container');
  const modalWrapper = document.querySelector('.modal-wrapper');
  const descrShort = document.querySelector('.descrShort');
  const descrLong = document.querySelector('.descrLong');
  const dateStart = document.querySelector('.dateStart');
  const dateEnd = document.querySelector('.dateEnd');
  const assignedProject = document.querySelector('.assigned-project');
  const weight = document.querySelector('.weight');
  const startBtn = document.querySelector('.start-task-btn');

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
        : 'Nieokreślone';

      const descrLongRender = taskDocument.descrLong
        ? `${taskDocument.descrLong}`
        : 'Brak opisu zadania';

      const assignedProjectRender = taskDocument.project
        ? `${taskDocument.project}`
        : 'Brak';

      // Sets proper values into a modal window
      descrShort.textContent = taskDocument.descrShort;
      dateStart.textContent = `${startDate.getDate() +
        1}.${startDate.getMonth() + 1}.${startDate.getFullYear()}`;
      assignedProject.innerHTML = assignedProjectRender;
      dateEnd.textContent =
        endDate !== 'Nieokreślone'
          ? `${endDate.getDate() + 1}.${endDate.getMonth() +
              1}.${endDate.getFullYear()}`
          : `${endDate}`;
      descrLong.innerHTML = descrLongRender;
      weight.textContent = taskDocument.weight;

      //Start button value
      taskDocument.status === true
        ? (startBtn.textContent = 'Zamknij')
        : (startBtn.textContent = 'Rozpocznij');

      // Makes modal window visible
      modalWrapper.style.display = 'block';
    }
  });
}

function startTask() {
  const tasksListContainer = document.querySelector('.tasks-container');
  const modalWrapper = document.querySelector('.modal-wrapper');
  const startBtn = document.querySelector('.start-task-btn');

  startBtn.addEventListener('click', async e => {
    try {
      if (!taskDocument.status) {
        // Makes a PUT request in order to update db (changes status of task)
        const id = modalWrapper.dataset.id;
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
        json.status === true
          ? (startBtn.textContent = 'Zamknij')
          : 'Rozpocznij';
      } else {
        // Close modal window if task already started
        modalWrapper.style.display = 'none';
      }
    } catch (err) {
      console.log(err.message);
    }
  });
}

function closeTasksDetails() {
  const closeBtn = document.querySelector('.closeBtn');
  const modalWrapper = document.querySelector('.modal-wrapper');

  closeBtn.addEventListener('click', e => {
    modalWrapper.style.display = 'none';
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      modalWrapper.style.display = 'none';
    }
  });
}
