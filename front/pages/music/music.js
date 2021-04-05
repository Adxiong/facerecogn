// pages/music/music.js
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  AudioCtx : null,
  data: {
    playStatus:false,
    currentCheck:-1,
    musiclist:[]
  },
  play:function(e){
    var index = e.currentTarget.dataset.no
    this.setData({
      currentCheck:index
    })
    var songInfo = this.data.musiclist[index]
    this.AudioCtx.title = songInfo.title,
    this.AudioCtx.singer = songInfo.authoer,
    this.AudioCtx.src = songInfo.url
    this.AudioCtx.play()
    this.setData({playStatus:true})
  },
  pause:function(){
    this.AudioCtx.pause()
    this.setData({playStatus:false})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      musiclist:App.globaldata.musicList
    })
    // console.log(this.data.musiclist)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.AudioCtx = wx.getBackgroundAudioManager()
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