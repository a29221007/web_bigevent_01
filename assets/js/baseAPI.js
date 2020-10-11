// 开发环境服务器地址
// var bsaeurl


// 拦截所有的ajax请求
// option 参数，获取所有的配置对象
$.ajaxPrefilter(function (option) { 
    
    option.url = 'http://ajax.frontend.itheima.net' + option.url;
    
    // 对需要权限的服务器地址配置头信息
    // 必须一my开头才行
    if (option.url.indexOf('/my/') !== -1) { 
        option.headers = {
            Authorization:localStorage.getItem('token') || ''
        }
    }

    option.complete = function (res) { 
        
        // 判断 如果是身份认证失败，跳转到登录页面
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') { 
            // 清空本地 token
            localStorage.removeItem('token');
            // 页面跳转
            location.href = '/login.html';
        }
    }
})