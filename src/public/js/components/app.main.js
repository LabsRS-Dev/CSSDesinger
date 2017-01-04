/**
 * Created by Ian on 2016/10/21.
 */

(function () {
    window['UI'] = window['UI'] || {};
    window.UI.c$ = window.UI.c$ || {};
})();

(function () {
    var c$ = {};
    c$ = $.extend(window.UI.c$, {});
    var b$ = window.BS.b$;
    var _MC = c$.MessageCenter; //

    c$.g_AppEnableChangeWindowTitle = false; // 交由其他控制部分来处理

    var $u = {};
    $u.configUI = function(){
        console.log('----------- configUI ----------------');

        $('header > appversion').text("Ver" + b$.App.getAppVersion());

    };


    //////////////////////////////
    //绑定可识别的消息
    _MC.register("createMainUI", function(e){$u.configUI()});


    window.UI.c$ = $.extend(window.UI.c$, c$);
})();