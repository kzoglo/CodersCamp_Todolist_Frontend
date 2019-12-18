export const addMember = async function(city) {
  $('.showhome').hide();
  $('.content').show();
  $.get('/addMember.mst', function(template) {
    const result = Mustache.to_html(template);
    $('.content').html(result);
  });
};
