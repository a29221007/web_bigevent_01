$(function () {
    // 3初始化分类
    var layer = layui.layer
    var form = layui.form
    initCata()

    function initCata() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 赋值，渲染
                var htmlstr = template('tpl-cata', res)
                $('[name=cate_id]').html(htmlstr)
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 点击按钮，选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverfile').click()
    })

    // 设置图片

    $('#coverfile').on('change', function (e) {
        //console.log(e);
        var files = e.target.files
        if (files.length === 0) {
            return layui.layer.msg('请选择文件')
        }
        var file = files[0]
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 发布
    var state = '已发布'
    $('#btnSave2').on('click', function () {
        state = '草稿';
    })


    // 添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(this)
        //放入状态
        fd.append('state', state)
        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                //console.log(...fm);
                // 文章发布
                pushlishArticle(fd)
            })

    })

    function pushlishArticle(fd) { 
        $.ajax({
            type: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) { 
                if (res.status !== 0) { 
                    return layer.msg(res.message)
                }
                // 跳转页面
                layer.msg('添加文章成功,页面跳转中')
                setTimeout(function () { 
                    window.parent.document.querySelector('#art_list').click()
                },1500)
            }
        })
    }
})