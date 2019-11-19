let choosedate = null;
let cities = ['北京','上海','广州','深圳','杭州','长沙','西安','武汉','成都','南京','合肥','济南'];
window.onload = function(){
    //给start，dest动态添加option元素
    /*
    alert(111);
    let s = document.getElementById('start');
    for(let i=0;i <cities.length;i++) {
        alert(222);
         let option  = new Option(cities[i],i.toString());
         s.options[i+1] = option;
    }
    alert(333);*/
    //获取用户名
    let xhr = new XMLHttpRequest();
    xhr.open('GET','/getUser',true);
    xhr.send();
    xhr.onreadystatechange = function () {
        //alert(xhr.responseText);
        let username = xhr.responseText.replace('{','');
        username = username.replace('}','');
        username = username.replace(/\"/g,'');
        username = username.split(':')[1];
        if(username === null){
            alert('您尚未登录！');
        }
        document.getElementById('username').innerText = username;
    };
};
layui.use('element', function(){
    let element = layui.element;
});
layui.use('layer',function () {
    let layer = layui.layer;
});
layui.use('form',function(){
      let form = layui.form;
      //cities();
      //监听提交
      form.on('submit(formDemo)', function(data) {
          layer.msg(JSON.stringify(data.field));
          return false;
      });
});
layui.use('laydate',function(){
      let laydate = layui.laydate;
      //执行一个laydate实例
      laydate.render({
          elem: '#datetime', //指定元素
          type: 'date', //年月日选择器
          min: 0,//限定日期范围,不能选择过去的日期
          max: 30, //从现在开始30天内可选
          showBottom:false,//不显示底部栏
          change: function (value,date,endDate) {
              choosedate = value;//把值设置到choosedate变量中
              alert(value);
          }
      });
});
layui.use('table', function () {
    let table = layui.table;
    table.on('tool(test)', function (obj) {
        let data = obj.data;//获取该行数据
        let layEvent = obj.event;//获取该点击事件
        //alert(data.train_num);
        if(layEvent === 'buyTicket'){
            if(data.hasTicket === false){
                alert('该车次票已售完');
            }
            else{
                //设置cookie
                let strData = JSON.stringify(data);//将data对象序列化成字符串
                choosedate = document.getElementById('datetime').innerText.trim()
                strData = strData+",date:"+choosedate;
                //alert(strData);
                document.cookie = "strData="+strData;
                setTimeout(1000);
                window.location = '/showBuyTicket';
            }

        }
    });
    table.on('tool(time_table)',function (obj) {
        let layEvent = obj.event;//获取该点击事件
        if(layEvent === 'add'){
            layer.open({
                type:2,
                content:'pages/addtrain.html',
                area:['600px', '400px']
            });
        }else if(layEvent === 'delete'){
            let data = obj.data;
            let strdata = JSON.stringify(data);
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/deleteTrain', true);
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhr.send('data='+strdata);
            setTimeout(1000);
            window.location = '/manageTrains';
        }
    });
    table.on('tool(users)', function(obj){
        let data = obj.data;
        let layEvent = obj.event;
        if(layEvent === 'delete'){
            layer.open({
                content:'确认删除用户？',
                btn:['确认','取消'],
                yes:function(index, layero){
                    //删除用户
                    let strData = JSON.stringify(data);
                    let xhr = new XMLHttpRequest();
                    xhr.open('POST','/deleteUser',true);
                    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    xhr.send('strData='+strData);
                    setTimeout(3000);
                    window.location.reload();
                },
                btn2:function(index, layero){
                    //取消删除，关闭窗口
                    layer.close(index);
                }
            })
        }
    });
    table.on('tool(seats)',function (obj) {
        let layEvent = obj.event;//获取该点击事件
        if(layEvent === 'add'){
            layer.open({
                type:2,
                content:'pages/addseat.html',
                area:['600px', '400px']
            });
        }else if(layEvent === 'delete'){
            let data = obj.data;
            layer.open({
                content:'确认删除座位？',
                btn:['确认','取消'],
                yes:function(index, layero){
                    //删除座位
                    let strData = JSON.stringify(data);
                    let xhr = new XMLHttpRequest();
                    xhr.open('POST','/deleteSeat',true);
                    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    xhr.send('data='+strData);
                    setTimeout(3000);
                    window.location.reload();
                },
                btn2:function(index, layero){
                    //取消删除，关闭窗口
                    layer.close(index);
                }
            })
        }
    });
    /*table.render({
      elem: '#demp'
      ,url: ''
      ,parseData: function(res){ //res 即为原始返回的数据
        return {
          "code": res.code, //解析接口状态
          "msg": res.message, //解析提示文本
          "count": res.total, //解析数据长度
          "data": res.data //解析数据列表
        };
      }
      //,…… //其他参数
    });*/
});
function submitForms() {
    //提交查询表单
    let start = document.getElementById('start').value;
    let dest = document.getElementById('dest').value;
    choosedate = document.getElementById('datetime').innerText.trim();
    let xhr = new XMLHttpRequest();
    xhr.open('POST','/change',true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send('start='+start+'&dest='+dest+'&date='+choosedate);
    //tableIns.reload();
    setTimeout('submitForms()',3000);
    window.location = '/index';
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