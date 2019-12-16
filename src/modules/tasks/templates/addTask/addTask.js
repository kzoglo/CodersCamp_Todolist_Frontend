const form = document.querySelector('.task-elements-form');
const loader = document.querySelector('.ui.active');
const validationInfo = document.querySelector('.validation-info');
const inputDescr = document.querySelector('.description-short-input');

const body = document.body;
const wrapper = document.querySelector('.wrapper');

/***** EVENT LISTENERS *****/
// Input content validation
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

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const searchParams = new URLSearchParams();

  for (const pair of formData) {
    searchParams.append(pair[0], pair[1]);
  }

  fetch('http://127.0.0.1:3000/api/tasks/', {
    method: 'POST',
    body: searchParams
  })
    .then(resp => {
      return resp.text();
    })
    .then(resp => {
      console.log(resp);
    })
    .catch(err => {
      console.log(err.message);
    });
});

/***** Temporarly artificial loading page -> later it's going to fetch friends from db *****/
// window.addEventListener('load', e => {
//   wrapper.style.display = 'block';
//   loader.style.display = 'none';
// });

setTimeout(() => {
  wrapper.style.display = 'block';
  loader.style.display = 'none';
}, 1000);
