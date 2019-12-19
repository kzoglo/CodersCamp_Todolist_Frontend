const apiPath = '/api/projects';
let projectVal = '';
let deadlineVal = '';
let ownerVal = JSON.parse(localStorage.getItem('user')).id;

export const addProject = function(){
    $('.showhome').hide();
    $('.content').show();
    $.get('/src/modules/projects/templates/addProject.mst', function(template) {
        const result = Mustache.to_html(template);
        $('.content').html(result);
        afterAddProject();
    });
};

function afterAddProject(){
    // console.log(ownerVal)
    document.getElementById('xSubmit').addEventListener('click', onSubmitClick);

    const project = document.getElementById('project');
    const deadline = document.getElementById('deadline');
    

    project.addEventListener('focusout', (e) => {
        // console.log(e.target.value)
        projectVal = e.target.value
    })
    
    deadline.addEventListener('focusout', (e) => {
        // console.log(e.target.value)
        deadlineVal = e.target.value;
    })

    getRequest(ownerVal);
}

function onSubmitClick(e){
    e.preventDefault();

    const response = postRequest(projectVal, deadlineVal, ownerVal);

    if(response) addProject();
}

function populateList(arr){
    const list = document.querySelector('.list-group')
    const html = renderProjects(arr);

    list.innerHTML = html
    
    if(html) addListeners();
}

function renderProjects(projects) {
    // console.log(projects)
    const elementsArr = projects.map(p => {
        if(p.isActive){
            const stage = p.stage === 'In progress' ? 'Niewykonany' : 'Zakończony';
            const stageClass = p.stage === 'In progress' ? 'dark' : 'success'
            
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

function addListeners(){
    const xs = document.querySelectorAll('.xStage')
    const xia = document.querySelectorAll('.xIsActive')
    // console.log('addListeners()', xs)

    xs.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const _id = e.target.dataset.id;
            const mode = 'STAGE';

            putRequest(_id, mode);
            addProject();
        })
    })

    xia.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const _id = e.target.dataset.id;
            const mode = 'IS_ACTIVE'

            putRequest(_id, mode);
            addProject();
        })
    })

}

// ---------------- REQUESTS ----------------
async function postRequest(p, d, o){
    const obj = {
        name: p,
        owner: o,
        deadline: d
    }

    console.log(JSON.stringify(obj))

    const req = {
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj),
        method: 'POST'
    }

    fetch(`http://localhost:3000${apiPath}`, req)
        .then(data => data.json())
        .then(proj => console.log(proj))
        .catch(err => console.log(err))
}

function putRequest(id, mode){
    // console.log('putReq', mode, id)
    let obj = {};

    switch(mode){
        case 'IS_ACTIVE':
            obj = { id: id, isActive: false };
            break;
        case 'STAGE':
            obj = { id: id, stage: 'Finished', isActive: true };
            break;
    }

    // console.log(obj)

    const req = {
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj),
        method: 'PUT'
    }

    // console.log(req)

    fetch(`http://localhost:3000${apiPath}/${id}`, req)
        .then(data => data.json())
        .then(proj => console.log(proj))
        .catch(err => console.log(err))
}

function getRequest(ownerVal){
    fetch(`http://localhost:3000${apiPath}/${ownerVal}`)
        .then(data => data.json())
        .then(project => populateList(project))
        .catch(err => {console.log(err);});
}
