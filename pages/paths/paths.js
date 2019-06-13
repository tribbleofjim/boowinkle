//index.js
//获取应用实例
const app = getApp()
let wechat = require("../../utils/wechat");
let amap = require("../../utils/amap");

Page({
  data: {
    //StatusBar: app.globalData.StatusBar,
    //CustomBar: app.globalData.CustomBar,
    height: wx.getSystemInfoSync().windowHeight,
    latitude: 36,
    longitude: 117,
    playIndex: 0,
    totalIndex: -1,
    controls: [
      {
        id: 0,
        position: {
          left: 10,
          top: 200,
          width: 40,
          height: 40
        },
        iconPath: "/images/circle1.png",
        clickable: true
      }
    ],
    timer: null,
    markers: [],
    polyline: [],
    pointsInfo: []
  },
  regionchange(e) {
    //console.log(e.type)
  },
  markertap(e) {
    //console.log(e.markerId)
  },
  controltap(e) {
    //console.log(e.controlId)
  },
  beginTrack: function (e) {

  },
  onLoad: function (options) {
    var that = this;
    
    //开始时获取当前地理信息
    amap.getRegeo()
      .then(d => {
        console.log(d);
        let { name, desc, latitude, longitude } = d[0];
        let { city } = d[0].regeocodeData.addressComponent;
        this.setData({
          city,
          latitude,
          longitude,
          textData: { name, desc }
        })
      })
      .catch(e => {
        console.log(e);
      })

    wx.request({
      url: 'http://127.0.0.1:81/Location/getTrack',
      data: {
        beginTime: "开始时间",
        endTime: "结束时间"
      },
      method: "post",
      success: function (res) {
        console.log(res);
        that.setData({
          pointsInfo: res.data.pointsInfos,
          polyline: [{
            points: res.data.points,
            color: "#FF0000DD",
            width: 4,
            dottedLine: true
          }],
          markers: [{
            iconPath: '../../images/marker.png',
            id: 0,
            latitude: res.data.points[0].latitude,
            longitude: res.data.points[0].longitude,
            width: 30,
            height: 30,
            title: that.data.brandNumber,
            callout: {
              content: ' 时间：' + res.data.pointsInfos[0].create_time ,
              color: "#000000",
              fontSize: 13,
              borderRadius: 2,
              bgColor: "#fff",
              display: "ALWAYS",
              boxShadow: "5px 5px 10px #aaa"
            }
          }],
          latitude: res.data.points[0].latitude,
          longitude: res.data.points[0].longitude,
        })
      }
    })
  },
  /**
   * 开始
   */
  beginTrack: function () {
    var that = this;
    //var i = that.data.playIndex == 0 ? 0 : that.data.playIndex;
    var i = 0;
    var j = that.data.totalIndex + 1;
    that.timer = setInterval(function () {
      i++
      that.setData({
        playIndex: i,
        //totalIndex: j,
        latitude: that.data.polyline[0].points[i].latitude,
        longitude: that.data.polyline[0].points[i].longitude,
        markers: [{
          iconPath: '../../images/car',
          id: 0,
          latitude: that.data.polyline[0].points[i].latitude,
          longtitude: that.data.polyline[0].points[i].longtitude,
          width: 30,
          height: 30,
          title: that.data.brandNumber,
          callout: {
            content: ' 时间：' + that.data.pointsInfo[i].create_time ,
            color: "#000000",
            fontSize: 13,
            borderRadius: 2,
            bgColor: "#fff",
            display: "ALWAYS",
            boxShadow: "5px 5px 10px #aaa"
          }
        }]
      })
      if ((i + 1) >= that.data.polyline[0].points.length) {
        that.endTrack();
      }
    }, 500)
  },
  /**
   * 暂停
   */
  pauseTrack: function () {
    var that = this;
    clearInterval(this.timer)
  },
  /**
   * 结束
   */
  endTrack: function () {
    var that = this;
    var i = that.data.playIndex;
    var j = that.data.totalIndex;
    that.setData({
      //playIndex: 0,
      latitude: that.data.polyline[0].points[i].latitude,
      longitude: that.data.polyline[0].points[i].longitude,
      markers: [{
        iconPath: '../../images/marker_checked.png',
        id: 0,
        latitude: that.data.polyline[0].points[i].latitude,
        longitude: that.data.polyline[0].points[i].longitude,
        width: 30,
        height: 30,
        title: that.data.brandNumber,
        callout: {
          content: ' 时间：' + that.data.pointsInfo[0].create_time,
          color: "#000000",
          fontSize: 13,
          borderRadius: 2,
          bgColor: "#fff",
          display: "ALWAYS",
          boxShadow: "5px 5px 10px #aaa"
        }
      }]
    })
    clearInterval(this.timer)
  }
})