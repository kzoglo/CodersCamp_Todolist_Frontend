const URL = 'http://localhost:3000';
const apiPath = '/api/projects';
let ownerVal;

function changeOwnerVal() {
  if (JSON.parse(localStorage.getItem('user')) !== null) {
    ownerVal = JSON.parse(localStorage.getItem('user')).id;
  }
}

export const addProject = function() {
  $('.showhome').hide();
  $('.content').show();
  $.get(`modules/projects/templates/addProject.mst`, function(template) {
    const result = Mustache.render(template);
    $('.content').html(result);
    document.getElementById('xSubmit').addEventListener('click', onSubmitClick);
    afterRender();
  });
};

function afterRender() {
  changeOwnerVal();
  getRequest(ownerVal);
}

function onSubmitClick(e) {
  e.preventDefault();

  const projectVal = document.getElementById('project').value;
  const deadlineVal = document.getElementById('deadline').value;

  changeOwnerVal();
  postRequest(projectVal, deadlineVal, ownerVal);
}

function populateList(arr) {
  const list = document.querySelector('.list-group');
  const html = renderProjects(arr);

  list.innerHTML = html;

  if (html) addListeners();
}

function renderProjects(projects) {
  const elementsArr = projects.map(p => {
    if (p.isActive) {
      const stage = p.stage === 'In progress' ? 'Niewykonany' : 'Zakończony';
      const stageClass = p.stage === 'In progress' ? 'dark' : 'success';

      return `
            <div class="list-group-item">
                <div class="alert alert-light" role="alert">
                    <div class="alert alert-${stageClass}">
                        <div class="row">
                            <div class="col">
                                <span class="h3">${p.name}</span>
                            </div>
                        </div>
                        <div class="row">
                            </div class="col">
                                <span>Do: ${p.deadline}</span>
                            <div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <span>${stage}</span>
                            </div>
                        </div>
                        <div class="row">
                            <button
                                id="btnStage"
                                type="button"
                                data-id="${p._id}"
                                class="btn-isActive btn btn-success col xStage"
                            >
                                Zakończ
                            </button>
                            <button
                                id="btnIsActive"
                                type="button"
                                data-id="${p._id}"
                                class="btn-isActive btn btn-warning col xIsActive"
                            >
                                Usuń
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `;
    }
  });

  return elementsArr.join('');
}

function addListeners() {
  const xs = document.querySelectorAll('.xStage');
  const xia = document.querySelectorAll('.xIsActive');

  xs.forEach(btn => {
    btn.addEventListener('click', e => {
      const _id = e.target.dataset.id;
      const mode = 'STAGE';

      putRequest(_id, mode);
    });
  });

  xia.forEach(btn => {
    btn.addEventListener('click', e => {
      const _id = e.target.dataset.id;
      const mode = 'IS_ACTIVE';

      putRequest(_id, mode);
    });
  });
}

// ---------------- REQUESTS ----------------
async function postRequest(p, d, o) {
  const obj = {
    name: p,
    owner: o,
    deadline: d
  };

  const req = {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj),
    method: 'POST'
  };

  fetch(`${URL}${apiPath}`, req)
    .then(data => {
      return data.json()
    })
    .then(proj => {
      if (proj.message) {
        document.getElementById('validation_msg').innerText = proj.message;
      } else {
        document.getElementById('validation_msg').innerText = '';
        afterRender()
      }
    })
    .catch(err => {
      console.log(err)
    });
}

function putRequest(id, mode) {
  let obj = {};

  switch (mode) {
    case 'IS_ACTIVE':
      obj = { id: id, isActive: false };
      break;
    case 'STAGE':
      obj = { id: id, stage: 'Finished', isActive: true };
      break;
  }

  const req = {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj),
    method: 'PUT'
  };

  fetch(`${URL}${apiPath}/${id}`, req)
    .then(data => data.json())
    .then(proj => {
      console.log(proj);
      afterRender();
    })
    .catch(err => console.log(err));
}

function getRequest(ownerVal) {
  fetch(`${URL}${apiPath}/${ownerVal}`)
    .then(data => data.json())
    .then(project => populateList(project))
    .catch(err => {
      console.log(err);
    });
}
