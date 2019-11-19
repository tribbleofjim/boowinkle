let train_num = null;
let s_time = null;
let starts = null;
let d_time = null;
let dest = null;
let choosedate = null;

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
        alert(username);
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

    train_num = data[0].split(':')[1];
    s_time = data[1].split(':')[1]+":"+data[1].split(':')[2];
    starts = data[2].split(':')[1];
    d_time = data[3].split(':')[1]+":"+data[3].split(':')[2];
    dest = data[4].split(':')[1];
    choosedate = data[6].split(':')[1];

    document.getElementById('train_num').value = train_num;
    document.getElementById('s_time').value = s_time;
    document.getElementById('starts').value = starts;
    document.getElementById('d_time').value = d_time;
    document.getElementById('dest').value = dest;
    document.getElementById('choosedate').value = choosedate;

};
function buyTicket() {
    let name = document.getElementById('name').value;
    let identity = document.getElementById('identity').value;
    let smartphone = document.getElementById('smartphone').value;

    //设置cookie
    let data = {
        'name':name,
        'identity':identity,
        'smartphone':smartphone,
        'train_num':train_num,
        'starts':starts,
        'dest':dest,
        'choosedate':choosedate,
        's_time':s_time,
        'd_time':d_time
    };
    let strData = JSON.stringify(data);
    document.cookie = 'strData='+strData;

    //发送请求
    let xhr = new XMLHttpRequest();
    xhr.open('POST','/buyTicket',true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send('name='+name+'&identity='+identity+'&smartphone='
        +smartphone+'&train_num='+train_num+'&starts='+starts
        +'&dest='+dest+'&choosedate='+choosedate+'&s_time='+s_time+'&d_time='+d_time);
    setTimeout(1000);
    window.location = '/showTicketInfo';
}

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
//{"train_num":"G107","s_time":"08:05","starts":"北京南","d_time":"13:46","dest":"上海虹桥","hasTicket":true}
//strData="train_num":"G107","s_time":"08:05","starts":"北京南",
// "d_time":"13:46","dest":"上海虹桥","hasTicket":true