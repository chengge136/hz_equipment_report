const db = wx.cloud.database();
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newHistoryOrders: [],
    newRecallHistoryOrders: [],
    phoneRepairOrders:[],
    newRepaireLength:0,
    recallRepaireLength:0,
    phoneRepairLength:0,
    element: '',
    export_date:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;

    db.collection('repair_orders').where({
      status: _.eq(1),
      reportType: _.eq(0)
    }).orderBy('createtime', 'desc')
      .get({
        success: function (res) {
          // res.data 是包含以上定义的两条记录的数组
          console.log(res.data)

          for (var index in res.data) {
            res.data[index].createtime = app.formatDate(new Date(res.data[index].report_id));
          }

          that.setData({
            newHistoryOrders: res.data,
            newRepaireLength: res.data.length
          })
        }
      })

    //客户电话报修，前台无扫码提交
    db.collection('repair_orders').where({
      status: _.eq(1),
      reportType: _.eq(1)
    }).orderBy('createtime', 'desc')
      .get({
        success: function (res) {
          // res.data 是包含以上定义的两条记录的数组
          console.log('phoneRepairLength' + res.data.length)
          for (var index in res.data) {
            res.data[index].createtime = app.formatDate(new Date(res.data[index].report_id));
          }
          that.setData({
            phoneRepairOrders: res.data,
            phoneRepairLength: res.data.length

          })
        }
      })

    db.collection('recall_repair_order').where({
      status: _.eq(1)
    }).orderBy('createtime', 'desc').get({
        success: function (res) {
          // res.data 是包含以上定义的两条记录的数组
          console.log(res.data)

          for (var index in res.data) {
            res.data[index].createtime = app.formatDate(new Date(res.data[index].report_id));
          }

          that.setData({
            newRecallHistoryOrders: res.data,
            recallRepaireLength: res.data.length
          })
        }
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
  onChange(e) {
    this.setData({
      element: e.detail
    });
  },

  onClick() {
    var that=this;
    const _ = db.command;

    if (that.data.element==''){
      wx.showToast({
        title: '请先输入搜索的关键字',
        icon: 'none',
        duration: 3000
      })
    }else{
      console.log('搜索:' + that.data.element);
      db.collection('repair_orders').where(
        _.or([
          {
            status: _.eq(1),
            reportType: _.eq(0),
            contactor: {
              $regex: '.*' + that.data.element,
            }
          },
          {
            status: _.eq(1),
            reportType: _.eq(0),
            facilityOrg: {
              $regex: '.*' + that.data.element,
            }
          }
        ])).orderBy('createtime', 'desc').get({
          success: function (res) {
            // res.data 是包含以上定义的两条记录的数组
            console.log(res.data)

            for (var index in res.data) {
              res.data[index].createtime = app.formatDate(new Date(res.data[index].report_id));
            }

            that.setData({
              newHistoryOrders: res.data,
              newRepaireLength: res.data.length
            })
          }
        })

      //客户电话报修，前台无扫码提交
      db.collection('repair_orders').where(_.or([
        {
          status: _.eq(1),
          reportType: _.eq(1),
          contactor: {
            $regex: '.*' + that.data.element,
          }
        },
        {
          status: _.eq(1),
          reportType: _.eq(1),
          facilityOrg: {
            $regex: '.*' + that.data.element,
          }
        }
      ])).orderBy('createtime', 'desc')
        .get({
          success: function (res) {
            // res.data 是包含以上定义的两条记录的数组
            console.log('phoneRepairLength' + res.data.length)
            for (var index in res.data) {
              res.data[index].createtime = app.formatDate(new Date(res.data[index].report_id));
            }
            that.setData({
              phoneRepairOrders: res.data,
              phoneRepairLength: res.data.length

            })
          }
        })

      db.collection('recall_repair_order').where(_.or([
        {
          status: _.eq(1),
          contactor: {
            $regex: '.*' + that.data.element,
          }
        },
        {
          status: _.eq(1),
          facilityOrg: {
            $regex: '.*' + that.data.element,
          }
        }
      ])).orderBy('createtime', 'desc').get({
        success: function (res) {
          // res.data 是包含以上定义的两条记录的数组
          console.log(res.data)

          for (var index in res.data) {
            res.data[index].createtime = app.formatDate(new Date(res.data[index].report_id));
          }

          that.setData({
            newRecallHistoryOrders: res.data,
            recallRepaireLength: res.data.length
          })
        }
      })
    }
    
  },
  bindDateChange(event) {
    console.log(event.detail.value);
    var start = event.detail.value + '-01';
    var end = event.detail.value + '-30';
    var data_start = new Date(start);
    var data_end = new Date(end);
    //获得时间戳
    var time_start = data_start.getTime();
    var time_end = data_end.getTime();
    //var localtime = new Date().toLocaleDateString();

    console.log(time_start, 'VVV', time_end);
    this.setData({
      export_date: event.detail.value,
    });

    var that = this;
    const _ = db.command;

    db.collection('repair_orders').where(_.and([
      {
        status: _.eq(1),
        reportType: _.eq(0),
        report_id: _.gte(time_start),
      },
      {
        report_id: _.lte(time_end)
      }
    ])).orderBy('createtime', 'desc')
      .get({
        success: function (res) {
          // res.data 是包含以上定义的两条记录的数组
          console.log(res.data)

          for (var index in res.data) {
            res.data[index].createtime = app.formatDate(new Date(res.data[index].report_id));
          }

          that.setData({
            newHistoryOrders: res.data,
            newRepaireLength: res.data.length
          })
        }
      })

    //客户电话报修，前台无扫码提交
    db.collection('repair_orders').where(_.and([
      {
        status: _.eq(1),
        reportType: _.eq(1),
        report_id: _.gte(time_start),
      },
      {
        report_id: _.lte(time_end)
      }
    ])).orderBy('createtime', 'desc')
      .get({
        success: function (res) {
          // res.data 是包含以上定义的两条记录的数组
          console.log('phoneRepairLength' + res.data.length)
          for (var index in res.data) {
            res.data[index].createtime = app.formatDate(new Date(res.data[index].report_id));
          }
          that.setData({
            phoneRepairOrders: res.data,
            phoneRepairLength: res.data.length

          })
        }
      })

    db.collection('recall_repair_order').where(_.and([
      {
        status: _.eq(1),
        report_id: _.gte(time_start),
      },
      {
        report_id: _.lte(time_end)
      }
    ])).orderBy('createtime', 'desc').get({
      success: function (res) {
        // res.data 是包含以上定义的两条记录的数组
        console.log(res.data)

        for (var index in res.data) {
          res.data[index].createtime = app.formatDate(new Date(res.data[index].report_id));
        }

        that.setData({
          newRecallHistoryOrders: res.data,
          recallRepaireLength: res.data.length
        })
      }
    })

  }

})