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
layui.use('table', function () {
    let table = layui.table;
    table.on('tool(test)', function (obj) {
        let data = obj.data;//获取该行数据
        let layEvent = obj.event;//获取该点击事件
        //alert(data.train_num);
        if(layEvent === 'refund'){
            //退票请求
            //弹框进行确认
            layer.open({
                content: '确认退票？',
                btn: ['退票','取消'],
                yes:function(index, layero){
                    //退票回调函数
                    let strData = JSON.stringify(data);
                    let xhr = new XMLHttpRequest();
                    xhr.open('POST','/refund',true);
                    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    xhr.send('strData='+ strData);
                    xhr.onreadystatechange = function () {
                        setTimeout(1000);
                        window.location.reload();
                    };
                },
                btn2:function (index, layero) {
                    //取消退票，关闭窗口
                    layer.close(index);
                }
            });
            
        }else if(layEvent === 'changeTicket'){
            //改签请求
            //弹框进行确认
            layer.open({
                content: '确认改签？一经确认，原有的票将被退回',
                btn: ['改签','取消'],
                yes:function(index, layero){
                    //改签回调函数
                    let strData = JSON.stringify(data);
                    let xhr = new XMLHttpRequest();
                    xhr.open('POST','/changeTicket',true);
                    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    xhr.send('strData='+ strData);
                    xhr.onreadystatechange = function () {
                        setTimeout(1000);
                        window.location = '/index';
                    };
                },
                btn2:function (index, layero) {
                    //取消退票，关闭窗口
                    layer.close(index);
                }
            });
        }
    });
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