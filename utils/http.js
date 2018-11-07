let u = {};

u.API_SERVICE = 'https://gank.io/api/data/'; //服务器地址

//请求返回体模型
u.httpModel = {
	code: 2000,
	sucinfo: '',
	datainfo: '',
}

//请求方式
u.GET = 'GET'; //GET类型的请求
u.POST = 'POST'; //POST类型的请求

//短提示默认长短时间
u.TOAST_SHORT = 2000; //弹窗时间短
u.TOAST_LONG = 3000; //弹窗时间长

//请求状态CODE
u.CODE_STATUS_SUCCESS = 200; //开发者服务器返回的 HTTP 成功状态码
u.CODE_SUCCESS = 1; //接口请求成功的CODE
u.CODE_FAIL = 0; //接口请求失败

/**
 * 请求返回统一处理
 * 
 */
function handleResponse(requestParams, result) {
	if (result.statusCode == u.CODE_STATUS_SUCCESS) {
		if (!result.data.error) {
			u.httpModel.code = 2000;
			u.httpModel.datainfo = result.data.results;
			u.httpModel.sucinfo = result.data.error;
			if (requestParams.success) requestParams.success(u.httpModel.datainfo);
		} else {
			u.httpModel.code = 1011;
			u.httpModel.datainfo = '';
			u.httpModel.sucinfo = result.data.error;
			wx.showToast({
				icon: 'none',
				title: '请求失败：' + u.httpModel.sucinfo,
				duration: u.TOAST_LONG,
			})
			if (requestParams.fail) requestParams.fail(u.httpModel);
		}

	} else {
		console.log('请求错误 : ' + '错误码：' + result.statusCode + ' / ' + '错误信息：' + result.errMsg);
		wx.showToast({
			icon: 'none',
			title: '请求失败：' + result.statusCode,
			duration: u.TOAST_LONG,
		})
		u.httpModel.code = result.statusCode;
		u.httpModel.datainfo = '';
		u.httpModel.sucinfo = result.statusCode;
		if (requestParams.fail) requestParams.fail(u.httpModel);
	}
}

/**
 * 发出请求
 */
function request(requestParams, requestType) {
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
		data: requestParams.data,
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: requestType,
		complete: function (msg) {
			if (requestParams.complete) requestParams.complete(msg);
		},
		success: function (result) {
			console.log(result, 'httpGet result');
			if (showLoading) wx.hideLoading();
			handleResponse(requestParams, result);
		},
		fail: function (e) {
			if (showLoading) wx.hideLoading();
			u.httpModel.code = 10001;
			u.httpModel.datainfo = '';
			u.httpModel.sucinfo = '请求失败';
			//将接口调用不成功信息返回给页面
			if (requestParams.fail) requestParams.fail(u.httpModel);
		}
	})
}

/**
 * get 请求
 */
u.httpGet = function (requestParams) {
	//发出请求
	request(requestParams, u.GET);
}

/**
 * post 请求
 */
u.httpPost = function (requestParams) {
	//发出请求
	request(requestParams, u.POST);
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