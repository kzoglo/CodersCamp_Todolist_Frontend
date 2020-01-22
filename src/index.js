// import './style.css';
// import './modules/tasks/tasks.css';
// import './modules/users/users.css';

import addPng from './assets/img/add.png';
import managePng from './assets/img/manage.png';
import timePng from './assets/img/time.png';
import githubPng from './assets/img/github.png';

import { login, register, showDetails } from './modules/users/users.js';
import { addProject } from './modules/projects/projects.js';
// import { addMember } from './modules/members/members.js';
import { addTask, tasksList } from './modules/tasks/tasks.js';

const add = document.querySelector('.add');
const manage = document.querySelector('.manage');
const time = document.querySelector('.time');
const iconFoot = document.getElementById('icon-foot');

add.src = addPng;
manage.src = managePng;
time.src = timePng;
iconFoot.src = githubPng;

window.onload = function() {
  console.log(this.localStorage.getItem('token'));
  if (
    localStorage.getItem('token') === undefined ||
    localStorage.getItem('token') === '' ||
    localStorage.getItem('token') === null
  ) {
    document.getElementById('project-nav').style.display = 'none';
    document.getElementById('tasks-nav').style.display = 'none';
    document.getElementById('user-email-nav').style.display = 'none';
  } else {
    document.getElementById('login').style.display = 'none';
    document.getElementById('register').style.display = 'none';
    let name = JSON.parse(localStorage.getItem('user')).name;
    let surname = JSON.parse(localStorage.getItem('user')).surname;
    document.getElementById('user-email').innerText = `${name} ${surname} `;
  }
};

//users
document.getElementById('login').addEventListener('click', login);
document.getElementById('register').addEventListener('click', register);
document.getElementById('show-details').addEventListener('click', showDetails);
// //projects
document.getElementById('add-project').addEventListener('click', addProject);

//tasks
document.getElementById('add-task').addEventListener('click', addTask);
document.getElementById('list-tasks').addEventListener('click', tasksList);

document.getElementById('homepage').addEventListener('click', function() {
  $('.showhome').show();
  $('.content').hide();
});

document.getElementById('icon-foot').addEventListener('click', function() {
  window.open('https://github.com/goraklaudia/CC_toDoList_frontend', '_blank');
});

document.getElementById('logout').addEventListener('click', function() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.getElementById('login').style.display = 'unset';
  document.getElementById('register').style.display = 'unset';
  document.getElementById('project-nav').style.display = 'none';
  document.getElementById('tasks-nav').style.display = 'none';
  document.getElementById('user-email-nav').style.display = 'none';
  document.getElementById('homepage').click();
});
