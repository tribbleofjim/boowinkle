let u_num = null;
let username = null;
let password = null;
window.onload = function(){
    let xhr = new XMLHttpRequest();
    xhr.open('GET','/getAllAboutUser',true);
    xhr.send();
    xhr.onreadystatechange = function () {
        //alert(xhr.responseText);
        //{"u_num": "123", "username": "张三", "password": "222"}
        if(xhr.responseText === 'nologin'){
            alert("您尚未登录！");
        }
        else{
            let user = xhr.responseText.replace('{','');
            user = user.replace('}','');
            user = user.replace(/\"/g,'');
            u_num = user.split(',')[0].split(':')[1];
            username = user.split(',')[1].split(':')[1];
            password = user.split(',')[2].split(':')[1];
            document.getElementById('username').innerText = username;
            document.getElementById('user').innerText = username;
            document.getElementById('u_num').innerText = u_num;
        }
    };
};
layui.use('element', function(){
    let element = layui.element;
});
layui.use('layer',function () {
    let layer = layui.layer;
});
function manageUsers() {
    let username = document.getElementById('username').innerText;
    if(username === 'Admin'){
        setTimeout('submitForms()',3000);
        window.location = '/manageUsers';
    }else{
        layer.open({
            content: '您没有管理员权限！'
        });
    }
}
function manageTrains() {
    let username = document.getElementById('username').innerText;
    if(username === 'Admin'){
        setTimeout('submitForms()',3000);
        window.location = '/manageTrains';
    }else{
        layer.open({
            content: '您没有管理员权限！'
        });
    }
}
function manageSeats() {
    let username = document.getElementById('username').innerText;
    if(username === 'Admin'){
        setTimeout('submitForms()',3000);
        window.location = '/manageSeats';
    }else{
        layer.open({
            content: '您没有管理员权限！'
        });
    }
}
function changePassword(){
    layer.open({
        type: 2,
        content: 'pages/changepassword.html',
        area:['600px','300px']
    });
}