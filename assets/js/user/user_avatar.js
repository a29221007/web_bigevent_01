$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 2 选择文件
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    // 3 修改图片
    var layer = layui.layer
    $('#file').on('change', function (e) {
        console.log(e);
        var files = e.target.files;
        if (files.length === 0) {
            return layer.msg('请选择用户头像')
        }

        // 选择成功，修改图片
        //1 拿到用户选择的文件
        var file = e.target.files[0];
        // 2根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        //3先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 4 上传头像
    $('#btnUplode').on('click', function () {
        // 1 获取base64类型的头像（字符串）
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        
        // 2 发送ajax
        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: {
                avatar:dataURL
            },
            success: function (res) { 
                if (res.status !== 0) { 
                    return layer.msg(res.message)
                }
                layer.msg('更新头像成功！')
                window.parent.getUserInfo()
                
            }
        })
    })

})