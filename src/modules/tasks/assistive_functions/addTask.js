import { URL } from '../tasks';

/***** ASSISTIVE FUNCTIONS *****/
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

      fetch(`${URL}/api/tasks/`, {
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

/***** EXPORTS *****/
export const createTask = () => {
  document.querySelector('.add-task-btn').addEventListener('click', postTask);
};

export const loadingPage = () => {
  const wrapper = document.querySelector('.wrapper');
  const loader = document.querySelector('.ui.active');
  const projectsListSelect = document.getElementById('assigned-select');
  let userId = JSON.parse(localStorage.getItem('user')).id;

  fetch(`${URL}/api/projects/${userId}`)
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
};

export const validationInput = () => {
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
};
