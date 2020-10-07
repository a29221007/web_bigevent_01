$(function () { 
    // 1.给 ‘去注册账号’ 绑定点击事件
    $('#link_reg').on('click', function () { 
        $(this).parents('.login_box').hide().nextAll().show()
    })
    //给 ‘去登录’ 绑定点击事件
    $('#link_login').on('click', function () { 
        $(this).parents('.reg_box').hide().siblings('.login_box').show()
    })

    // 2.从 layui 中获取form 对象

    var form = layui.form
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义一个叫 pwd 的校验规则
        pwd: [
            /^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'
        ],

        // 校验两次密码输入是否一致
        repwd: function (value) { 
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到 密码框中的内容
            // 然后进行一次判断
            // 如果判断失败，则返回一个提示消息

            var pwd = $('.reg_box input[name=password]').val()
            if (pwd !== value) { 
                return '两次密码不一致!'
            }
        }
    })

    // 3 注册功能 
    var layer = layui.layer
    $('#form_reg').on('submit', function (e) {
        //阻止表单默认行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val(),
            },
            success: function (res) { 
                if (res.status !== 0) { 
                    return layer.msg(res.message)
                }
                layer.msg('注册成功！');
                $('#link_login').click();
                //表单重置
                $('#form_reg')[0].reset();
                
            }
        })
    })

    // 4 登录功能
    $('#form_login').submit(function (e) { 
        e.preventDefault(); 
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) { 
                if (res.status !== 0) { 
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                // 保存 token 未来的接口用
                localStorage.setItem('token', res.token);
                // 跳转页面
                location.href = '/index.html'

            }
        })
    })


})