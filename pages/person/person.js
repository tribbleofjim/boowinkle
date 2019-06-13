// pages/person/person.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  markertap(e){
    console.log(e);
    let url = "/pages/chatWindow/chatWindow?sender="+app.globalData.username+"&getter="+e.markerId;
    wx.navigateTo({ url });
  },

  data: {
    controls: [{
      id: 1,
      iconPath: '../../images/marker_checked.png',
      position: {
        left: 10,
        top: 200,
        width: 25,
        height: 40
      },
      clickable: true
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var page = this;
    wx.request({
      url: 'http://127.0.0.1:81/Location/getLocations',
      success:function(res){
        console.log(res);
        let markers = [];
        for(var i = 0;i<res.data.points.length;i++){
          markers[i] = {
            iconPath: "../../images/marker.png",
            id: res.data.points[i].username,
            latitude: res.data.points[i].latitude,
            longitude: res.data.points[i].longitude,
            callout: {
              content: ' 用户: ' + res.data.points[i].username,
              color: "#000000",
              fontSize: 13,
              borderRadius: 2,
              bgColor: "#fff",
              display: "ALWAYS",
              boxShadow: "5px 5px 10px #aaa"
            },
            width: 25,
            height: 40
          }
        }
        page.setData({
          markers: markers
        })
      },
      fail:function(res){
        console.log(res);
      }
    });
    
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