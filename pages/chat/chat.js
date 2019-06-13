// pages/chat/chat.js
const app = getApp();
Page({
  //跳转个人中心
  person(){
    wx.navigateTo({
      url: '/pages/person/person'
    })
  },
  //打开对话框
  openChat(e) {
    console.log(e);
    let url = '/pages/chatWindow/chatWindow?sender='+app.globalData.username+'&getter='+'测试号1';
    wx.navigateTo({ url });
  },
  data: {
    
  },
  onLoad: function () {
    
  },
  bindGetUserInfo(res) {
    console.log(res);
    if (res.detail.userInfo) {
      console.log("点击了同意授权");
      console.log(res.detail.userInfo.nickName);
      getApp().globalData.username = res.detail.userInfo.nickName;
      this.setData({
        nickName:res.detail.userInfo.nickName
      })
      wx.request({
        url: 'http://127.0.0.1:81/User/login',
        data:{
          nickname:this.data.nickName
        },
        //method:'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        success:function(res){
          console.log("success");
        },
        fail:function(res){
          console.log("error");
        }
      })
    } else {
      console.log("点击了拒绝授权");
    }
  }

})
