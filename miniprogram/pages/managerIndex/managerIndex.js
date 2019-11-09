const db = wx.cloud.database();
Page({


  /**
   * 页面的初始数据
   */
  data: {
    message: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;
    db.collection('repair_orders').where({
      status: _.eq(3)
    })
      .get().then(res => {
        console.log('length:', res.data.length);
        if (res.data.length > 0) {
          that.setData({
            message: '您好，现在一共有 ' + res.data.length + ' 条的新的设备报修申请,请在保修单中查看并分配'
          })
        } else {
          that.setData({
            message: '您好，暂无新的设备报修申请'
          })
        }

      })
  },

  chart: function () {
    wx.navigateTo({
      url: '../../manager/charts/charts'
    })
  },
  new_orders: function () {
    wx.navigateTo({
      url: '../../manager/newOrders/newOrders'
    })
  },
  pople_manage:function(){
    wx.navigateTo({
      url: '../../manager/peopleManage/peopleManage'
    })
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

  },

  facility_input: function () {
    //console.log('test')
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode'],
      success(res) {
        //打印ISBN码
        console.log(res.result)
        wx.navigateTo({
          //url: '../facilityInfo/facilityInfo',
          url: '../../cusService/facilityInfo/facilityInfo?facilityid=' + res.result,
        })
      },
      fail(res) {
        console.log(res)
      }

    })
  }

})