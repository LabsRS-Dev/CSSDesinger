/**
 * Created by Ian on 2016/10/20.
 */
(function () {
    window['UI'] = window['UI'] || {};
    window.UI.c$ = window.UI.c$ || {};
})();

(function () {
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var c$ = {};
    c$ = $.extend(window.UI.c$, {});
    var b$ = BS.b$;
    var _MC = c$.MessageCenter;

    /**
     * 初始化标题及版本
     */
    c$.initTitleAndVersion = function () {
        if(c$.g_AppEnableChangeWindowTitle){
            document.title = c$.g_AppDisplayName || b$.App.getAppName();
        }
    };

    /**
     * 启动代码
     */
    c$.launch = function () {
        var t$ = this;
        console.log('[App] 启动....');

        t$.initTitleAndVersion();
        _MC.send("createMainUI");

    };

    window.UI.c$ = $.extend(window.UI.c$, c$);

    ///////////////////////////////////////////////////////////////////////////////
    c$.launch();
}());