import { setDocumentsVar } from './displayTaskDetails';
import { URL } from '../tasks';

/***** ASSISTIVE FUNCTIONS *****/
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

/***** EXPORTS *****/
export const renderTasksList = () => {
  const tasksListContainer = document.querySelector('.tasks-container');
  let userId = JSON.parse(localStorage.getItem('user')).id;
  let token = localStorage.getItem('token');

  const request = fetch(`${URL}/api/tasks/${userId}`, {
    method: 'GET',
    headers: {
      'x-auth-token': token
    }
  });

  request
    .then(tasks => tasks.json())
    .then(tasks => {
      setDocumentsVar(tasks);
      tasksListContainer.innerHTML = renderTask(tasks);
    })
    .catch(err => {
      console.log(err);
    });
};

export const closeTasksDetails = () => {
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
};

export const deleteTask = async id => {
  const erase = await fetch(`${URL}/api/tasks/${id}`, {
    method: 'DELETE'
  });
  const deleted = await erase.json();
  if (deleted) console.log(`Document has been deleted properly.`);
};
