/**
 * Created by Ian on 2015/8/18.
 *
 */

(function () {
    window['UI'] = window['UI'] || {};
    window.UI.c$ = window.UI.c$ || {};
})();

(function () {
    var c$ = {};
    c$ = $.extend(window.UI.c$, {});
    var b$ = window.BS.b$;

    var useKendo = false;

    // 定义总线消息观察者
    c$.MessageCenter = {

        ///////////////////////////////////////////////////////
        //For Jquery 特殊处理
        obs_map_jquery:{},
        fnc_once_map_jquery:{},
        delegate: function (func, obj) {
            var context = obj || null;
            return function () {
                func.apply(context, arguments);
            }
        },

        ////////////////////////////////////////////////////////
        obs:(function(){
            if(typeof kendo !== "undefined"){
                if (typeof kendo.Observable !== "undefined"){
                    useKendo = true;
                }
            }

            return useKendo ? (new kendo.Observable()): {};
        })(),

        ////////////////////////////////////////////////////////
        register:function(messageCode, fn, isOne){
            var t$ = this;
            if (useKendo){
                !isOne ? t$.obs.bind(messageCode, fn) : t$.obs.one(messageCode, fn);
            }else{

                var obs = t$.obs_map_jquery[messageCode];
                if(obs == undefined){
                    obs = t$.obs_map_jquery[messageCode] = $.Callbacks();
                }

                var onceFncList = t$.fnc_once_map_jquery[messageCode];
                if(onceFncList == undefined){
                    onceFncList = t$.fnc_once_map_jquery[messageCode] = [];
                }

                var _fnc = t$.delegate(fn, null);
                obs.add(_fnc);

                if(isOne){
                    onceFncList.push(_fnc);
                }
            }

        },

        ////////////////////////////////////////////////////////
        send:function(messageCode, data){
            var t$ = this;
            if (useKendo){
                t$.obs.trigger(messageCode, {"data":data ||{}});
            }else{
                var obs = t$.obs_map_jquery[messageCode];
                if(obs){
                    obs.fire(messageCode, {"data":data ||{}});

                    var onceFncList = t$.fnc_once_map_jquery[messageCode];
                    $.each(onceFncList, function(_, _fnc){
                        if(obs.has(_fnc)){
                            obs.remove(_fnc);
                        }

                        onceFncList.splice(_,1);
                    })
                }
            }

        }
    };

    window.UI.c$ = $.extend(window.UI.c$, c$);
})();
