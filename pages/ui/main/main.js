// pages/ui/main/main.js
let base = getApp().constants;
let that = null;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		currentTab: 0,
		navBarTitle: [
			{ name: '全部', url: 'all', size: '10', page: 1 },
			{ name: '今日', url: 'toady', size: '10', page: 1 },
			{ name: 'Android', url: 'Android', size: '10', page: 1 },
			{ name: 'IOS', url: 'iOS', size: '10', page: 1 },
			{ name: '福利', url: '福利', size: '10', page: 1 },
			{ name: '休息视频', url: '休息视频', size: '10', page: 1 },
			{ name: '前端', url: '前端', size: '10', page: 1 },
			{ name: '拓展资源', url: '拓展资源', size: '10', page: 1 },
			{ name: 'App', url: 'App', size: '10', page: 1 },
			{ name: '瞎推荐', url: '瞎推荐', size: '10', page: 1 },
		],
		data: [],//用于承载获取的数据

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		that = this;
		//初始化数据
		that.httpGetData(that.data.currentTab);
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
	 * 添加干货
	 */
	clickAdd:function(){
		wx.navigateTo({
			url: '../add/add',
		})
	},

	/**
	 * 	点击头部导航栏
	 */
	clickNavBarTitle: function (e) {
		var index = e.currentTarget.dataset.index;
		index = index < 0 ? 0 : index > that.data.navBarTitle.length - 1 ? that.data.navBarTitle.length - 1 : index;
		that.setData({
			currentTab: index,
			scrollIntoView: 'navBarTitle_item' + index,
		})
		that.httpGetData(index);
	},

	/**
	 * swiper切换
	 */
	swiperChange: function (e) {
		var index = e.detail.value;
		that.setData({
			currentTab: index,
		})
	},

	/**
	 * 去h5
	 */
	clickItem: function (e) {
		var url = e.currentTarget.dataset.url;
		wx.navigateTo({
			url: '../webView/webView?url=' + url,
		})
	},

	/**
	 * 预览图片
	 */
	clickPreImage: function (e) {
		var images = e.currentTarget.dataset.images;
		var currentSrc = e.currentTarget.dataset.currentsrc;
		wx.previewImage({
			urls: images,
			current: currentSrc
		})
	},

	onRefresh: function (e) {
		var callback = e.detail;
		that.data.navBarTitle[that.data.currentTab].page = 1;
		that.httpGetData(that.data.currentTab, callback);
	},

	onLoadMore: function (e) {
		var callback = e.detail;
		that.data.navBarTitle[that.data.currentTab].page = that.data.navBarTitle[that.data.currentTab].page + 1;
		that.httpGetData(that.data.currentTab, callback);
	},

	/**
	 * 获取数据
	 */
	httpGetData: function (index, callback) {
		var url = that.data.navBarTitle[index].url + '/' + that.data.navBarTitle[index].size + '/' + that.data.navBarTitle[index].page;
		var currentPage = that.data.navBarTitle[index].page;
		base.http.httpGet({
			loading: '加载中',
			url: url,
			success: function (result) {
				if (currentPage == 1) {
					if (that.data.data[index] != undefined && that.data.data[index].data.length > 0) {
						that.data.data[index].data = [];
					} else {
						that.data.data[index] = {
							data: [],
						};
					}

					that.data.data[index].data = result;
				} else {
					that.data.data[index].data = that.data.data[index].data.concat(result);
				}
				that.setData({
					data: that.data.data,
				})
				if (callback)
					callback.success();
			},
			fail: function (e) {
				if (callback)
					callback.fail();
			}
		})
	}
})