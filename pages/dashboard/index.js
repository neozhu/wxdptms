import Page from '../../common/page';
import Toast from 'vant-weapp/toast/toast';
import Notify from 'vant-weapp/notify/notify';
import moment from 'moment';
const baseurl = 'https://www.guangzhoushizhuo.xyz/api';
Page({
  data: {
    activeName: [],
    list: [],
    phonenumber: null,
    activestatus: null
  },
  onLoad(options) {
    const phonenumber = wx.getStorageSync('phonenumber');
    this.setData({
      phonenumber: phonenumber
    });
    this.loadPageData(phonenumber, '110')
  },
  onChangeCollapse(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  doshipping(event) {
    Toast.loading({
      mask: true,
      message: 'wait...'
    });
    const url = `${baseurl}/SHIPORDERs/DoShipping/${event.currentTarget.dataset.id}`;
    wx.request({
      url: url,
      success: res => {
        Toast.clear();
        console.log(res);
        if (res.data.success) {
          Notify({
            type: 'success',
            message: `发运完成`
          });
          this.loadPageData(this.data.phonenumber, this.data.activestatus);
        }
      },
      fail: res => {
        Notify({
          type: 'danger',
          message: `提交失败`
        });
      }
    })
  },
  docompleted(event) {
    Toast.loading({
      mask: true,
      message: 'wait...'
    });
    const url = `${baseurl}/SHIPORDERs/DoCompleted/${event.currentTarget.dataset.id}`;
    wx.request({
      url: url,
      success: res => {
        Toast.clear();
        console.log(res);
        if (res.data.success) {
          Notify({
            type: 'success',
            message: `配送完成`
          });
          this.loadPageData(this.data.phonenumber, this.data.activestatus);
        }
      },
      fail: res => {
        Notify({
          type: 'danger',
          message: `提交失败`
        });
      }
    })
  },
  doclosed(event) {
    wx.chooseImage({
      count: 1, // 默认9 
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有 
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
        var tempFilePaths = res.tempFilePaths
        this.setData({
          textHidden: true,
          image_photo: tempFilePaths,
          photoHidden: false
        });
        Toast.loading({
          mask: true,
          message: '上传图片...'
        });
        wx.uploadFile({
          url: `${baseurl}/Default/UploadFile`,
          filePath: this.data.image_photo[0],
          name: event.currentTarget.dataset.orderkey,
          formData: {
            'OrderKey': event.currentTarget.dataset.orderkey,
            'User': this.data.phonenumber,
            'Description': 'POD回单照片'
          },
          success: (res) => {
            console.log(res);
            const url = `${baseurl}/SHIPORDERs/DoClosed/${event.currentTarget.dataset.id}`;
            wx.request({
              url: url,
              success: res => {
                Toast.clear();
                if (res.data.success) {
                  Notify({
                    type: 'success',
                    message: `结案完成`
                  });
                  this.loadPageData(this.data.phonenumber, this.data.activestatus);
                }
              },
              fail: res => {
                Toast.clear();
                Notify({
                  type: 'danger',
                  message: `提交失败`
                });
              }
            })
          },fail:()=>{
            Toast.clear();
            Notify({
              type: 'danger',
              message: `上传失败`
            });
          }
        });
      }
    })

  },
  onClick(event) {
    console.log(event);
    this.setData({
      activestatus: event.currentTarget.id
    });
    this.loadPageData(this.data.phonenumber, this.data.activestatus);
  },
  loadPageData(phonenumber, status) {
    const url = `${baseurl}/SHIPORDERs/GetPageData?phonenumber=${phonenumber}&status=${status}`;
    Toast.loading({
      mask: true,
      message: '加载中...'
    });
    wx.request({
      url: url,
      method: 'GET',
      success: (res) => {
        Toast.clear();
        console.log(res);
        Notify({
          type: 'success',
          message: `成功获取${res.data.total}条信息`
        });
        this.setData({
          list: res.data.rows
        });
      },
      fail: function(err) {
        Toast.clear();
        console.log(err);
        Notify({
          type: 'danger',
          message: `err`
        });
      }
    })
  }
});