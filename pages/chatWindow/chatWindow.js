// pages/chatWindow/chatWindow.js
let amap = require("../../utils/amap");
Page({
  //输入框输入的内容暂存在text里
  InputFocus(){
    //this.data.text = e.detail.value
  },
  InputBlur(){

  },
  //发送消息
  InputSend(e){
    this.setData({
      text : e.detail.value
    })
  },
  send(){
    var page = this;
    wx.request({
      url: 'http://127.0.0.1:81/User/ChatSend',
      data:{
        content : this.data.text,
        sender : this.data.sender,
        getter : this.data.getter
      },
      success:function(res){
        console.log("success");
        page.getRecord();
        page.data.text = "";
      }
    })
  },
  //发送地址
  sendLocation(){
    var page = this;

    amap.getRegeo()
      .then(d => {
        console.log(d[0].longitude);
        console.log(d[0].latitude);
        //let { name, desc, latitude, longitude } = d[0];
       // let { city } = d[0].regeocodeData.addressComponent;
        wx.request({
        url: 'http://127.0.0.1:81/User/LocSend',
        data:{
          longitude:d[0].longitude,
          latitude:d[0].latitude,
          sender:page.data.sender,
          getter:page.data.getter
        },
        success:function(res){
          console.log(res);
          page.getRecord();
        }
      })
      })
      .catch(e => {
        console.log(e);
      })
    
  },

  //获取聊天记录
  getRecord(){
    var page = this;
    //获取到和这个人的聊天记录
    wx.request({
      url: 'http://127.0.0.1:81/User/Chat',
      data: {
        sender: this.data.sender,
        getter: this.data.getter
      },
      success: function (res) {
        console.log(res.data.chat);
        page.setData({
          chatRecord: res.data.chat
        })
      },
      fail: function () {
        console.log("error")
      }
    })
  },

  showModal(e) {
    var content = e.currentTarget.dataset.content;
    var arr = content.split(" ");
    //console.log(arr);
    var longitude = arr[0].split(":");
    var latitude = arr[1].split(":");
    //console.log(longitude);
    this.setData({
      modalName: e.currentTarget.dataset.target,
      longitude:longitude[1],
      latitude: latitude[1]
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    text:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {

    console.log(e);
    let{ sender,getter } = e;
    this.setData({
      sender,getter
    })
    
    //开始时获取一次聊天记录
    this.getRecord();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})