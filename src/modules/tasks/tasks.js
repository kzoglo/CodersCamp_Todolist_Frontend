export const addTask = async function(city){
    $('.showhome').hide();
    $('.content').show();

    $.get('/src/modules/tasks/templates/addTask.mst', function(template) {
        const result = Mustache.to_html(template);
        $('.content').html(result);
       });
};