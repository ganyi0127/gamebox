var HOST_URL = true ? 'https://www.lianlianxi.com/app' : 'http://192.168.0.115:8080';

var requestHandler = {
  action: '',
  params: {},
  success: function(res) {

  },
  fail: function() {

  },
  complete: function() {

  },
}

/**
 * Get请求
 */
function GET(requestHandler) {
  request('GET', requestHandler)
}

/**
 * Post请求
 */
function POST(requestHandler) {
  request('POST', requestHandler)
}

function request(method, requestHandler) {
  //注意：可以对params加密等处理  
  var params = requestHandler.params;

  wx.request({
    url: HOST_URL + requestHandler.action,
    data: params,
    method: method,
    header: {
      'content-type': 'application/json;charset=UTF-8'
    },
    success: function(res) {
      //注意：可以对参数解密等处理  
      var data = res.data
      console.log('返回数据：' + requestHandler.action)
      console.log(data)
      if (data.code == 200) {
        requestHandler.success(data.data)
      } else {
        if (requestHandler.fail) {
          requestHandler.fail(data.msg);
        }
      }
    },
    fail: function() {
      if (requestHandler.fail) {
        requestHandler.fail()
      }
    },
    complete: function() {
      // complete  
      if (requestHandler.complete) {
        requestHandler.complete()
      }
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST,
}