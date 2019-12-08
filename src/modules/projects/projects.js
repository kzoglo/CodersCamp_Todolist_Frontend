export const addProject = async function(city){
    $('.showhome').hide();
    $('.content').show();
    $.get('/src/modules/projects/templates/addProject.mst', function(template) {
        const result = Mustache.to_html(template);
        $('.content').html(result);
       });
};