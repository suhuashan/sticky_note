/**
 * Created by 苏华山 on 2018/4/6.
 */



// 获取当前输入的时间
function getDate(){
    var date = new Date();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? '0' + d : d;
    return  m + '-' + d;
}

// 弹出修改框自动聚焦
function blur(){
    var $textarea = $('textarea');
    $textarea.blur();
}

// 对列表数目的计算
function countLength(temp,length) {
    var len = temp.children().length;
    length.html(len);
    console.log(len);
}

//对输入的内容进行过滤，替换敏感字符
function html2Escape(sHtml) {
    return sHtml.replace(/[<>&]/g,function(c){return {"<":"《",">":"》","&":"'&"}[c];});
}

//将弹窗显示在屏幕正中央
function letDivCenter(divName){
    var top = ($(window).height() - $(divName).height())/2;
    var left = ($(window).width() - $(divName).width())/2;
    var scrollTop = $(document).scrollTop();
    var scrollLeft = $(document).scrollLeft();
    $(divName).css({position:'absolute',top:top+scrollTop ,left:left+scrollLeft}).show();
}

//对弹窗和遮罩进行控制
function showMask(){
    var mask = $('#mask');
    mask.css('height',$(document).height());
    mask.css('width',$(document).width());
    mask.show();
}
function hideMask(){
    var mask = $('#mask');
    mask.hide();
}
function hideDiv(divName){
    $(divName).hide();
}
function showAll(divName){
    showMask();
    letDivCenter(divName);
}
function hideAll(divName){
    hideMask();
    hideDiv(divName);
}



// 主函数
(function(){
    // var vConsole = new VConsole();
    var $todoList = $('#todoList'),
        $finishedList = $('#finishedList'),
        $hint = $('#hint'),
        $todoList_sum = $('#todoList_sum'),
        $finishedList_sum = $('#finishedList_sum'),
        $textArea = $('#textArea'),
        $todoInput = $('#todoInput');
    $todoInput.keypress(function(event){
        if(event.which == 13){
            var input_value = $todoInput.val(),
                formateDate = getDate();
           input_value= html2Escape(input_value);
            var innerHtml = '<li>'+
                    '<input id="checkbox" checked="true" type="checkbox" >'+
                    '<span class="list_item_style fr">'+
                    '<span id="todolist_item" class="todolist_item">'+ input_value + '</span>'+
                    '<span  class="deleteBtn fr"><img src="img/delete.png"> </span>'+
                    '<span  class="setTopBtn fr"><img src="img/setToTop.png"> </span>'+
                    '<span id="todoTime" class="fr">'+formateDate+'</span>'+
                    '</span></li>';
            if(input_value==''){
                $hint.show();
                setTimeout(function(){
                    $hint.hide();
                },2000);
            }else{
                $todoList.append(innerHtml);
                $todoInput.val("");
            }
            $todoList.find('li #checkbox').attr("checked",false);
            countLength($todoList,$todoList_sum);
            store.set('mess3',$todoList.html());
        }
    });

    /*将List的item置顶*/
    $todoList.on('click','.setTopBtn',function() {
        $todoList.prepend( $(this).parent().parent());
        store.set('mess3',$todoList.html());
    });
    $finishedList.on('click','.setTopBtn',function() {
        $finishedList.prepend( $(this).parent().parent());
        store.set('mess4',$finishedList.html());
    });

    // 点击item前面的小框，对等待完成List和已经完成List中的item位置互换
    $todoList.on('click', '#checkbox', function () {
        var status = this.checked;
        if (status == true) {
            $finishedList.append(this.parentNode);
        }
        countLength($todoList,$todoList_sum);
        countLength($finishedList,$finishedList_sum);
        store.set('mess3',$todoList.html());
        store.set('mess4',$finishedList.html());
    });
    $finishedList.on('click', '#checkbox', function () {
        var status = this.checked;
        if (status == false) {
            $todoList.append(this.parentNode);
        }
        countLength($todoList,$todoList_sum);
        countLength($finishedList,$finishedList_sum);
        store.set('mess3',$todoList.html());
        store.set('mess4',$finishedList.html());
    });

    /*点击input弹出textarea框进行内容的修改和保存*/
    (function(){
        var clickThis=null;//解决this重复绑定的问题
        $todoList.on('click','#todolist_item',function(){
            clickThis = $(this);
            $textArea.val(clickThis.text());
            showAll('#rewrite_model');
            $textArea.focus();
        });
        $finishedList.on('click','#todolist_item',function(){
            clickThis = $(this);
            $textArea.val(clickThis.text());
            showAll('#rewrite_model');
            $textArea.focus();
        });

        // 确定对textarea框内容的修改
        $('#confirm_Btn').on('click',function(){
            clickThis.text($textArea.val());
            store.set('mess3',$todoList.html());
            store.set('mess4',$finishedList.html());
            hideAll("#rewrite_model");
        });
        //取消对textarea框内容的修改
        $('#cancel_Btn').on('click',function(){
            hideAll("#rewrite_model");
        });
    })();

    //删除等待完成List和已经完成List中的item
    (function(){
        var clickThis1=null;
        $todoList.on('click', '.deleteBtn', function () {
            clickThis1 = $(this);
            showAll('#delete_model');
        });
        $finishedList.on('click', '.deleteBtn', function () {
            clickThis1 = $(this);
            showAll('#delete_model');
        });

        // 确认删除
        $('#confirmBtn').on('click',function(){
            clickThis1.parent().parent().remove();
            countLength($todoList,$todoList_sum);
            countLength($finishedList,$finishedList_sum);
            store.set('mess3',$todoList.html());
            store.set('mess4',$finishedList.html());
            hideAll("#delete_model");
        });
        // 取消删除
        $('#cancelBtn').on('click',function(){
            hideAll("#delete_model");
        });
    })();


    (function(){
        $todoList.html(store.get('mess3'));
        $finishedList.html(store.get('mess4'));
        countLength($todoList,$todoList_sum);
        countLength($finishedList,$finishedList_sum);
        blur();
        $todoList.find('li #checkbox').attr("checked",false);
        $finishedList.find('li #checkbox').attr("checked",true);
    }());
}());