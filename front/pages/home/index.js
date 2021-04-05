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
    direction:"front",
    tips:[
      {
        "m_title": "美媒：共和党怕失去支持 或明年1月才承认拜登当选",
        "m_image_url": "http://t10.baidu.com/it/u=2322348267,3546884867&fm=173&app=49&f=JPEG?w=312&h=208&s=45F438C400C805559C75AD870300E082"
      },{
        "m_title": "美国人指路时喜欢说“block”，那这“block..",
        "m_image_url": "http://t12.baidu.com/it/u=2874763913,206646862&fm=173&app=49&f=JPEG?w=312&h=208&s=6742F715669C73D01F3054C70300F031"
      },{
        "m_title": "沙漠中一处“神秘”村庄，白天出现晚上消失，当地人不..",
        "m_image_url": "http://t11.baidu.com/it/u=4275166576,928260900&fm=173&app=49&f=JPEG?w=312&h=208&s=809E837D5FB3E0471A29597C0300E038"
      },{
        "m_title": "“只有傻瓜才会不看好中国。”",
        "m_image_url": "http://t10.baidu.com/it/u=1805294703,34643195&fm=173&app=49&f=JPEG?w=312&h=208&s=26202AAE427701965880A49203001081"
      },{
        "m_title": "拜登终于等到这一天：翻不了的盘 快组完的队",
        "m_image_url": "http://t10.baidu.com/it/u=1361935248,2252766567&fm=173&app=49&f=JPEG?w=312&h=208&s=BA947985441F83D25C6075920300E080"
      },{
        "m_title": "这十种旅游纪念品千万别买：不要花了钱，却把霉运带回..",
        "m_image_url": "http://t10.baidu.com/it/u=1604801568,2099601925&fm=173&app=49&f=JPEG?w=312&h=208&s=21AB6DB740027FFDDE2D4D2603009063"
      }
    ]
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
    if(App.globaldata.name === "无名氏"){
      wx.showModal({
        title:"错误",
        content:"请上传人脸照片后，再使用此功能",
        success:res=>{
          if(res.confirm){
            this.setData({CameraStatus:true})
          } else if(res.cancel){
            console.log("取消")
          }
        },
        cancelColor: 'cancelColor',
      })
    }else{
    wx.navigateTo({
      url: addrPath[target.path],
    })}
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
          wx.getSetting({
            success:res=>{
              if(res.authSetting["scope.camera"]){
                this.setData({CameraStatus:true })
              }else{
                wx.showToast({
                  title: '没有开启摄像头权限',
                })
              }
            }
          })
          
        }
      }
    })
  },takePhoto:function(){
    this.cameraContext = wx.createCameraContext()
    this.cameraContext.takePhoto({
      quality:"high",
      success:(res)=>{
        console.log(res)
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
      url: 'https://alongz.cn/upface',
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
          url: 'https://alongz.cn/getphotolist?name='+App.globaldata.name,
          success:res=>{
            console.log(res)
            if(res.data.msg == "OK"){
              App.globaldata.photoList = res.data.photolist
            }
          },
          fail:err=>{
            console.log(err)
          }
        })
        wx.request({
          url: 'https://alongz.cn/getmusiclist?name='+App.globaldata.name,
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