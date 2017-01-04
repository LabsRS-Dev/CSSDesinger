/**
 * Created by Ian on 2016/10/18.
 */

(function () {
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var b$ = BS.b$;

    var _U =  {};

    _U.launch = function () {
        var t$ = this;

        var cssUrls = [];

        var jsUrls = [
            //<!--插件部分加载-->
            //<!--扩展加载-->


            //<!--App 核心-->
            "js/core/app.observer.js",
            "js/core/app.config.js",
            "js/core/app.util.js",

            //<!--App 插件-->

            //<!--App UI组件-->
            "js/components/app.main.js",

            //<!--App 启动-->
            'js/app.js'
        ];
        $.RTYUtils.queue()
            .next(function(nxt){
                var _f = function(urls){
                    if (urls.length > 0){
                        /**
                         * 备注：
                         * $.RTY_3rd_Ensure.ensure 完全兼容多款浏览器，
                         * $.RTYUtils.loadCSS 不支持Safari
                         */
                        $.RTY_3rd_Ensure.ensure({css: urls.shift()}, function () {  _f && _f(urls);})
                        //$.RTYUtils.loadCSS(urls.shift(), function () {  _f && _f(urls);})
                    }else{
                        nxt && nxt();
                    }
                };

                _f(cssUrls);
            })
            .next(function(nxt){
                var _f = function(urls){
                    if (urls.length > 0){
                        /**
                         * 备注：
                         * $.RTY_3rd_Ensure.ensure 完全兼容多款浏览器，
                         * $.RTYUtils.loadScript 不支持Safari
                         */
                        $.RTY_3rd_Ensure.ensure({js: urls.shift()}, function () {_f && _f(urls);})
                        //$.RTYUtils.loadScript(urls.shift(), function () {_f && _f(urls);})
                    }else{
                        nxt && nxt();
                    }
                };

                _f(jsUrls);
            })
            .done(function(nxt){
                console.log('----------- load complate ----------------');
            })

    };

    //-----------------------------------------------------------------------------------------------------------------
    $(document).ready(function () {
        _U.launch();
    });

}());