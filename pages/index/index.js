import Page from '../../common/page';
import Toast from 'vant-weapp/toast/toast';
import Notify from 'vant-weapp/notify/notify';
const app = getApp();
const baseurl = 'https://www.guangzhoushizhuo.xyz/api';
Page({
  data: {
    phonenumber:null,
    sms:null
  },
  onChange:function(event){
    if (event.currentTarget.id =='phonenumber'){
      this.setData({ phonenumber: event.detail });
    }
    if (event.currentTarget.id == 'sms') {
      this.setData({ sms: event.detail });
    }
  },
  vaildate:function(event){
    const that=this;
    const istrue1 = /^\d{3}$/i.test(this.data.sms);
    const istrue2 = /^(13|15|18)\d{9}$/i.test(this.data.phonenumber);
    if(!istrue1){
      Notify({ type: 'danger', message: '验证码无效' });
      return
    }
    if (!istrue2) {
      Notify({ type: 'danger', message: '手机号无效' });
      return
    }
    wx.request({
      url: `${baseurl}/Default/Vaildate?phonenumber=${this.data.phonenumber}&code=${this.data.sms}`,
      method:'POST',
      success:function(res){
        console.log(res);
        if(res.data){
          Toast.success('登录成功');
          wx.setStorageSync('phonenumber', that.data.phonenumber);
          wx.redirectTo({
            url: '/pages/dashboard/index',
          })
        }
      },fail:function(){
        Toast.fail('登录失败');
      }
    })
  },
  sendsms: function (event){
    const istrue = /^(13|15|18|14|17|19)\d{9}$/i.test(this.data.phonenumber);
    if (!istrue){
      Notify({ type: 'danger', message: '手机号无效' });
      return
    }
    wx.request({
      url: `${baseurl}/Default/SendSMS?phonenumber=${this.data.phonenumber}`,
      method:'POST',
      success:function(){
        Toast.success('发送成功');
      },fail:function(){
        Toast.fail('发送失败');
      }
    })
  }
  
   
})
