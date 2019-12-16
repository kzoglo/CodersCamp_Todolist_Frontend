
import '../src/style.css';
import 'babel-polyfill';
import { login, register, showDetails } from './modules/users/users.js';
import { addProject } from './modules/projects/projects.js';
import { addMember } from './modules/members/members.js';
import { addTask } from './modules/tasks/tasks.js';

//users
document.getElementById('login').addEventListener('click', login);
document.getElementById('register').addEventListener('click', register);
document.getElementById('show-details').addEventListener('click', showDetails);

//projects
document.getElementById('add-project').addEventListener('click', addProject);

//tasks
document.getElementById('add-task').addEventListener('click', addTask);

//members
document.getElementById('add-member').addEventListener('click', addMember);


document.getElementById('homepage').addEventListener('click', function() {
    $('.showhome').show();
    $('.content').hide();
});
