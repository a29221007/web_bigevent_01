$(function () { 
    //1
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度为 1~6 位之间'
            }
        }
    });

    // 2 初始化用户信息
    initUserInfo();
    // 初始化信息分装，后面还要用
    var layer = layui.layer;
    function initUserInfo() { 
        $.ajax({
            url: '/my/userinfo',
            success: function (res) { 
                if (res.status !== 0) { 
                    return layer.msg(res.message)
                }
                 
                // 成功后渲染
                form.val('formUserInfo',res.data)
            }
        })
    }

    // 3 表单重置
    $('#btnReset').on('click', function (e) { 
        // 阻止默认重置行为
        e.preventDefault();
        // 从新用户渲染
        initUserInfo();
    })

    // 4 修改用户信息
    $('.layui-form').on('submit', function (e) { 
        // 阻止默认提交行为
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) { 
                if (res.status !== 0) { 
                    return layer.msg(res.message);
                }
                // 成功
                layer.msg(res.message);
                // 调用父框架的全局方法
                window.parent.getUserInfo()
            }

        })
    })
})