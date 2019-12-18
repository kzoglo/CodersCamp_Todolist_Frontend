export const addProject = async function(city) {
  $('.showhome').hide();
  $('.content').show();
  $.get('/addProject.mst', function(template) {
    const result = Mustache.to_html(template);
    $('.content').html(result);
  });
};
