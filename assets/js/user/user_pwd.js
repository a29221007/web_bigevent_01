$(function () {
    // 1定义校验规则
    var form = layui.form
    form.verify({
        // 密码校验
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 新旧密码不能一致
        samepwd: function (value) { 
            if (value === $('[name=oldPwd]').val()) { 
                return '新旧密码不能一致!'
            }
        },
        repwd: function (value) { 
            if (value !== $('[name=newPwd]').val()) { 
                return '两次密码不一致'
            }
        }
    })

    // 2 提交表单
    $('.layui-form').on('submit', function (e) { 
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) { 
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                $('.layui-form')[0].reset()
            }
        })
    })
})