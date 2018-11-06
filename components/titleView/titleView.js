// components/titleView.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		title: {
			type: String,
			value: '',
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		firstPage: true,
	},

	/**
	 * 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
	 */
	ready: function () {
		try {
			var systemInfo = wx.getSystemInfoSync();
			this.setUpTitle(systemInfo);
		} catch (e) {
			// 获取系统信息失败
			this.setData({
				windowHeight: 812,
				totalTopHeight: 68,
				statusBarHeight: 20,
				titleBarHeight: 48,
			});
		}
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		setUpTitle: function (systemInfo) {
			let totalTopHeight = 68;
			let pages = getCurrentPages();
			if (/iPhone X|MI 8|PAAM00|COR-AL00/.test(systemInfo.model)) {
				totalTopHeight = 88;
			} else if (/iPhone/.test(systemInfo.model)) {
				totalTopHeight = 64;
			}
			let windowHeight = systemInfo.windowHeight, statusBarHeight = systemInfo.statusBarHeight;


			this.setData({
				firstPage: pages.length == 1,
				totalTopHeight: totalTopHeight,
				statusBarHeight: statusBarHeight,
				titleBarHeight: totalTopHeight - statusBarHeight
			});
		},

		//返回
		clickBack: function () {
			wx.navigateBack();
		},

		//去首页
		clickHome: function () {
			wx.reLaunch({
				url: '/pages/ui/main/main',
			})
		},

		//点击搜索
		clickSearch: function () {
			wx.navigateTo({
				url: '/pages/ui/search/search',
			})
		},
	}
})
