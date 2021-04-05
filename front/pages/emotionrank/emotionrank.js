// pages/emotionrank/emotionrank.js
let Charts = require('../../utils/wxcharts');
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var title = App.globaldata.emotionrank.title
    var point = App.globaldata.emotionrank.point
    var workstats = App.globaldata.workstats
    new Charts({
      canvasId: 'mychart-1',
      dataPointShape: "circle",
      type: 'line',
      extra: {
      lineStyle: 'curve' //线条的形状（弧形）
      },
      categories: title,
      series: [{
      name: '情绪值',
      data: point,//设置某一个值为null会出现断层
      format: function (val) {
        return val.toFixed(2);
        }
      }],
      yAxis: {
      title: '歌曲情绪平均值',
      format: function (val) {
      return val.toFixed(2);
      },
      fontColor: "red",
      titleFontColor: "red",
      min: 0,
      gridColor:"red"
      },
      width: 256,
      height: 290,
      dataLabel: true
      });
    new Charts({
      canvasId: 'mychart-2',
      type: 'pie',
      series: workstats,
      width: 256,
      height: 290,
      dataLabel: true,
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