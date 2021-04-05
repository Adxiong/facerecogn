// pages/home/index.js

const App = getApp()
const addrPath={
  personalInfo : '/pages/personalInfo/personalInfo',
  photoWall : "/pages/photoWall/photoWall",
  music:"/pages/music/music",
  ability:"/pages/ability/ability",
  emotionrank:"/pages/emotionrank/emotionrank"
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoSource:"",
    CameraStatus:false,
    direction:"front"
  },
  closeCamera:function(){
    this.setData({CameraStatus:false})
  },
  switchCamDir:function(){
    var result = this.data.direction=="back"?"front":"back"
    console.log(result)
    this.setData({direction:result})
  },
  navigateTo:function(e){
    var target = e.currentTarget.dataset
    wx.navigateTo({
      url: addrPath[target.path],
    })
  },
  switchTab:function(e){
    var target = e.currentTarget.dataset
    wx.switchTab({
      url: addrPath[target.path],
    })
  },
  showCamera:function(){
    wx.showActionSheet({
      itemList: ["从相册中加载","拍照"],
      success : res => {
        if(res.tapIndex==0){
          wx.chooseImage({
            count: 1,
            success: res=> {
              const image_base64 = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0] , "base64")
              console.log(image_base64)
              this.setData({ photoSource:res.tempFilePaths})
              wx.showLoading({
                title: '正在请求',
              })
              console.log(image_base64)
              this.request(image_base64)
            }
          })
        }else if (res.tapIndex ==1){
          this.setData({CameraStatus:true })
        }
      }
    })
  },takePhoto:function(){
    this.cameraContext = wx.createCameraContext()
    this.cameraContext.takePhoto({
      quality:"high",
      success:(res)=>{
        const image_base64 = wx.getFileSystemManager().readFileSync(res.tempImagePath,"base64")
        this.setData({photoSource:res.tempImagePath,CameraStatus:false})
        wx.showLoading({
          title: '正在请求',
        })
        console.log(image_base64)
        this.request(image_base64)
      },
      fail:()=>{
        console.log("失败")
      }
    })
  },
  request:function(image_base64){
    wx.request({
      url: 'http://alongz.cn:2239/upface',
      method:"POST",
      data:{face:image_base64},
      success:res =>{
        console.log(res)
        console.log("基本信息：",res.data.workstats)
        if(res.data.msg == "OK"){
          App.globaldata.name = res.data.name
          App.globaldata.info = res.data.info
          App.globaldata.workstats = res.data.workstats
          console.log("全局信息：",App.globaldata)
        }
        else{
          wx.showToast({
            title: '识别失败',
          })
        }
        wx.hideLoading()
        wx.request({
          url: 'http://alongz.cn:2239/getphotolist?name='+App.globaldata.name,
          success:res=>{
            if(res.data.msg == "OK"){
              App.globaldata.photoList = res.data.photolist
            }
          },
          fail:err=>{
            console.log(err)
          }
        })
        wx.request({
          url: 'http://alongz.cn:2239/getmusiclist?name='+App.globaldata.name,
          success:res=>{
            console.log("音乐请求：",res)
            if(res.data.msg == "OK"){
              App.globaldata.musicList = res.data.item.musiclist
              App.globaldata.emotionrank = res.data.item.emotionrank || {}
            }
            console.log("全局信息：",App.globaldata)
          },
          fail:err=>{
            console.log(err)
          }
        })
      },
      fail:err=>{
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '网络错误',
        })
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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