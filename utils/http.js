let u = {};

u.API_SERVICE = 'https://gank.io/api/data/'; //服务器地址

u.httpModel = {
	code: 2000,
	sucinfo: '',
	datainfo: '',
}

/**
 * get 请求
 */
u.httpGet = function (requestParams) {
	//1.打印请求
	logRequestUrl(requestParams);

	//2.是否显示请求中
	let showLoading = false;
	if (requestParams.loading) {
		showLoading = true;
		wx.showLoading({
			title: requestParams.loading,
		})
	}

	//3.发出请求
	wx.request({
		url: u.API_SERVICE + requestParams.url,
		data: requestParams.param,
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'GET',
		complete: function (msg) {
			if (requestParams.complete) requestParams.complete(msg);
		},
		success: function (result) {
			if (showLoading) wx.hideLoading();
			if (result.statusCode === 200) {
				if (!result.data.error) {
					u.httpModel.code = 2000;
					u.httpModel.datainfo = result.data.results;
					u.httpModel.sucinfo = result.data.error;
					if (requestParams.success) requestParams.success(u.httpModel.datainfo);
				} else {
					u.httpModel.code = 1011;
					u.httpModel.datainfo = '';
					u.httpModel.sucinfo = result.data.error;
					if (requestParams.fail) req.fail(u.httpModel);
				}
			} else {
				u.httpModel.code = result.statusCode;
				u.httpModel.datainfo = '';
				u.httpModel.sucinfo = result.statusCode;
				if (requestParams.fail) req.fail(u.httpModel);
			}
		},
		fail: function (e) {
			if (showLoading) wx.hideLoading();
			u.httpModel.code = 10001;
			u.httpModel.datainfo = '';
			u.httpModel.sucinfo = '请求失败';
			//将接口调用不成功信息返回给页面
			if (requestParams.fail) req.fail(u.httpModel);
		}
	})
}

/**
 * 打印请求地址
 */
function logRequestUrl(requestParams) {
	//显示请求路径
	var url = '请求路径: ' + u.API_SERVICE + requestParams.url;
	var paramCount = objCount(requestParams.data);
	if (paramCount > 0) {
		url += '?';
	}
	var i = 0;
	for (var item in requestParams.data) { //用javascript的for/in循环遍历对象的属性 
		if (i != (paramCount - 1)) { //不是最后一个才加上&
			url += item + "=" + requestParams.data[item] + '&';
		} else {
			url += item + "=" + requestParams.data[item];
		}

		i++;
	}
	console.log(url);
}

/**
 * 获取对象、数组的长度、元素个数
 * 
 * @param obj 要计算长度的元素，可以为object、array、string
 */
function objCount(obj) {
	var objType = typeof obj;
	if (objType == "string") {
		return obj.length;
	} else if (objType == "object") {
		var objLen = 0;
		for (var i in obj) {
			objLen++;
		}
		return objLen;
	}
	return false;
}


module.exports = u;