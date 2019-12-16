export const login = async function(city){
    $('.showhome').hide();
    $('.content').show();
    render();
};

function render() {
    $.get('/src/modules/users/templates/login.mst', function(template) {
     const result = Mustache.to_html(template);
     $('.content').html(result);
    });
   }
   

export const register = async function(city){
    $('.showhome').hide();
    $('.content').show();
    $.get('/src/modules/users/templates/register.mst', function(template) {
        const result = Mustache.to_html(template);
        $('.content').html(result);
       });
};

export const showDetails = async function(city){
    $('.showhome').hide();
    $('.content').show();
    $.get('/src/modules/users/templates/showDetails.mst', function(template) {
        const result = Mustache.to_html(template);
        $('.content').html(result);
       });
};