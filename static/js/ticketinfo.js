window.onload = function(){
    let xhr = new XMLHttpRequest();
    xhr.open('GET','/getUser',true);
    xhr.send();
    xhr.onreadystatechange = function () {
        //alert(xhr.responseText);
        let username = xhr.responseText.replace('{','');
        username = username.replace('}','');
        username = username.replace(/\"/g,'');
        username = username.split(':')[1];
        document.getElementById('username').innerText = username;
    };
};
layui.use('element', function(){
    let element = layui.element;
});
layui.use('layer',function () {
    let layer = layui.layer;
});
layui.use('form', function () {
    let form = layui.form;
});
window.onload = function () {
    let data = document.cookie.replace('{', '');
    data = data.replace('}', '');
    data = data.replace(/\"/g, '');
    data = data.split('=')[1];
    data = data.split(',');

    let name = data[0].split(':')[1];
    let identity = data[1].split(':')[1];
    let smartphone = data[2].split(':')[1];
    let train_num = data[3].split(':')[1];
    let starts = data[4].split(':')[1];
    let dest = data[5].split(':')[1];
    let choosedate = data[6].split(':')[1];
    let s_time = data[7].split(':')[1]+':'+data[7].split(':')[2];
    let d_time = data[8].split(':')[1]+':'+data[8].split(':')[2];

    document.getElementById('name').innerText = name;
    document.getElementById('identity').innerText = identity;
    document.getElementById('smartphone').innerText = smartphone;
    document.getElementById('train_num').innerText = train_num;
    document.getElementById('starts').innerText = starts;
    document.getElementById('dest').innerText = dest;
    document.getElementById('choosedate').innerText = choosedate;
    document.getElementById('s_time').innerText = s_time;
    document.getElementById('d_time').innerText = d_time;
    //name:tribbleofjim,identity:333,smartphone:333,train_num:G107,starts:北京南,
    // dest:上海虹桥,choosedate:2019-08-04,s_time:08:05,d_time:13:46
};
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