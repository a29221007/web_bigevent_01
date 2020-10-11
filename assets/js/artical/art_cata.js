$(function () {
    // 1文章类别列表展示
    getlist()
    // 封装函数
    function getlist() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取列表失败！')
                }
                var htmlstr = template('tpl-art-cata', res)
                $('tbody').html(htmlstr)
            }
        })
    }

    // 2 显示添加文章分类列表弹出层
    var layer = layui.layer;
    $('#btnAdd').on('click', function () {
        // 利用框架代码，显示提示添加文章类别区域
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area:['500px','250px'],
            content: $('#dialog-add').html()
        });
    })

    // 3 提交 添加文章分类（用事件代理）
    var indexAdd = null;
    $('body').on('submit', '#form-add', function (e) { 
        e.preventDefault();
        $.ajax({
            type: 'post',
            url:'/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) { 
                if (res.status !== 0) { 
                    return layer.msg(res.message)
                }
                // 重新渲染页面的数据
               
                layer.msg('文章添加成功');
                getlist();
                layer.close(indexAdd)
                
                
            }
        })
    })

    // 4 修改的弹出层
    var form = layui.form
    var indexEdit = null;
    $('tbody').on('click','.btn-edit', function () {
        // 4.1利用框架代码，显示提示添加文章类别区域
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area:['500px','250px'],
            content: $('#dialog-edit').html()
        });
        // 4.2 获取Id,发送ajax请求，渲染到页面
        var Id = $(this).attr('data-id');
        
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + Id,
            success: function (res) { 
                form.val('form-edit',res.data)
            }
        })
    })

    // 5 修改 - 提交

    $('body').on('submit', '#form-edit', function (e) { 
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) { 
                if (res.status !== 0) { 
                    return layer.msg(res.message)
                }
                // 成功，重新渲染页面中的数据
                layer.msg('更新成功！')
                getlist();
                layer.close(indexEdit)
            }
        })
    })

    // 6 删除
    $('tbody').on('click', '.btn-delete', function () { 
        // 获取id
        var id = $(this).attr('data-id');
        console.log(id);
        // 弹出询问框
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) { 
                    if (res.status !== 0) { 
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功')
                    getlist()
                    layer.close(index);
                }
            })
            
          });
    })
})