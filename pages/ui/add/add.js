// pages/ui/add/add.js
let base = getApp().constants;
let that = null;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		types: ['Android', 'iOS', '休息视频', '福利', '拓展资源', '前端', '瞎推荐', 'App'],//类型
		typeIndex: -1,//选中的类型index
		params: {
			url: '',
			desc: '',
			who: '',
			type: '',
			debug: false,
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		that = this;

		var wxUserInfo = wx.getStorageSync('wxUserInfo');
		that.data.params.who = wxUserInfo.nickName;
		that.setData({
			params: that.data.params,
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

	/**
	 * 点击类型item
	 */
	clickTypeItem: function (e) {
		var index = e.currentTarget.dataset.index;
		that.data.params.type = that.data.types[index];
		that.setData({
			typeIndex: index,
			params: that.data.params,
		})
	},

	/**
	 * debug切换
	 */
	changeDebug: function (e) {
		var flag = e.detail.value;
		that.data.params.debug = flag;
		that.setData({
			params: that.data.params,
		})
	},

	/**
	 * 文本输入
	 */
	changeInput: function (e) {
		var typee = e.currentTarget.dataset.type;
		var value = e.detail.value;
		if (typee == 'url') {
			that.data.params.url = value;
		} else if (typee == 'desc') {
			that.data.params.desc = value;
		} else if (typee == 'who') {
			that.data.params.who = value;
		}
		that.setData({
			params: that.data.params,
		})
	},

	/**
	 * 提交
	 */
	clickSubmit: function () {
		var tipText = '';
		if (that.data.params.url == '') {
			tipText = '请输入要提交的网页地址';
		} else if (that.data.params.desc == '') {
			tipText = '请输入简要描述';
		} else if (that.data.params.who == '') {
			tipText = '请输入提交者';
		} else if (that.data.params.type == '') {
			tipText = '请选择类型';
		}

		if (tipText != '') {
			wx.showToast({
				icon: 'none',
				title: tipText,
			})
			return;
		}

		that.httpSubmit(that.data.params);
	},

	/**
	 * 提交
	 */
	httpSubmit: function (params) {
		base.http.httpPost({
			loading: '加载中',
			url: 'add2gank',
			data: params,
			success: function (result) {
				wx.showToast({
					title: '提交成功',
				})
				setTimeout(function () {
					wx.navigateBack();
				}, 1500)
			},
			fail: function (e) {

			}
		})
	}

})