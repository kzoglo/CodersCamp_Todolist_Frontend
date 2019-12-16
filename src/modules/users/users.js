import { userInfo } from "os";

const urlServer = 'http://127.0.0.1:3000/api/';
// var id = '';
// var token = '';

export const login = async function(city){
    $('.showhome').hide();
    $('.content').show();
    $.get('/src/modules/users/templates/login.mst', function(template) {
        const result = Mustache.to_html(template);
        $('.content').html(result);
        doAfterLog();
    });
};

export const register = async function(city){
    $('.showhome').hide();
    $('.content').show();
    $.get('/src/modules/users/templates/register.mst', function(template) {
        const result = Mustache.to_html(template);
        $('.content').html(result);
        doAfterReg();
    });
};

export const showDetails = async function(city){
    $('.showhome').hide();
    $('.content').show();
    doAfterSD();
};

//register

function doAfterReg() {
    document.getElementById('register-btn').addEventListener('click', postUser);
}

function doAfterLog(){
    document.getElementById('login-btn').addEventListener('click', getToken);
    document.getElementById('register-login').addEventListener('click', register);
}

function doAfterSD(){
    fetch(urlServer+'users/'+id, {method: 'GET',})
    .then(data => data.json())
    .then(user => {
        $.get('/src/modules/users/templates/showDetails.mst', function(template) {
            const result = Mustache.to_html(template, user);
            $('.content').html(result);
        });
    })
    .catch(err => {console.log(err);});
}

function getToken() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    console.log(` e ${email} p ${password} `);

    const User = {
        'email': email,
        'password': password
    }

    const otherParam = {
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(User),
        method: 'POST'
    }

    fetch(urlServer+'auth', otherParam)
    .then(data => data.json())
    .then(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        let name = JSON.parse(localStorage.getItem('user')).name;
        let surname = JSON.parse(localStorage.getItem('user')).surname;
        document.getElementById('user-email').innerText = `${name} ${surname} `;
        document.getElementById('login').style.display = "none";
        document.getElementById('register').style.display = "none";    
        document.getElementById('member-nav').style.display = "unset";
        document.getElementById('project-nav').style.display = "unset";
        document.getElementById('tasks-nav').style.display = "unset";
        document.getElementById('user-email-nav').style.display = "unset";
        document.getElementById("list-projects").click();

    })
    .catch(err => {console.log(err);});
}

function postUser() {
    console.log('register');
    let name = document.getElementById('name').value;
    let surname = document.getElementById('surname').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let password2 = document.getElementById('password2').value;
    console.log(` n ${name} s ${surname} e ${email} p ${password} p2 ${password2}`);

    if(password !== password2) {
        document.getElementById('msg').innerText= 'Hasła muszą być identyczne.';
    } else {
        document.getElementById('msg').innerText= '';
        const User = {
            'name': name,
            'surname': surname,
            'email': email,
            'password': password
        }

        const otherParam = {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(User),
            method: 'POST'
        }

        fetch(urlServer+'users', otherParam)
        .then(data => data.json())
        .then(user => {console.log(user);})
        .catch(err => {console.log(err);});

    }
}

