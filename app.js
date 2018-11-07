//app.js
let http = require('/utils/http.js');
App({
	onLaunch: function () {
		var that = this;
		//获取微信用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: function (res) {
							console.log('更新用户信息');
							wx.setStorage({
								key: 'userInfo',
								data: res.userInfo,
							})
						}
					})
				}
			}
		})
	},
	constants: {
		http: http,
	}
})