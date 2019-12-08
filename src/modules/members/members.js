export const addMember = async function(city){
    $('.showhome').hide();
    $('.content').show();
    $.get('/src/modules/members/templates/addMember.mst', function(template) {
        const result = Mustache.to_html(template);
        $('.content').html(result);
       });
};