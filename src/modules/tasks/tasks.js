import {
  loadingPage,
  validationInput,
  createTask
} from './assistive_functions/addTask';

import {
  renderTasksList,
  closeTasksDetails
} from './assistive_functions/renderTasksList';

import {
  displayTaskDetails,
  startTask
} from './assistive_functions/displayTaskDetails';

/***** GLOBAL VARIABLES *****/
const appName = 'CodersCamp_Todolist_Frontend';

/***** EXPORTS *****/
export const URL = 'https://todo-list-coderscamp.herokuapp.com/';

export const addTask = async function() {
  $('.showhome').hide();
  $('.content').show();

  $.get(`${appName}/modules/tasks/templates/addTask/addTask.mst`, function(
    template
  ) {
    const result = Mustache.render(template);
    $('.content').html(result);
    loadingPage();
    validationInput();
    createTask();
  });
};

export const tasksList = async function() {
  $('.showhome').hide();
  $('.content').show();

  $.get(`${appName}/modules/tasks/templates/tasksList/tasksList.mst`, function(
    template
  ) {
    const result = Mustache.render(template);
    $('.content').html(result);
    renderTasksList();
    displayTaskDetails();
    startTask();
    closeTasksDetails();
  });
};
