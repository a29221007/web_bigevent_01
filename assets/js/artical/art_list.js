$(function () {
    // 定义事件过滤器    
    template.defaults.imports.dataFormat = function (dtStr) {
        var dt = new Date(dtStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss



    }
    // 定义补0 函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 1 定义查询参数
    var q = {
        pagenum: 1, //是	int	页码值
        pagesize: 2, //是	int	每页显示多少条数据
        cate_id: '',//否	string	文章分类的 Id
        state: '',//否	string	文章的状态，可选值有：已发布、草稿
    }


    var layer = layui.layer
    // 2 初始化文章列表
    initTable()
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败！')
                }
                // 成功收 ，调用模板引擎函数
                var htmlstr = template('tpl-table', res)
                // 渲染
                $('tbody').html(htmlstr)
                renderPage(res.total)
            }
        })
    }


    // 3 初始化分类
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


    // 4 筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 赋值
        q.state = state
        q.cate_id = cate_id
        // 
        initTable()
    })

    // 5 分页
    var laypage = layui.laypage;
    function renderPage(total) {

        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total,//数据总数，从服务端得到
            limit: q.pagesize, // 每页显示的条数
            curr: q.pagenum,   // 起始页
            
            // 分页模块设置，显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits:[2,3,5,8,10],
            // 触发jump回调函数的方式有两种
            // 1、分页初始化的时候
            // 2、页码改变的时候
            jump: function (obj, first) {
                // obj:所有参数所在对象，
                // first：是否是第一次初始化分页
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 判断，不是第一次初始化分页，才能重新调用初始化文章列表；
                if (!first) {
                    //初始化文章列表
                    initTable()
                }
            }
        });
    }

    // 6删除

    var layer = layui.layer;
    $('tbody').on('click', '.btn-delete', function () { 
        var id = $(this).attr('data-id');
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
               
                success: function (res) { 
                    if (res.status !== 0) { 
                        return layer.msg('失败！')
                    }
                    layer.msg('删除成功！')
                    // 页面汇总删除按钮个数等于1，页码大于1；
                    if ($('.btn-delete').length === 1 && q.pagenum > 1) q.pagenum--
                    initTable()

                }
            })
            layer.close(index);
          });
    })
})