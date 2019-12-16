export const addTask = async function(city) {
  $('.showhome').hide();
  $('.content').show();

  $.get('/src/modules/tasks/templates/addTask/addTask.mst', function(template) {
    const result = Mustache.to_html(template);
    $('.content').html(result);
  });
};

export const tasksList = async function(city) {
  $('.showhome').hide();
  $('.content').show();

  $.get('/src/modules/tasks/templates/tasksList/tasksList.mst', function(
    template
  ) {
    const result = Mustache.to_html(template);
    $('.content').html(result);
  });
};
