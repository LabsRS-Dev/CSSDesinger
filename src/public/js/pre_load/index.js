var AbstractController, AlertModal, AppHistory, Background, Basic, Bevel, Border, BorderRadius, CSSDocument, Code,
    ColorPicker, Downloader, Dragger, ENDPOINT, FFilter, FileDrop, FileManager, Filter, Filters, InnerShadow, Layer,
    LayerGroup, LayerManager, Modal, OuterShadow, PublishModal, RangeInput, Styles, TextBevel, TextFilter, TextShadow,
    TextStroke, Transform, cloneNodes, emptyPNG,
    __bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }

        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };



//参见：http://stackoverflow.com/questions/27040297/uncaught-referenceerror-webkitpoint-is-not-defined
if (typeof window.WebKitPoint === "undefined") {
    console.warn("WebKitPoint must redefined...");
    window.WebKitPoint = window.WebKitPoint || (function() {
        function WebKitPoint(x, y) {
            this.x = x;
            this.y = y;
        }

        return WebKitPoint;
    }());
}
if (typeof window.webkitConvertPointFromNodeToPage === "undefined") {
    console.warn("webkitConvertPointFromNodeToPage must redefined...");
    window.webkitConvertPointFromNodeToPage = window.webkitConvertPointFromNodeToPage || function(dom,
        unusedWebKitPoint) {
        var rect = dom.getBoundingClientRect();
        return [rect.left + unusedWebKitPoint.x, rect.top + unusedWebKitPoint.y];
    };
}

// 参见：http://www.cnblogs.com/Wayou/p/requestAnimationFrame.html
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

if (typeof window.requestAnimationFrame === "undefined") {
    console.warn("requestAnimationFrame must redefined...");

    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] +
                'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
        if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }());
}


// 版本重新赋值
var b$ = BS.b$;
window.ENV = 'production';
window.VERSION = b$.App.getAppVersion();


/*
 --------------- /home/gdot/github/cssshop/source/lib/evented.coffee--------------
 */


if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        var aArgs, fBound, fNOP, fToBind;
        if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        aArgs = Array.prototype.slice.call(arguments, 1);
        fToBind = this;
        fNOP = function() {};
        fBound = function() {
            return fToBind.apply((this instanceof fNOP && oThis ? this : oThis), aArgs.concat(Array.prototype.slice
                .call(arguments)));
        };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}

RangeInput = (function() {

    function RangeInput(el) {
        var _this = this;
        this.el = el;
        this.setText = __bind(this.setText, this);

        this.label = this.el.next();
        if (this.label) {
            this.setText();
            this.el.addEvent('input', this.setText);
        }
        this.el.addEvent('mousedown', function() {
            return _this.startValue = _this.el.val;
        });
        this.el.addEvent('mouseup', function() {
            var event;
            if (_this.el.val !== _this.startValue) {
                event = new Crystal.Utils.Event(_this);
                return Mediator.fireEvent('action', [event]);
            }
        });
        this.el.addEvent('dblclick', function() {
            var event;
            event = new Crystal.Utils.Event(_this);
            return Mediator.fireEvent('text', [
                event, 'value', _this.el.value,
                function(value) {
                    if (_this.el.val !== value) {
                        _this.el.val = value;
                        return Mediator.fireEvent('action', [event]);
                    }
                }
            ]);
        });
    }

    RangeInput.prototype.setText = function() {
        return this.label.text = this.el.value.toString().replace(/(.{4})(.*)/, '$1');
    };

    return RangeInput;

})();

Element.prototype.fireSimpleEvent = function(type) {
    var evt;
    evt = document.createEvent('Events');
    evt.colorPicker = true;
    evt.initEvent(type);
    return this.dispatchEvent(evt);
};

Element.prototype.fireMouseEvent = function(type) {
    var evt;
    evt = document.createEvent('MouseEvents');
    evt.initEvent(type);
    return this.dispatchEvent(evt);
};

Object.defineProperty(HTMLSelectElement.prototype, 'val', {
    get: function() {
        return this.value;
    },
    set: function(value) {
        return this.value = value;
    }
});

window.fireRangeEvents = true;

Object.defineProperty(HTMLInputElement.prototype, 'val', {
    get: function() {
        return this.value;
    },
    set: function(value) {
        this.value = value;
        if (!fireRangeEvents) {
            return;
        }
        if (this.getAttribute('type') === 'range') {
            this.fireSimpleEvent('input');
            return this.fireSimpleEvent('change');
        }
    }
});

Object.defineProperty(Node.prototype, 'render', {
    value: function() {
        var child, _i, _len, _ref, _results;
        _ref = this.childNodes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            _results.push(child.render());
        }
        return _results;
    }
});

Object.defineProperty(Node.prototype, 'context', {
    set: function(value) {
        var child, _i, _len, _ref,
            _this = this;
        if (value) {
            _ref = this.childNodes;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                child = _ref[_i];
                if (!child.context) {
                    child.context = value;
                }
            }
            this._context = value;
            if (value.on != null) {
                return value.on('change', function() {
                    return _this.render();
                });
            }
        }
    },
    get: function() {
        return this._context;
    }
});

Object.defineProperties(Text.prototype, {
    property: {
        set: function(value) {
            return this._property = value;
        },
        get: function() {
            return this._property;
        }
    },
    render: {
        value: function() {
            if (this._property) {
                return this.textContent = this._context[this._property];
            }
        }
    }
});

cloneNodes = function(node) {
    var child, ctx, dup, prop, _i, _len, _ref;
    dup = node.cloneNode(false);
    dup._property = node._property;
    dup.context = node.context;
    dup.events = node.events;
    _ref = node.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        prop = child._property;
        ctx = child.context;
        dup.appendChild(cloneNodes(child));
    }
    return dup;
};

Crystal.Utils.Evented.prototype.addProperty = function(name, value, enumerable) {
    var _ref;
    if (enumerable == null) {
        enumerable = false;
    }
    if ((_ref = this.__properties__) == null) {
        this.__properties__ = [];
    }
    if (!(value instanceof Function)) {
        this.__properties__[name] = value;
    }
    return Object.defineProperty(this, name, {
        get: function() {
            return this.__properties__[name];
        },
        set: function(val) {
            this.__properties__[name] = val;
            if (value instanceof Function) {
                value(val);
            }
            this.trigger('change');
            return this.trigger('change:' + name);
        },
        enumerable: !!enumerable
    });
};

/*
 --------------- /home/gdot/github/cssshop/source/classes/document.coffee--------------
 */


CSSDocument = (function(_super) {

    __extends(CSSDocument, _super);

    function CSSDocument(name) {
        var _this = this;
        this.name = name;
        this.layerGroup = new LayerGroup;
        this.addProperty('width', function(value) {
            return _this.layerGroup.base.style.width = value + "px";
        });
        this.addProperty('height', function(value) {
            return _this.layerGroup.base.style.height = value + "px";
        });
        this.addProperty('color', function(value) {
            return _this.layerGroup.base.style.backgroundColor = value;
        });
    }

    CSSDocument.prototype.reset = function() {
        this.width = (window.innerWidth - 700).clamp(700, 1200);
        this.height = window.innerHeight - 120;
        this.color = 'FFFFFF';
        this.layerGroup.empty();
        this.layerGroup.addNewLayer();
        this.layerGroup.layers[0].center();
        return this.publish('document:update');
    };

    CSSDocument.prototype.toCSS = function() {
        return ".container {\n  width: " + this.width + "px;\n  height: " + this.height +
            "px;\n  background-color: " + this.color + ";\n}\n\n" + (this.layerGroup.toCSS(true));
    };

    CSSDocument.prototype.toHTML = function() {
        return "<div class='container'>\n  " + (this.layerGroup.toHTML()) + "\n</div>";
    };

    CSSDocument.prototype.toObj = function() {
        return {
            width: this.width,
            height: this.height,
            color: this.color,
            layers: this.layerGroup.toObj()
        };
    };

    CSSDocument.prototype.fromObj = function(obj) {
        var _this = this;
        if (typeof obj === 'undefined' || !obj) return;

        //TestCode
        console.log("document:update");
        try {
            _this._publish = false;
            _this.width = obj.width;
            _this.height = obj.height;
            _this.color = obj.color;
            _this.layerGroup.base.dispose();
            window.fireRangeEvents = false;
            _this.layerGroup.fromObj(obj.layers);
            window.fireRangeEvents = true;
            document.body.append(this.layerGroup.base);
            _this._publish = true;

            return _this.publish('document:update');
        } catch (e) {
            console.error(e);
        }
    };

    CSSDocument.prototype.center = function() {
        return this.layerGroup.base.style.left = (window.innerWidth - this.width) / 2;
    };

    return CSSDocument;

})(Crystal.Utils.Evented);

/*
 --------------- /home/gdot/github/cssshop/source/classes/drag.coffee--------------
 */


Dragger = (function(_super) {

    __extends(Dragger, _super);

    Dragger.snapDistance = 20;

    function Dragger(lg) {
        var _this = this;
        this.lg = lg;
        this.drag = __bind(this.drag, this);

        this.dragViewport = __bind(this.dragViewport, this);

        this.update = __bind(this.update, this);

        this.updateViewPort = __bind(this.updateViewPort, this);

        this.end = __bind(this.end, this);

        this.start = __bind(this.start, this);

        this.currentPosition = new WebKitPoint;
        this.currentViewPortPosition = new WebKitPoint;
        this.subscribe('select', function(e) {
            return _this.selected = e.target;
        });
        document.addEventListener('mousedown', this.start);
        document.addEventListener('mouseup', this.end);
    }

    Dragger.prototype.start = function(e) {
        var rect;
        this.mouseIsDown = true;
        this.moved = false;
        if (e.which === 2) {
            rect = this.lg.base.getBoundingClientRect();
            this.currentViewPortPosition.y = rect.top;
            this.currentViewPortPosition.x = rect.left;
            this.offset = {
                y: e.pageY - rect.top,
                x: e.pageX - rect.left
            };
            document.addEventListener('mousemove', this.dragViewport);
            return requestAnimationFrame(this.updateViewPort);
        } else if (e.target.tagName.toLowerCase() === 'layer') {
            this.currentPosition.y = this.selected.styles.basic.y;
            this.currentPosition.x = this.selected.styles.basic.x;
            this.offset = {
                y: e.pageY - this.selected.styles.basic.y || 0,
                x: e.pageX - this.selected.styles.basic.x || 0
            };
            document.addEventListener('mousemove', this.drag);
            return requestAnimationFrame(this.update);
        }
    };

    Dragger.prototype.end = function(e) {
        document.removeEventListener('mousemove', this.drag);
        document.removeEventListener('mousemove', this.dragViewport);
        this.mouseIsDown = false;
        if (this.moved) {
            return this.publish('action');
        }
    };

    Dragger.prototype.updateViewPort = function() {
        if (this.mouseIsDown) {
            requestAnimationFrame(this.updateViewPort);
        }
        this.lg.base.style.top = this.currentViewPortPosition.y;
        this.lg.base.style.left = this.currentViewPortPosition.x;
        return this.publish('setRect');
    };

    Dragger.prototype.update = function() {
        if (this.mouseIsDown) {
            requestAnimationFrame(this.update);
        }
        this.selected.styles.basic.y = this.currentPosition.y;
        return this.selected.styles.basic.x = this.currentPosition.x;
    };

    Dragger.prototype.dragViewport = function(e) {
        this.currentViewPortPosition.y = e.pageY - this.offset.y;
        return this.currentViewPortPosition.x = e.pageX - this.offset.x;
    };

    Dragger.prototype.drag = function(e) {
        var layer, lh, lw, lx, ly, sd, th, tw, tx, ty, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _results;
        this.currentPosition.y = e.pageY - this.offset.y;
        this.currentPosition.x = e.pageX - this.offset.x;
        if (!this.selected.locked) {
            this.moved = true;
            if (e.ctrlKey) {
                sd = Dragger.snapDistance;
                ty = this.currentPosition.y;
                tx = this.currentPosition.x;
                tw = this.selected.styles.basic.width;
                th = this.selected.styles.basic.height;
                _ref = this.lg.layers;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    layer = _ref[_i];
                    if (layer !== this.selected) {
                        ly = layer.styles.basic.y;
                        lx = layer.styles.basic.x;
                        lw = layer.styles.basic.width;
                        lh = layer.styles.basic.height;
                        if (((ly - sd) < ty && ty < (ly + sd))) {
                            this.currentPosition.y = ly;
                        }
                        if ((((ly + lh) - sd) < (_ref1 = ty + th) && _ref1 < ((ly + lh) + sd))) {
                            this.currentPosition.y = (ly + lh) - th;
                        }
                        if (((ly - sd) < (_ref2 = ty + th) && _ref2 < (ly + sd))) {
                            this.currentPosition.y = ly - th;
                        }
                        if ((((ly + lh) - sd) < ty && ty < ((ly + lh) + sd))) {
                            this.currentPosition.y = ly + lh;
                        }
                        if (((lx - sd) < tx && tx < (lx + sd))) {
                            this.currentPosition.x = lx;
                        }
                        if ((((lx + lw) - sd) < (_ref3 = tx + tw) && _ref3 < ((lx + lw) + sd))) {
                            this.currentPosition.x = (lx + lw) - tw;
                        }
                        if (((lx - sd) < (_ref4 = tx + tw) && _ref4 < (lx + sd))) {
                            this.currentPosition.x = lx - tw;
                        }
                        if ((((lx + lw) - sd) < tx && tx < ((lx + lw) + sd))) {
                            _results.push(this.currentPosition.x = lx + lw);
                        } else {
                            _results.push(void 0);
                        }
                    } else {
                        _results.push(void 0);
                    }
                }
                return _results;
            }
        }
    };

    return Dragger;

})(Crystal.Utils.Evented);

/*
 --------------- /home/gdot/github/cssshop/source/classes/file-drop.coffee--------------
 */


FileDrop = (function(_super) {

    __extends(FileDrop, _super);

    FileDrop.prototype.stop = function(e) {
        e.stopPropagation();
        return e.preventDefault();
    };

    function FileDrop() {
        this.handleFiles = __bind(this.handleFiles, this);
        document.body.addEvent("dragenter", this.stop, false);
        document.body.addEvent("dragover", this.stop, false);
        document.body.addEvent("drop", this.handleFiles, false);
    }

    FileDrop.prototype.handleFiles = function(e) {
        var file, imageType, layer, reader,
            _this = this;
        this.stop(e);
        file = e.dataTransfer.files[0];
        imageType = /image.*/;
        if (!file.type.match(imageType)) {
            return;
        }
        layer = new Layer();
        reader = new FileReader();
        reader.onload = function(e) {
            var img;
            img = document.createElement('img');
            img.src = e.target.result;
            return img.onload = function() {
                layer.styles.basic.width = img.width;
                layer.styles.basic.height = img.height;
                layer.name = file.name.replace(/\..*$/, '');
                layer.styles.background.image = e.target.result;
                return _this.publish('imageDropped', layer);
            };
        };
        return reader.readAsDataURL(file);
    };

    return FileDrop;

})(Crystal.Utils.Evented);

/*
 --------------- /home/gdot/github/cssshop/source/classes/history.coffee--------------
 */


AppHistory = (function(_super) {

    __extends(AppHistory, _super);

    function AppHistory(doc) {
        var _this = this;
        this.doc = doc;
        this.listen = true;
        this.reset();
        this.subscribe('document:update', function() {
            var state;
            if (_this.listen) {
                _this.reset();
                state = _this.doc.toObj();
                return _this.actions.push(state);
            }
        });
        this.subscribe('action', function(event) {
            var state;
            if (_this.listen) {
                console.log('action >>> ' + event.target);
                if (_this.index < _this.actions.length - 1) {
                    _this.actions.splice(_this.index + 1);
                }
                state = _this.doc.toObj();
                _this.actions.push(state);
                return _this.index = _this.actions.indexOf(state);
            }
        });
    }

    AppHistory.prototype.reset = function() {
        this.actions = [];
        return this.index = 0;
    };

    AppHistory.prototype.apply = function(direction) {
        var action;
        action = this.actions[this.index];
        if (action) {
            this.listen = false;
            this.doc.fromObj(action);
            return this.listen = true;
        }
    };

    AppHistory.prototype.redo = function() {
        if (this.index < this.actions.length) {
            this.index++;
            return this.apply();
        }
    };

    AppHistory.prototype.undo = function() {
        if (this.index > 0) {
            this.index--;
            return this.apply();
        }
    };

    return AppHistory;

})(Crystal.Utils.Evented);

/*
 --------------- /home/gdot/github/cssshop/source/classes/colorpicker.coffee--------------
 */


ColorPicker = (function(_super) {

    __extends(ColorPicker, _super);

    function ColorPicker() {
        this.dragCircle = __bind(this.dragCircle, this);

        this.end = __bind(this.end, this);

        this.drag = __bind(this.drag, this);

        this.dragTriangle = __bind(this.dragTriangle, this);

        var point, _i, _len, _ref,
            _this = this;
        this.el = document.createElement('picker');
        this.circleCanvas = document.createElement('canvas');
        this.triangle = document.createElement('triangle');
        this.triangle.appendChild(document.createElement('gradient'));
        this.triangle.style.background = 'red';
        document.body.appendChild(this.el);
        this.circleCanvas.width = 160;
        this.circleCanvas.height = 160;
        this.drawHSLACone(160);
        _ref = ['point', 'point2'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            point = _ref[_i];
            this[point] = document.createElement('point');
        }
        this.color = new Color("#ff0000");
        this.endColor = new Color("#ff0000");
        this.triangle.style.width = 82;
        this.triangle.style.height = 82;
        this.el.appendChild(this.triangle);
        this.el.appendChild(this.circleCanvas);
        this.triangle.appendChild(this.point);
        this.el.appendChild(this.point2);
        this.el.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            _this.dragTriangle(e);
            _this.dragCircle(e);
            _this.el.addEventListener('mousemove', _this.drag);
            return document.addEventListener('mouseup', _this.end);
        });
    }

    ColorPicker.prototype.fromColor = function(color) {
        var c, radius;
        try {
            c = new Color(color);
            radius = 69;
            this.angleRad = -c.hue * (Math.PI / 180);
            this.point2.style.top = radius * Math.sin(this.angleRad) + 85;
            this.point2.style.left = radius * Math.cos(this.angleRad) + 85;
            this.point.style.left = (c.saturation / 100) * 82 - 6;
            this.point.style.top = (Math.min((100 - c.lightness) / 100, 100 - c.saturation / 50) * 82) - 6;
            this.color.hue = c.hue;
            this.endColor = c;
            this.triangle.style.background = this.color.hex;
            return this.setBoundValue();
        } catch (_error) {}
    };

    ColorPicker.prototype.dragTriangle = function(e) {
        var p, _ref, _ref1;
        // Muse see: convertPointFromPageToNode.js
        // p = webkitConvertPointFromPageToNode(this.triangle, new WebKitPoint(e.pageX, e.pageY));
        p = convertPointFromPageToNode(this.triangle, e.pageX, e.pageY);
        if ((0 < (_ref = p.x) && _ref < 82) && (0 < (_ref1 = p.y) && _ref1 < 82)) {
            this.point.style.top = p.y - 6;
            this.point.style.left = p.x - 6;
            this.endColor.lightness = Math.min(100 - Math.round((p.y / 82) * 100), 100 - (Math.round((p.x /
                82) * 50)));
            this.endColor.saturation = Math.round((p.x / 82) * 100);
            return this.setBoundValue();
        }
    };

    ColorPicker.prototype.setBoundValue = function() {
        var evt, _ref;
        if ((_ref = this.bound) != null) {
            _ref.value = this.endColor.hex;
        }
        evt = document.createEvent("Event");
        evt.initEvent("input", true, false);
        evt.colorPicker = true;
        return this.bound.dispatchEvent(evt);
    };

    ColorPicker.prototype.bind = function(input) {
        return this.bound = input;
    };

    ColorPicker.prototype.drag = function(e) {
        this.dragTriangle(e);
        return this.dragCircle(e);
    };

    ColorPicker.prototype.end = function() {
        this.el.removeEventListener('mousemove', this.drag);
        return document.removeEventListener('mouseup', this.end);
    };

    ColorPicker.prototype.dragCircle = function(e) {
        var left, r, radius, top;
        top = e.layerY - 80;
        left = e.layerX - 80;
        r = Math.sqrt(Math.pow(top, 2) + Math.pow(left, 2));
        radius = 69;
        if ((60 < r && r < 80)) {
            this.angleRad = Math.atan2(top, left);
            this.angle = this.angleRad * (180 / Math.PI);
            this.point2.style.top = radius * Math.sin(this.angleRad) + 85;
            this.point2.style.left = radius * Math.cos(this.angleRad) + 85;
            this.endColor.hue = this.color.hue = 360 - this.angle;
            this.triangle.style.background = this.color.hex;
            return this.setBoundValue();
        }
    };

    ColorPicker.prototype.drawHSLACone = function(width) {
        var ang, angle, c, ctx, i, w2, _i, _ref, _results;
        ctx = this.circleCanvas.getContext('2d');
        ctx.translate(width / 2, width / 2);
        w2 = -width / 2;
        ang = width / 50;
        angle = (1 / ang) * Math.PI / 180;
        i = 0;
        _results = [];
        for (i = _i = 0, _ref = 360. * ang - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i :
            --_i) {
            try {
                c = new Color("#ff0000");
                c.hue = 360 - (i / ang);
                ctx.strokeStyle = "#" + c.hex;
                ctx.beginPath();
                ctx.moveTo(width / 2 - 20, 0);
                ctx.lineTo(width / 2, 0);
                ctx.stroke();
            } catch (e) {
                console.error(e);
            } finally {

            }

            _results.push(ctx.rotate(angle));
        }
        return _results;
    };

    ColorPicker.prototype.hide = function() {
        if (this.el.css('display') === 'block') {
            this.el.css('display', 'none');
            if (this.startColor !== this.bound.value) {
                return this.publish('action');
            }
        }
    };

    ColorPicker.prototype.show = function(el) {
        var rect;
        this.bind(el);
        this.startColor = el.value;
        rect = el.getBoundingClientRect();
        this.fromColor(el.value);
        if (window.innerWidth < 180 + rect.left) {
            this.el.classList.remove('left');
            this.el.classList.add('right');
            this.el.style.left = rect.left - 180 + rect.width;
        } else {
            this.el.style.left = rect.left;
            this.el.classList.remove('right');
            this.el.classList.add('left');
        }
        if (window.innerHeight < 180 + rect.top) {
            this.el.style.top = rect.top - rect.height - 163;
            this.el.classList.remove('bottom');
            this.el.classList.add('top');
        } else {
            this.el.style.top = rect.top + rect.height;
            this.el.classList.remove('top');
            this.el.classList.add('bottom');
        }
        return this.el.css('display', 'block');
    };

    return ColorPicker;

})(Crystal.Utils.Evented);

/*
 --------------- /home/gdot/github/cssshop/source/classes/downloader.coffee--------------
 */


Downloader = (function() {

    function Downloader() {
        this.el = document.createElement('a');
    }

    Downloader.prototype.download = function(data, filename) {
        var url;
        this.blob = new Blob([data], {
            type: 'text/css'
        });
        url = window.webkitURL.createObjectURL(this.blob);
        this.el.setAttribute('download', filename);
        this.el.setAttribute('href', url);
        return this.el.click();
    };

    return Downloader;

})();


/*
 --------------- /home/gdot/github/cssshop/source/classes/layer.coffee--------------
 */


Styles = (function() {

    function Styles() {}

    Styles.prototype.toObj = function() {
        var key, r, value;
        r = {};
        for (key in this) {
            value = this[key];
            if (key.match(/^_/)) {
                continue;
            }
            if (value instanceof Object) {
                if (value.toObj) {
                    r[key] = value.toObj();
                }
            } else {
                r[key] = value;
            }
        }
        return r;
    };

    Styles.prototype.fromObj = function(obj) {
        var key, value, _results;
        _results = [];
        for (key in obj) {
            value = obj[key];
            if (!(value instanceof Object)) {
                _results.push(this[key] = value);
            } else {
                _results.push(this[key].fromObj(value));
            }
        }
        return _results;
    };

    return Styles;

})();

Layer = (function(_super) {

    __extends(Layer, _super);

    Layer.UID = function() {
        var i, id, l, m, _i, _len, _ref;
        id = -1;
        _ref = document.querySelectorAll('layer');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            l = _ref[_i];
            if ((m = l.layer.name.match(/Layer\s(\d+)/))) {
                i = parseInt(m[1]);
                if (i > id) {
                    id = i;
                }
            }
        }
        return id + 1;
    };

    Layer.prototype.toString = function() {
        return "[" + this.name + "] ";
    };

    Layer.prototype.hide = function() {
        return this.display = 'none';
    };

    Layer.prototype.show = function() {
        return this.display = 'block';
    };

    Layer.prototype.select = function() {
        return this.publish('select');
    };

    Layer.prototype.toggle = function() {
        if (this.display === 'block') {
            return this.hide();
        } else {
            return this.show();
        }
    };

    Layer.prototype.toggleLock = function() {
        this.locked = !this.locked;
        return this.el.style.pointerEvents = this.el.style.pointerEvents === "auto" ? "none" : "auto";
    };

    Layer.prototype.toggleSelector = function() {
        return this.asSelector = !this.asSelector;
    };

    Layer.prototype.destroy = function() {
        this.el.parentElement.removeChild(this.el);
        return this.trigger('destroy');
    };

    Layer.prototype.center = function() {
        if (this.el.parent) {
            this.styles.basic.x = (parseInt(this.el.parent.style.width) - this.styles.basic.width) / 2;
            return this.styles.basic.y = (parseInt(this.el.parent.style.height) - this.styles.basic.height) /
                2;
        }
    };

    function Layer() {
        this.select = __bind(this.select, this);

        var _this = this;
        this.uid = Layer.UID();
        this.addProperty('name', 'Layer ' + this.uid, true);
        this.el = document.createElement('layer');
        this.el.layer = this;
        this.el.addEventListener('mousedown', this.select);
        this.el.addEventListener('dblclick', function() {
            return _this.publish('textarea', 'Text', _this.text, function(value) {
                _this.text = value;
                return _this.publish('action');
            });
        });
        this.el.style.position = 'absolute';
        this.el.style.webkitBoxSizing = 'border-box';
        this.el.style.pointerEvents = 'auto';
        this.locked = false;
        this.asSelector = false;
        this.display = 'block';
        this.styles = new Styles;
        this.styles.background = new Background(this.el);
        this.styles.basic = new Basic(this.el);
        this.styles.border = new Border(this.el);
        this.styles.transform = new Transform(this.el);
        this.styles.borderRadius = new BorderRadius(this.el);
        this.styles.outerShadow = new OuterShadow(this.el);
        this.styles.outerShadow.on('change', this.applyShadow.bind(this));
        this.styles.innerShadow = new InnerShadow(this.el);
        this.styles.innerShadow.on('change', this.applyShadow.bind(this));
        this.styles.bevel = new Bevel(this.el);
        this.styles.bevel.on('change', this.applyShadow.bind(this));
        this.styles.textFilter = new TextFilter(this.el);
        this.styles.textShadow = new TextShadow(this.el);
        this.styles.textShadow.on('change', this.applyTextShadow.bind(this));
        this.styles.textBevel = new TextBevel(this.el);
        this.styles.textBevel.on('change', this.applyTextShadow.bind(this));
        this.styles.textStroke = new TextStroke(this.el);
        this.styles.filter = new FFilter(this.el);
    }

    Layer.prototype.applyTextShadow = function() {
        var value;
        value = [this.styles.textShadow, this.styles.textBevel].filter(function(shadow) {
            return shadow._default_value !== shadow.value;
        }).map(function(shadow) {
            return shadow.value;
        }).join(",");
        return this.el.style.textShadow = value;
    };

    Layer.prototype.applyShadow = function() {
        return this.el.style.boxShadow = [this.styles.bevel, this.styles.outerShadow, this.styles.innerShadow]
            .map(function(shadow) {
                return shadow.value;
            }).join(",");
    };

    Layer.prototype.shadowToCSS = function() {
        var value;
        return value = [this.styles.bevel, this.styles.outerShadow, this.styles.innerShadow].filter(
            function(shadow) {
                return shadow._default_value !== shadow.value;
            }).map(function(shadow) {
            return shadow.value;
        }).join(",");
    };

    Layer.prototype.textShadowToCSS = function() {
        var ret, value;
        value = [this.styles.textShadow, this.styles.textBevel].filter(function(shadow) {
            return shadow._default_value !== shadow.value;
        }).map(function(shadow) {
            return shadow.value;
        }).join(",");
        if (value !== "") {
            return ret = "text-shadow: " + value + ";\n";
        } else {
            return value;
        }
    };

    Layer.prototype.toSass = function() {
        var code, css, key, ret, selector, style, value, _ref;
        selector = "." + this.selector();
        code = '';
        code += '+box-sizing(border-box)\n';
        _ref = this.styles;
        for (key in _ref) {
            style = _ref[key];
            code += (typeof style.toSass === "function" ? style.toSass() : void 0) || (typeof style.toCSS ===
                "function" ? style.toCSS() : void 0) || '';
        }
        code += (value = this.shadowToCSS()) !== "" ? ret = "+box-shadow(" + value + ")\n" : "";
        code += this.textShadowToCSS();
        css = selector + "\n";
        css += code.replace(/^/gm, '  ');
        return css.trim() + "\n\n";
    };

    Layer.prototype.selector = function() {
        if (this.asSelector) {
            return this.name;
        }
        return this.name.replace(/[^a-zA-Z 0-9-_]/g, '').toLowerCase().replace(/\s/g, '-');
    };

    Layer.prototype.toCSS = function(position) {
        var code, css, key, prefix, ret, selector, style, value, _i, _len, _ref, _ref1,
            _this = this;
        if (position == null) {
            position = false;
        }
        selector = this.asSelector ? this.selector() : "." + this.selector();
        code = '';
        code += 'box-sizing: border-box;\n';
        _ref = ['moz'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            prefix = _ref[_i];
            code += "-" + prefix + "-box-sizing: border-box;\n";
        }
        _ref1 = this.styles;
        for (key in _ref1) {
            style = _ref1[key];
            code += (typeof style.toCSS === "function" ? style.toCSS(position) : void 0) || '';
        }
        code += (value = this.shadowToCSS()) !== "" ? (ret = "box-shadow: " + value + ";\n", ret += [
            'webkit', 'moz', 'ms', 'o'
        ].map(function(prefix) {
            return "-" + prefix + "-box-shadow: " + value + ";\n";
        }).join("")) : "";
        code += this.textShadowToCSS();
        css = selector + " {\n";
        css += code.replace(/^/gm, '  ');
        return css.trim() + "\n}\n";
    };

    Layer.prototype.toHTML = function() {
        return "<div class='" + this.selector() + ("'>" + this.text + "</div>");
    };

    Layer.prototype.toObj = function() {
        var key, r, value;
        r = {};
        for (key in this) {
            value = this[key];
            if (key.match(/^_/)) {
                continue;
            }
            if (value instanceof Object) {
                if (value.toObj) {
                    r[key] = value.toObj();
                }
            } else {
                r[key] = value;
            }
        }
        return r;
    };

    Layer.prototype.fromObj = function(obj) {
        var key, value, _results;
        _results = [];
        for (key in obj) {
            value = obj[key];
            if (key === 'uid') {
                continue;
            }
            if (!(value instanceof Object)) {
                _results.push(this[key] = value);
            } else {
                _results.push(this[key].fromObj(value));
            }
        }
        return _results;
    };

    return Layer;

})(Crystal.Utils.Evented);

Object.defineProperty(Layer.prototype, 'text', {
    set: function(value) {
        return this.el.textContent = value;
    },
    get: function() {
        return this.el.textContent;
    },
    enumerable: true
});

['display'].forEach(function(prop) {
    return Object.defineProperty(Layer.prototype, prop, {
        set: function(value) {
            this["_" + prop] = value;
            return this.el.style[prop] = value;
        },
        get: function() {
            return this["_" + prop];
        },
        enumerable: true
    });
});

/*
 --------------- /home/gdot/github/cssshop/source/classes/layer-group.coffee--------------
 */


LayerGroup = (function(_super) {

    __extends(LayerGroup, _super);

    function LayerGroup() {
        LayerGroup.__super__.constructor.apply(this, arguments);
        this.base = document.createElement('layergroup');
        this.base.style.position = 'absolute';
        this.layers = [];
    }

    LayerGroup.prototype.addLayer = function(layer) {
        this.base.appendChild(layer.el);
        this.layers.push(layer);
        this.trigger('add', layer);
        layer.select();
        this.publish('action');
        return layer;
    };

    LayerGroup.prototype.addNewLayer = function() {
        var layer;
        layer = new Layer();
        return this.addLayer(layer);
    };

    LayerGroup.prototype.removeLayer = function(layer) {
        var _ref;
        this.layers.splice(this.layers.indexOf(layer), 1);
        if ((_ref = this.layers[0]) != null) {
            _ref.select();
        }
        layer.destroy();
        this.publish('action');
        return this.trigger('remove');
    };

    LayerGroup.prototype.moveLayerUp = function(layer) {
        var index, otherLayer;
        index = this.layers.indexOf(layer);
        if (index < this.layers.length - 1) {
            otherLayer = this.layers[index + 1];
            this.layers[index + 1] = layer;
            this.layers[index] = otherLayer;
            this.publish('action');
            return true;
        } else {
            return false;
        }
    };

    LayerGroup.prototype.moveLayerDown = function(layer) {
        var index, otherLayer;
        index = this.layers.indexOf(layer);
        if (index > 0) {
            otherLayer = this.layers[index - 1];
            this.layers[index - 1] = layer;
            this.layers[index] = otherLayer;
            this.publish('action');
            return true;
        } else {
            return false;
        }
    };

    LayerGroup.prototype.empty = function() {
        var layer, _i, _len, _ref, _results;
        _ref = this.layers.slice();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            layer = _ref[_i];
            _results.push(this.removeLayer(layer));
        }
        return _results;
    };

    LayerGroup.prototype.toCSS = function(position) {
        var layer, layers, name, _i, _len, _name, _ref, _ref1;
        if (position == null) {
            position = false;
        }
        layers = {};
        _ref = this.layers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            layer = _ref[_i];
            if ((_ref1 = layers[_name = layer.name]) == null) {
                layers[_name] = layer;
            }
        }
        return ((function() {
            var _results;
            _results = [];
            for (name in layers) {
                layer = layers[name];
                _results.push(layer.toCSS(position));
            }
            return _results;
        })()).join("\n");
    };

    LayerGroup.prototype.toHTML = function() {
        var item, r, _i, _len, _ref;
        r = '';
        _ref = this.layers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            r += item.toHTML() + "\n";
        }
        return r;
    };

    LayerGroup.prototype.toObj = function() {
        var layer, _i, _len, _ref, _results;
        _ref = this.layers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            layer = _ref[_i];
            _results.push(layer.toObj());
        }
        return _results;
    };

    LayerGroup.prototype.fromObj = function(layers) {
        var item, l, _i, _len, _results;
        this.empty();
        _results = [];
        for (_i = 0, _len = layers.length; _i < _len; _i++) {
            item = layers[_i];
            l = new Layer();
            l.fromObj(item);
            _results.push(this.addLayer(l));
        }
        return _results;
    };

    return LayerGroup;

})(Crystal.Utils.Evented);

/*
 --------------- /home/gdot/github/cssshop/source/classes/file-manager.coffee--------------
 */


FileManager = (function(_super) {

    __extends(FileManager, _super);

    FileManager.prototype.properties = {
        current: {}
    };

    function FileManager(document) {
        this.document = document;
        FileManager.__super__.constructor.apply(this, arguments);
        this.NW = PLATFORM === Platforms.NODE_WEBKIT;
        this.b$ = b$;
        this.downloader = new Downloader();

        if (this.b$.pN) {
            var _this = this;

            // 支持拖拽
            _this.b$.enableDragDropFeature({
                callback: "app.onImportFileCallbackFunc",
                fileTypes: ["css"]
            });


            var wantSetMenu = true;
            if (wantSetMenu) {
                console.log("configure SystemMenus....");
                //处理File菜单的问题
                (_this.b$.SystemMenus.setMenuProperty({
                    menuTag: 101,
                    hideMenu: false,
                    action: _this.b$._get_callback(function() {
                        _this.new();
                    }, true)
                }));
                (_this.b$.SystemMenus.setMenuProperty({
                    menuTag: 102,
                    hideMenu: false,
                    action: _this.b$._get_callback(function() {
                        _this.open();
                    }, true)
                }));
                (_this.b$.SystemMenus.setMenuProperty({
                    menuTag: 103,
                    hideMenu: false
                }));
                (_this.b$.SystemMenus.setMenuProperty({
                    menuTag: 104,
                    hideMenu: true
                }));
                (_this.b$.SystemMenus.setMenuProperty({
                    menuTag: 105,
                    hideMenu: true
                }));
                (_this.b$.SystemMenus.setMenuProperty({
                    menuTag: 106,
                    hideMenu: false,
                    action: _this.b$._get_callback(function() {
                        _this.save();
                    }, true)
                }));
                (_this.b$.SystemMenus.setMenuProperty({
                    menuTag: 107,
                    hideMenu: false,
                    action: _this.b$._get_callback(function() {
                        _this.save();
                    }, true)
                }));
                (_this.b$.SystemMenus.setMenuProperty({
                    menuTag: 108,
                    hideMenu: true
                }));
            }
        }

    }

    FileManager.prototype["export"] = function() {
        var _this = this;
        if (this.NW) {
            return NWDialogs.save(function(file) {
                return file.write(_this.document.layerGroup.toCSS());
            });
        } else {
            return this.publish('text', 'input a Filename:', '', function(filename) {
                if (!filename.match(/\.css$/)) {
                    filename += ".css";
                }
                return _this.downloader.download(_this.document.layerGroup.toCSS(), filename);
            });
        }
    };


    FileManager.prototype.open = function() {
        var _this = this;
        if (_this.NW) {
            return NWDialogs.open(function(file) {
                _this.current = file;
                return _this.document.fromObj(JSON.parse(file.read()));
            });
        } else if (_this.b$.pN) {
            try {
                _this.b$.importFiles({
                    callback: "app.onImportFileCallbackFunc",
                    allowOtherFileTypes: false,
                    allowMulSelection: true,
                    canChooseDir: false,
                    canChooseFiles: true,
                    title: "Open CSS file",
                    prompt: "Open",
                    types: ["css"]
                });
            } catch (e) {
                console.log(e);
            }
        } else {
            return _this.document.fromObj(JSON.parse(localStorage.getItem('document')));
        }
    };

    FileManager.prototype["new"] = function() {
        var _this = this;
        if (this.NW) {
            return NWDialogs.save(function(file) {
                _this.current = file;
                return _this.document.reset();
            });
        } else {
            _this.current = {};
            app.setTitle(false);
            return this.document.reset();
        }
    };

    FileManager.prototype.save = function() {
        var _this = this;
        if (_this.NW) {
            if (!_this.current) {
                return NWDialogs.save(function(file) {
                    _this.current = file;
                    _this.current.write(JSON.stringify(_this.document.toObj()));
                    return _this.publish('save');
                });
            } else {
                _this.current.write(JSON.stringify(_this.document.toObj()));
                return _this.publish('save');
            }
        } else if (_this.b$.pN) {

            //检测文件是否存在。并且可写
            var wantSaveAs = true;
            var current = _this.current;

            if (typeof current !== "undefined") {
                if (current["path"] || current["filePath"]) {
                    var filePath = current["path"] || current["filePath"];
                    var exist = _this.b$.App.checkPathIsExist(filePath);
                    if (exist) {
                        var writeAble = _this.b$.App.checkPathIsWritable(filePath);
                        wantSaveAs = !writeAble;
                        if (writeAble) {
                            _this.b$.Binary.createTextFile({
                                filePath: filePath,
                                text: JSON.stringify(_this.document.toObj())
                            }, function(obj) {
                                if (obj) {
                                    try {
                                        if (obj.success) {
                                            app.setTitle(true);
                                        } else {
                                            alert(obj.error);
                                        }
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }
                            });
                        }
                    }
                }
            }

            if (wantSaveAs) {
                try {
                    _this.b$.selectOutFile({
                        callback: "app.onSaveFileCallbackFunc",
                        types: ["css"]
                    });
                } catch (e) {
                    console.log(e);
                }
            }


        } else {
            return localStorage.setItem('document', JSON.stringify(_this.document.toObj()));
        }
    };

    return FileManager;

})(Model);

/*
 --------------- /home/gdot/github/cssshop/source/classes/filter.coffee--------------
 */


Filters = {};

Filter = (function(_super) {

    __extends(Filter, _super);

    function Filter(el) {
        this._properties = {};
        Object.defineProperty(this, 'el', {
            value: el,
            writable: true
        });
        this.init();
    }

    Filter.prototype.init = function(obj) {
        var key, value, _results;
        _results = [];
        for (key in obj) {
            value = obj[key];
            this[key] = value;
            _results.push(this["_default_" + key] = value);
        }
        return _results;
    };

    Filter.prototype.toObj = function() {
        var key, r, value;
        r = {};
        for (key in this) {
            value = this[key];
            if ((!key.match(/^_/)) && !(value instanceof Function)) {
                r[key] = value;
            }
        }
        return r;
    };

    Filter.prototype.fromObj = function(obj) {
        var key, value, _results;
        _results = [];
        for (key in obj) {
            value = obj[key];
            if (!(value instanceof Object)) {
                _results.push(this[key] = value);
            } else {
                _results.push(void 0);
            }
        }
        return _results;
    };

    Filter.prototype.reset = function() {
        var key, m, value, _results;
        _results = [];
        for (key in this) {
            value = this[key];
            if ((m = key.match(/^_default_(.*)/))) {
                _results.push(this[m[1]] = value);
            } else {
                _results.push(void 0);
            }
        }
        return _results;
    };

    Filter.addProperty = function(name, setter, enumerable) {
        if (enumerable == null) {
            enumerable = true;
        }
        return Object.defineProperty(this.prototype, name, {
            set: function(value) {
                if (this._properties[name] !== value) {
                    this._properties[name] = value;
                    if (setter != null) {
                        setter.call(this, value);
                    }
                    return this.trigger('change');
                }
            },
            get: function() {
                return this._properties[name];
            },
            enumerable: enumerable
        });
    };

    Filter.addProperties = function(props, setter, enumerable) {
        var name, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = props.length; _i < _len; _i++) {
            name = props[_i];
            _results.push(this.addProperty(name, setter, enumerable));
        }
        return _results;
    };

    return Filter;

})(Crystal.Utils.Evented);

/*
 --------------- /home/gdot/github/cssshop/source/classes/controller.coffee--------------
 */


AbstractController = (function(_super) {

    __extends(AbstractController, _super);

    function AbstractController(selector, prototype, isInstace) {
        var base, column2, el, tab, undo,
            _this = this;
        if (isInstace == null) {
            isInstace = false;
        }
        base = el = document.querySelector(selector + " .controls");
        document.querySelector(selector + ' .legend').addEvent('click', function(e) {
            return e.target.parent.classList.toggle('closed');
        });
        if (tab = el.first('tab')) {
            el = tab;
        }
        if (column2 = el.first('column2')) {
            el = column2;
        }
        base.css('height', el.all('.field:not(.small)').length * 29 + el.all('.field.small').length * 24);
        undo = document.first(selector + " .icon-undo");
        if (undo) {
            undo.addEventListener('click', function(e) {
                var _ref;
                e.stopPropagation();
                if ((_ref = _this.instance) != null) {
                    _ref.reset();
                }
                return _this.populate();
            });
        }
        this.tabs = Array.prototype.slice.call(document.querySelectorAll(selector + " tab"));
        this.tabHandlers = Array.prototype.slice.call(document.querySelectorAll(selector + " handle"));
        this.tabHandlers.forEach(function(handle, i) {
            return handle.addEventListener('click', function() {
                var c, _i, _len, _ref;
                _ref = _this.tabs;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    tab = _ref[_i];
                    tab.style.display = 'none';
                }
                el = _this.tabs[i];
                if (c = el.first('column2')) {
                    el = c;
                }
                el.ancestor('.controls').css('height', el.all('.field:not(.small)').length * 29 +
                    el.all('.field.small').length * 24);
                _this.tabs[i].style.display = 'block';
                return _this.populate();
            });
        });
        if (isInstace) {
            this.instance = prototype;
        }
        this.inputs = Array.prototype.slice.call(document.querySelectorAll(selector + " [name]"));
        this.inputs.forEach(function(el) {
            var desc, id, name;
            name = el.getAttribute('name');
            desc = Object.getOwnPropertyDescriptor(prototype, name);
            if (desc || isInstace) {
                if (el.tagName === 'SELECT') {
                    el.addEventListener('change', function(e) {
                        var _ref;
                        if ((_ref = _this.instance) != null) {
                            _ref[name] = e.target.val;
                        }
                        return _this.publish('action');
                    });
                } else if (el.getAttribute('type') === 'file') {
                    el.addEventListener('change', function() {
                        var file, reader;
                        file = el.files[0];
                        reader = new FileReader();
                        reader.onload = function(e) {
                            var _ref;
                            return (_ref = _this.instance) != null ? _ref[name] = e.target.result :
                                void 0;
                        };
                        return reader.readAsDataURL(file);
                    });
                } else if ((el.getAttribute('name') === 'color') || (el.getAttribute('data-type') ===
                        'color')) {
                    el.addEventListener('input', function(e) {
                        var _ref;
                        if (e.colorPicker) {
                            if ((_ref = _this.instance) != null) {
                                _ref[name] = el.val;
                            }
                            return AbstractController.setStyle(el);
                        } else {
                            return _this.publish('setColor', el.val);
                        }
                    });
                } else {
                    el.addEventListener('input', function(e) {
                        var _ref;
                        return (_ref = _this.instance) != null ? _ref[name] = parseFloat(e.target
                            .val) : void 0;
                    });
                }
            }
            if (!isInstace) {
                id = selector.slice(1, -9).replace(/-(\w)/, function(full, match) {
                    return match.toUpperCase();
                });
                return _this.subscribe('select', function(e) {
                    _this.instance = e.target.styles[id];
                    return _this.populate();
                });
            }
        });
    }

    AbstractController.prototype.populate = function() {
        var _this = this;
        return this.inputs.forEach(function(el) {
            var name;
            name = el.getAttribute('name');
            if (_this.instance[name] !== null) {
                if (name !== 'image') {
                    el.val = _this.instance[name];
                }
                if ((el.getAttribute('name') === 'color') || (el.getAttribute('data-type') ===
                        'color')) {
                    return AbstractController.setStyle(el);
                }
            }
        });
    };

    AbstractController.setStyle = function(el) {
        var c;
        try {
            c = new Color(el.val);
            if (c.lightness < 50) {
                el.style.color = "#fff";
            } else {
                el.style.color = "#000";
            }
            el.val = c.hex.toUpperCase();
            return el.style.backgroundColor = el.val;
        } catch (_error) {}
    };

    return AbstractController;

})(Crystal.Utils.Evented);

/*
 --------------- /home/gdot/github/cssshop/source/classes/layer-manager.coffee--------------
 */


LayerManager = (function(_super) {

    __extends(LayerManager, _super);

    function LayerManager(base, layerGroup) {
        var _this = this;
        this.base = base;
        this.layerGroup = layerGroup;
        this.update = __bind(this.update, this);

        this.onAdd = __bind(this.onAdd, this);

        this.onSelect = __bind(this.onSelect, this);

        this.template = this.base.first("item[hidden]");
        this.template.first("name").firstChild.property = 'name';
        this.template.dispose();
        this.layerGroup.on('add', this.onAdd);
        this.layerGroup.on('remove', this.update);
        this.layerGroup.subscribe('select', this.onSelect);
        this.base.delegateEvent('click:.icon-eye-open', function(e) {
            e.target.context.toggle();
            e.target.classList.toggle('disabled');
            return _this.publish('action');
        });
        this.base.delegateEvent('click:.icon-lock', function(e) {
            e.target.context.toggleLock();
            e.target.classList.toggle('disabled');
            return _this.publish('action');
        });
        this.base.delegateEvent('click:.icon-asterisk', function(e) {
            e.target.context.toggleSelector();
            e.target.classList.toggle('disabled');
            return _this.publish('action');
        });
        this.base.delegateEvent('click:item', function(e) {
            return e.target.context.select();
        });
        this.base.delegateEvent('dblclick:item', function(e) {
            var context;
            context = e.target.context;
            return _this.layerGroup.publish('text', 'Layer Name', context.name, function(value) {
                if (value) {
                    if (context.name !== value) {
                        context.name = value;
                        return _this.publish('action');
                    }
                }
            });
        });
        this.base.delegateEvent('click:[name=duplicate_layer]', function() {
            var layer, obj;
            obj = _this.selected.toObj();
            layer = _this.layerGroup.addNewLayer();
            return layer.fromObj(obj);
        });
        this.base.delegateEvent('click:[name=add_layer]', function() {
            var layer;
            layer = _this.layerGroup.addNewLayer();
            return layer.center();
        });
        this.base.delegateEvent('click:[name=remove_layer]', function() {
            return _this.layerGroup.removeLayer(_this.selected);
        });
        this.base.delegateEvent('click:[name=move_layer_up]', function() {
            var item;
            if (_this.layerGroup.moveLayerUp(_this.selected)) {
                item = _this.getItem(_this.selected);
                item.moveUp();
                return _this.selected.el.moveDown();
            }
        });
        this.base.delegateEvent('click:[name=move_layer_down]', function() {
            var item;
            if (_this.layerGroup.moveLayerDown(_this.selected)) {
                item = _this.getItem(_this.selected);
                item.moveDown();
                return _this.selected.el.moveUp();
            }
        });
    }

    LayerManager.prototype.getItem = function(layer) {
        return this.base.first("[uid='" + layer.uid + "']");
    };

    LayerManager.prototype.cloneTemplate = function(layer) {
        var item;
        item = cloneNodes(this.template);
        item.context = layer;
        item.render();
        item.layer = layer;
        item.setAttribute('uid', layer.uid);
        item.removeAttribute('hidden');
        layer.on('destroy', function() {
            return item.dispose();
        });
        if (layer.display === 'none') {
            item.first('.icon-eye-open').classList.add('disabled');
        }
        if (layer.locked) {
            item.first('.icon-lock').classList.remove('disabled');
        }
        return item;
    };

    LayerManager.prototype.onSelect = function(e) {
        var item, _i, _len, _ref;
        _ref = this.base.all('item');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            item.classList.remove('selected');
        }
        this.getItem(e.target).classList.add('selected');
        return this.selected = e.target;
    };

    LayerManager.prototype.onAdd = function(e, layer) {
        var item;
        item = this.cloneTemplate(layer);
        this.base.insertBefore(item, this.base.firstChild);
        return this.update();
    };

    LayerManager.prototype.update = function() {
        return this.base.css('height', this.base.all("item:not([hidden])").length * 35 + 30);
    };

    return LayerManager;

})(Crystal.Utils.Evented);

/*
 --------------- /home/gdot/github/cssshop/source/classes/modal.coffee--------------
 */


AlertModal = (function(_super) {

    __extends(AlertModal, _super);

    function AlertModal(el, channel) {
        var _this = this;
        this.el = el;
        this.hide = __bind(this.hide, this);

        this.show = __bind(this.show, this);

        this.ok = this.el.first('[type=button][name=ok]');
        this.close = this.el.first('[type=button][name=close]');
        this.text = document.createTextNode("");
        this.el.first('p').appendChild(this.text);
        this.ok.addEvent('click', this.hide);
        this.close.addEvent('click', function() {
            app.openBuyLink();
            return _this.hide();
        });
    }

    AlertModal.prototype.show = function(text) {
        this.text.textContent = text;
        document.first("overlay").classList.remove('hidden');
        return this.el.style.webkitTransform = 'translateY(0px)';
    };

    AlertModal.prototype.hide = function() {
        document.first("overlay").classList.add('hidden');
        return this.el.style.webkitTransform = 'translateY(-2080px)';
    };

    return AlertModal;

})(Crystal.Utils.Evented);

Modal = (function(_super) {

    __extends(Modal, _super);

    function Modal(el, channel) {
        var _this = this;
        this.el = el;
        this.hide = __bind(this.hide, this);

        this.show = __bind(this.show, this);

        this.input = this.el.first('[name=input]');
        this.ok = this.el.first('[type=button][name=ok]');
        this.close = this.el.first('[type=button][name=close]');
        this.text = document.createTextNode("");
        this.el.first('text').appendChild(this.text);
        this.subscribe(channel, this.show);
        if (this.input.tag === 'input') {
            this.input.addEvent('keydown', function(e) {
                if (e.key === 'enter') {
                    if (typeof _this.callback === "function") {
                        _this.callback(_this.input.value);
                    }
                    return _this.hide();
                }
            });
        }
        this.ok.addEvent('click', function() {
            if (typeof _this.callback === "function") {
                _this.callback(_this.input.value);
            }
            return _this.hide();
        });
        this.close.addEvent('click', this.hide);
    }

    Modal.prototype.show = function(e, prompt, value, callback) {
        this.callback = callback;
        this.text.textContent = prompt;
        this.el.style.webkitTransform = 'translateY(0px)';
        this.input.value = value;
        return this.input.focus();
    };

    Modal.prototype.hide = function() {
        return this.el.style.webkitTransform = 'translateY(-2080px)';
    };

    return Modal;

})(Crystal.Utils.Evented);

PublishModal = (function(_super) {

    __extends(PublishModal, _super);

    function PublishModal(el, channel) {
        var _this = this;
        this.el = el;
        this.hide = __bind(this.hide, this);

        this.show = __bind(this.show, this);

        this.title = this.el.first('[name=title]');
        this.description = this.el.first('[name=description]');
        this.ok = this.el.first('[type=button][name=ok]');
        this.close = this.el.first('[type=button][name=close]');
        this.text = document.createTextNode("");
        this.el.first('text').appendChild(this.text);
        this.subscribe(channel, this.show);
        if (this.title.tag === 'input') {
            this.title.addEvent('keydown', function(e) {
                if (e.key === 'enter') {
                    return _this.description.focus();
                }
            });
        }
        if (this.description.tag === 'input') {
            this.description.addEvent('keydown', function(e) {
                if (e.key === 'enter') {
                    if (typeof _this.callback === "function") {
                        _this.callback(_this.title.value, _this.description.value);
                    }
                    return _this.hide();
                }
            });
        }
        this.ok.addEvent('click', function() {
            if (typeof _this.callback === "function") {
                _this.callback(_this.title.value, _this.description.value);
            }
            return _this.hide();
        });
        this.close.addEvent('click', this.hide);
    }

    PublishModal.prototype.show = function(e, prompt, callback) {
        this.callback = callback;
        this.text.textContent = prompt;
        this.el.style.webkitTransform = 'translateY(0px)';
        this.title.value = '';
        this.title.focus();
        return this.description.value = '';
    };

    PublishModal.prototype.hide = function() {
        return this.el.style.webkitTransform = 'translateY(-2080px)';
    };

    return PublishModal;

})(Crystal.Utils.Evented);

/*
 --------------- /home/gdot/github/cssshop/source/classes/code.coffee--------------
 */


Code = (function(_super) {

    __extends(Code, _super);

    function Code(el) {
        var _this = this;
        this.el = el;
        this.code = this.el.first('code');
        this.el.first('handle').addEvent('click', function() {
            return _this.el.classList.toggle('closed');
        });
        this.el.first('.icon-paste').addEvent('click', function(e) {
            e.stopPropagation();
            return _this.publish('copyToClipboard', _this.code.html);
        });
        this.subscribe('select', function(e) {
            _this.layer = e.target;
            return _this.render();
        });
        this.subscribe('action', function(e) {
            return _this.render();
        });
    }

    Code.prototype.render = function() {
        if (this.layer) {
            return this.code.html = this.layer.toCSS();
        }
    };

    return Code;

})(Crystal.Utils.Evented);

/*
 --------------- /home/gdot/github/cssshop/source/filters/text-stroke.coffee--------------
 */


Filters.TextStroke = TextStroke = (function(_super) {

    __extends(TextStroke, _super);

    function TextStroke() {
        return TextStroke.__super__.constructor.apply(this, arguments);
    }

    TextStroke.prototype.init = function(obj) {
        if (obj == null) {
            obj = {
                width: 0,
                color: "000000"
            };
        }
        return TextStroke.__super__.init.call(this, obj);
    };

    TextStroke.prototype.toCSS = function() {
        if (this.width !== this._default_width || this.color !== this._default_color) {
            return "-webkit-text-stroke: " + this.width + "px #" + this.color + ";\n";
        } else {
            return '';
        }
    };

    return TextStroke;

})(Filter);

TextStroke.addProperty('value', function(value) {
    return this.el.style.webkitTextStroke = value;
}, false);

TextStroke.addProperties(['width', 'color'], function() {
    return this.value = "" + this.width + "px " + this.color;
});

/*
 --------------- /home/gdot/github/cssshop/source/filters/text.coffee--------------
 */


Filters.TextFilter = TextFilter = (function(_super) {

    __extends(TextFilter, _super);

    function TextFilter() {
        return TextFilter.__super__.constructor.apply(this, arguments);
    }

    TextFilter.prototype.init = function(obj) {
        if (obj == null) {
            obj = {
                font: 'Arial',
                weight: 'normal',
                size: 12,
                align: "left",
                x: 0,
                y: 0,
                color: "333333",
                style: 'normal',
                decoration: 'none',
                'line-height': 20,
                'transform': 'none'
            };
        }
        return TextFilter.__super__.init.call(this, obj);
    };

    TextFilter.prototype.toCSS = function() {
        var item, name, r, style, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3;
        r = '';
        if (this.color !== this._default_color) {
            r += "color: #" + this.color + ";\n";
        }
        _ref = ['font:font-family', 'weight:font-weight', 'align:text-align', 'transform:text-transform'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            _ref1 = item.split(":"), name = _ref1[0], style = _ref1[1];
            if (this[name] !== this['_default_' + name]) {
                r += "" + style + ": " + this[name] + ";\n";
            }
        }
        _ref2 = ['size:font-size', 'x:padding-left', 'y:padding-top', 'line-height:line-height'];
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            item = _ref2[_j];
            _ref3 = item.split(":"), name = _ref3[0], style = _ref3[1];
            if (this[name] !== this['_default_' + name]) {
                r += "" + style + ": " + this[name] + "px;\n";
            }
        }
        return r;
    };

    return TextFilter;

})(Filter);

['font:fontFamily', 'weight:fontWeight', 'style:fontStyle', 'decoration:textDecoration', 'align:textAlign',
    'color:color', 'transform:text-transform'
].forEach(function(item) {
    var prop, style, _ref;
    _ref = item.split(/:/), prop = _ref[0], style = _ref[1];
    return TextFilter.addProperty(prop, function(value) {
        return this.el.style[style] = value;
    });
});

['size:fontSize', 'x:paddingLeft', 'y:paddingTop', 'line-height:line-height'].forEach(function(item) {
    var prop, style, _ref;
    _ref = item.split(/:/), prop = _ref[0], style = _ref[1];
    return TextFilter.addProperty(prop, function(value) {
        return this.el.style[style] = value + "px";
    });
});

/*
 --------------- /home/gdot/github/cssshop/source/filters/border.coffee--------------
 */


Filters.Border = Border = (function(_super) {

    __extends(Border, _super);

    function Border() {
        return Border.__super__.constructor.apply(this, arguments);
    }

    Border.prototype.init = function(obj) {
        var _this = this;
        if (obj == null) {
            obj = {
                width: 0,
                color: '000000',
                style: 'solid'
            };
        }
        Border.__super__.init.call(this, obj);
        return ['color', 'width', 'style'].forEach(function(type) {
            return ['top', 'bottom', 'left', 'right'].forEach(function(x) {
                return _this["_default_" + x + "-" + type] = _this[type];
            });
        });
    };

    Border.prototype.allTheSame = function() {
        var type, x, _i, _j, _len, _len1, _ref, _ref1;
        _ref = ['color', 'width', 'style'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            type = _ref[_i];
            _ref1 = ['top', 'bottom', 'left', 'right'];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                x = _ref1[_j];
                if (this["" + x + "-" + type] !== this[type]) {
                    return false;
                }
            }
        }
        return true;
    };

    Border.prototype.toCSS = function() {
        var r, x, _i, _len, _ref;
        r = '';
        if (this.allTheSame()) {
            if (this.style !== this._default_style || this.width !== this._default_width || this.color !==
                this._default_color) {
                r += "border: " + this.width + "px " + this.style + " #" + this.color + ";\n";
            }
        } else {
            _ref = ['top', 'bottom', 'left', 'right'];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                x = _ref[_i];
                if (this[x + '-style'] !== this['_default_' + x + '-style'] || this[x + '-width'] !== this[
                        '_default_' + x + '-width'] || this[x + '-color'] !== this['_default_' + x +
                        '-color']) {
                    r += "border-" + x + ": " + this[x + '-width'] + "px " + this[x + '-style'] + " #" +
                        this[x + '-color'] + ";\n";
                }
            }
        }
        return r;
    };

    return Border;

})(Filter);

['color', 'width', 'style'].forEach(function(type) {
    return Border.addProperty(type, function(value) {
        var _this = this;
        return ['top', 'bottom', 'left', 'right'].forEach(function(x) {
            return _this["" + x + "-" + type] = value;
        });
    });
});

['Top', 'Bottom', 'Left', 'Right'].forEach(function(x) {
    var lx;
    lx = x.toLowerCase();
    Border.addProperty(lx + "-width", function(value) {
        if (this.el) {
            return this.el.style["border" + x + "Width"] = value + "px";
        }
    });
    Border.addProperty(lx + "-color", function(value) {
        if (this.el) {
            return this.el.style["border" + x + "Color"] = value;
        }
    });
    return Border.addProperty(lx + "-style", function(value) {
        if (this.el) {
            return this.el.style["border" + x + "Style"] = value;
        }
    });
});

/*
 --------------- /home/gdot/github/cssshop/source/filters/text-shadow.coffee--------------
 */


Filters.TextShadow = TextShadow = (function(_super) {

    __extends(TextShadow, _super);

    function TextShadow() {
        return TextShadow.__super__.constructor.apply(this, arguments);
    }

    TextShadow.prototype.init = function(obj) {
        if (obj == null) {
            obj = {
                x: 0,
                y: 0,
                blur: 0,
                color: "000000"
            };
        }
        TextShadow.__super__.init.call(this, obj);
        return this._default_value = this.value;
    };

    return TextShadow;

})(Filter);

TextShadow.addProperty('value', null, false);

TextShadow.addProperties(['x', 'y', 'blur', 'color'], function() {
    return this.value = "" + this.x + "px " + this.y + "px " + this.blur + "px #" + this.color;
});

/*
 --------------- /home/gdot/github/cssshop/source/filters/text-bevel.coffee--------------
 */


Filters.TextBevel = TextBevel = (function(_super) {

    __extends(TextBevel, _super);

    function TextBevel() {
        return TextBevel.__super__.constructor.apply(this, arguments);
    }

    TextBevel.prototype.init = function(obj) {
        if (obj == null) {
            obj = {
                height: 0,
                blur: 0,
                highlight: "FFFFFF",
                shadow: "000000"
            };
        }
        TextBevel.__super__.init.call(this, obj);
        return this._default_value = this.value;
    };

    return TextBevel;

})(Filter);

TextBevel.addProperty('value', null, false);

TextBevel.addProperties(['height', 'blur', 'highlight', 'shadow'], function() {
    return this.value = "0px -" + this.height + "px " + this.blur + "px #" + this.highlight + ", 0px " + this.height +
        "px " + this.blur + "px #" + this.shadow;
});

/*
 --------------- /home/gdot/github/cssshop/source/filters/inner-shadow.coffee--------------
 */


Filters.InnerShadow = InnerShadow = (function(_super) {

    __extends(InnerShadow, _super);

    function InnerShadow() {
        return InnerShadow.__super__.constructor.apply(this, arguments);
    }

    InnerShadow.prototype.init = function(obj) {
        if (obj == null) {
            obj = {
                x: 0,
                y: 0,
                blur: 0,
                color: "000000",
                spread: 0
            };
        }
        InnerShadow.__super__.init.call(this, obj);
        return this._default_value = this.value;
    };

    return InnerShadow;

})(Filter);

InnerShadow.addProperty('value', null, false);

InnerShadow.addProperties(['x', 'y', 'blur', 'color', 'spread'], function() {
    return this.value = "" + this.x + "px " + this.y + "px " + this.blur + "px " + this.spread + "px #" + this.color +
        " inset";
});

/*
 --------------- /home/gdot/github/cssshop/source/filters/background.coffee--------------
 */


emptyPNG =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAsAAAAGMAQMAAADuk4YmAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAADlJREFUeF7twDEBAAAAwiD7p7bGDlgYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAGJrAABgPqdWQAAAABJRU5ErkJggg==';

Filters.Background = Background = (function(_super) {

    __extends(Background, _super);

    function Background() {
        return Background.__super__.constructor.apply(this, arguments);
    }

    Background.prototype.init = function(obj) {
        if (obj == null) {
            obj = {
                'bottom-color': "DDDDDD",
                'top-color': "DDDDDD",
                fill: 100,
                'position-x': 0,
                'position-y': 0,
                image: emptyPNG,
                repeat: 'repeat',
                size: 'contain'
            };
        }
        return Background.__super__.init.call(this, obj);
    };

    Background.prototype.toSass = function() {
        var bc, bottomColor, image, item, r, tc, topColor, _i, _j, _len, _len1, _ref, _ref1;
        r = [];
        if (this.image !== emptyPNG) {
            image = "url(" + this.image + ")";
        }
        tc = new Color(this['top-color']);
        tc.alpha = this.fill;
        bc = new Color(this['bottom-color']);
        bc.alpha = this.fill;
        topColor = tc.toString('rgba');
        bottomColor = bc.toString('rgba');
        if (topColor === bottomColor) {
            r += "background-color: #" + tc.hex + "\n";
        } else {
            if (image) {
                r += "+gradient(" + topColor + ", " + bottomColor + ", " + image + ")\n";
            } else {
                r += "+gradient(" + topColor + ", " + bottomColor + ")\n";
            }
        }
        r += "+background-size(100%)\n";
        _ref = ['position-y', 'position-x'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            if (this[item] !== this['_default_' + item]) {
                if (image) {
                    r += "background-" + item + ": " + this[item] + "px, 0\n";
                }
            }
        }
        _ref1 = ['repeat', 'size'];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            item = _ref1[_j];
            if (this[item] !== this['_default_' + item]) {
                r += "background-" + item + ": " + this[item] + "\n";
            }
        }
        return r;
    };

    Background.prototype.toCSS = function() {
        var bc, bottomColor, gradient, gradients, image, item, prefix, r, tc, topColor, _i, _j, _k, _l,
            _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
        r = [];
        if (this.image !== emptyPNG) {
            image = "url(" + this.image + ")";
        }
        tc = new Color(this['top-color']);
        tc.alpha = this.fill;
        bc = new Color(this['bottom-color']);
        bc.alpha = this.fill;
        topColor = tc.toString('rgba');
        bottomColor = bc.toString('rgba');
        gradients = [];
        gradients.push("-moz-linear-gradient(top,  " + topColor + " 0%, " + bottomColor + " 100%)");
        gradients.push("-webkit-gradient(linear, left top, left bottom, color-stop(0%," + topColor +
            "), color-stop(100%," + bottomColor + "))");
        gradients.push("-webkit-linear-gradient(top,  " + topColor + " 0%," + bottomColor + " 100%)");
        gradients.push("-o-linear-gradient(top,  " + topColor + " 0%," + bottomColor + " 100%)");
        gradients.push("-ms-linear-gradient(top,  " + topColor + " 0%," + bottomColor + " 100%)");
        gradients.push("linear-gradient(to bottom,  " + topColor + " 0%," + bottomColor + " 100%)");
        gradients.push("filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#" + tc.hex +
            "', endColorstr='#" + bc.hex + "',GradientType=0 )");
        if (topColor === bottomColor) {
            if (tc.alpha === 100) {
                r += "background-color: #" + tc.hex + ";\n";
            } else {
                r += "background-color: " + (tc.toString('rgba')) + ";\n";
            }
        } else {
            _ref = gradients.slice(0, -1);
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                gradient = _ref[_i];
                if (image) {
                    r += "background-image: " + image + ", " + gradient + ";\n";
                } else {
                    r += "background-image: " + gradient + ";\n";
                }
            }
            r += gradients.pop() + ";\n";
        }
        _ref1 = ['position-y', 'position-x'];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            item = _ref1[_j];
            if (this[item] !== this['_default_' + item]) {
                if (image) {
                    r += "background-" + item + ": " + this[item] + "px, 0;\n";
                }
            }
        }
        _ref2 = ['repeat'];
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            item = _ref2[_k];
            if (this[item] !== this['_default_' + item]) {
                r += "background-" + item + ": " + this[item] + ";\n";
            }
        }
        if (this.size !== this._default_size) {
            r += "background-size: " + this['size'] + ";\n";
            _ref3 = ['webkit', 'moz', 'ms', 'o'];
            for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
                prefix = _ref3[_l];
                r += "-" + prefix + "-background-size: " + this['size'] + ";\n";
            }
        }
        return r;
    };

    return Background;

})(Filter);

['position-x:PositionX', 'position-y:PositionY'].forEach(function(item) {
    var prop, style, _ref;
    _ref = item.split(/:/), prop = _ref[0], style = _ref[1];
    return Background.addProperty(prop, function(value) {
        return this.el.style["background" + style] = parseInt(value) + "px, 0";
    });
});

['top-color', 'bottom-color', 'fill', 'image'].forEach(function(prop) {
    return Background.addProperty(prop, function(value) {
        var bc, bottomColor, gradient, tc, topColor;
        try {
            tc = new Color(this['top-color']);
            tc.alpha = this.fill;
            bc = new Color(this['bottom-color']);
            bc.alpha = this.fill;
            topColor = tc.toString('rgba');
            bottomColor = bc.toString('rgba');
            gradient = "-webkit-linear-gradient(top, " + topColor + " 0%, " + bottomColor + " 100%)";
            return this.el.style.backgroundImage = "url(" + this.image + "), " + gradient;
        } catch (_error) {}
    });
});

['repeat', 'size'].forEach(function(prop) {
    return Background.addProperty(prop, function(value) {
        return this.el.style["background" + prop.capitalize()] = value;
    });
});

/*
 --------------- /home/gdot/github/cssshop/source/filters/outer-shadow.coffee--------------
 */


Filters.OuterShadow = OuterShadow = (function(_super) {

    __extends(OuterShadow, _super);

    function OuterShadow() {
        return OuterShadow.__super__.constructor.apply(this, arguments);
    }

    OuterShadow.prototype.init = function(obj) {
        if (obj == null) {
            obj = {
                x: 0,
                y: 0,
                blur: 0,
                color: "000000",
                spread: 0
            };
        }
        OuterShadow.__super__.init.call(this, obj);
        return this._default_value = this.value;
    };

    return OuterShadow;

})(Filter);

OuterShadow.addProperty('value', null, false);

OuterShadow.addProperties(['x', 'y', 'blur', 'color', 'spread'], function() {
    return this.value = "" + this.x + "px " + this.y + "px " + this.blur + "px " + this.spread + "px #" + this.color;
});

/*
 --------------- /home/gdot/github/cssshop/source/filters/filter.coffee--------------
 */


Filters.Filter = FFilter = (function(_super) {

    __extends(FFilter, _super);

    function FFilter() {
        return FFilter.__super__.constructor.apply(this, arguments);
    }

    FFilter.prototype.init = function(obj) {
        if (obj == null) {
            obj = {
                blur: 0,
                grayscale: 0,
                sepia: 0,
                saturate: 1,
                huerotate: 0,
                brightness: 1,
                contrast: 1,
                invert: 0,
                opacity: 1
            };
        }
        FFilter.__super__.init.call(this, obj);
        return this._default_value = this.value;
    };

    FFilter.prototype.toSass = function() {
        var ret;
        if (this._default_value !== this.value) {
            return ret = "+filter(" + this.value + ")\n";
        } else {
            return '';
        }
    };

    FFilter.prototype.toCSS = function() {
        var ret,
            _this = this;
        if (this._default_value !== this.value) {
            ret = "filter: " + this.value + ";\n";
            return ret += ['webkit', 'moz', 'ms', 'o'].map(function(prefix) {
                return "-" + prefix + "-transform: " + _this.value + ";\n";
            }).join("");
        } else {
            return '';
        }
    };

    return FFilter;

})(Filter);

FFilter.addProperty('value', function(value) {
    return this.el.style.webkitFilter = value;
}, false);

['blur', 'grayscale', 'sepia', 'saturate', 'huerotate', 'brightness', 'contrast', 'invert', 'opacity'].forEach(function(
    type) {
    return FFilter.addProperty(type, function(value) {
        value = "grayscale(" + this.grayscale + ") sepia(" + this.sepia + ") saturate(" + this.saturate +
            ") hue-rotate(" + this.huerotate + "deg) brightness(" + this.brightness + ") contrast(" +
            this.contrast + ") invert(" + this.invert + ") opacity(" + this.opacity + ")";
        if (this.blur !== 0) {
            value += "blur(" + this.blur + "px)";
        }
        return this.value = value;
    });
});

/*
 --------------- /home/gdot/github/cssshop/source/filters/bevel.coffee--------------
 */


Filters.Bevel = Bevel = (function(_super) {

    __extends(Bevel, _super);

    function Bevel() {
        return Bevel.__super__.constructor.apply(this, arguments);
    }

    Bevel.prototype.init = function(obj) {
        if (obj == null) {
            obj = {
                height: 0,
                blur: 0,
                highlight: "FFFFFF",
                shadow: "000000"
            };
        }
        Bevel.__super__.init.call(this, obj);
        return this._default_value = this.value;
    };

    return Bevel;

})(Filter);

Bevel.addProperty('value', null, false);

Bevel.addProperties(['height', 'blur', 'highlight', 'shadow'], function() {
    return this.value = "0px " + this.height + "px " + this.blur + "px #" + this.highlight + " inset, 0px -" +
        this.height + "px " + this.blur + "px #" + this.shadow + " inset";
});

/*
 --------------- /home/gdot/github/cssshop/source/filters/border-radius.coffee--------------
 */


Filters.BorderRadius = BorderRadius = (function(_super) {

    __extends(BorderRadius, _super);

    function BorderRadius() {
        return BorderRadius.__super__.constructor.apply(this, arguments);
    }

    BorderRadius.prototype.init = function(obj) {
        var _this = this;
        if (obj == null) {
            obj = {
                radius: 0
            };
        }
        BorderRadius.__super__.init.call(this, obj);
        return ['top', 'bottom'].forEach(function(x) {
            return ['left', 'right'].forEach(function(y) {
                return _this['_default_' + x + '-' + y + '-radius'] = _this.radius;
            });
        });
    };

    BorderRadius.prototype.allTheSame = function() {
        var ret,
            _this = this;
        ret = true;
        ['top', 'bottom'].forEach(function(x) {
            return ['left', 'right'].forEach(function(y) {
                if (_this[x + '-' + y + '-radius'] !== _this.radius) {
                    return ret = false;
                }
            });
        });
        return ret;
    };

    BorderRadius.prototype.toSass = function() {
        var r;
        r = '';
        if (this.allTheSame() && this.radius !== this._default_radius) {
            r += "+border-radius(" + this.radius + "px)\n";
        } else {
            r += "+border-radius(" + this['top-left-radius'] + "px " + this['top-right-radius'] + "px " +
                this['bottom-right-radius'] + "px " + this['bottom-left-radius'] + "px)\n";
        }
        return r;
    };

    BorderRadius.prototype.toCSS = function() {
        var base, prefix, r, _i, _j, _len, _len1, _ref, _ref1;
        r = '';
        if (this.allTheSame() && this.radius === this._default_radius) {
            return r;
        }
        if (this.allTheSame() && this.radius !== this._default_radius) {
            r += "border-radius: " + this.radius + "px;\n";
            _ref = ['webkit', 'moz', 'ms', 'o'];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                prefix = _ref[_i];
                r += "-" + prefix + "-border-radius: " + this.radius + "px;\n";
            }
        } else {
            base = "" + this['top-left-radius'] + "px " + this['top-right-radius'] + "px " + this[
                'bottom-right-radius'] + "px " + this['bottom-left-radius'] + "px";
            r += "border-radius: " + base + ";\n";
            _ref1 = ['webkit', 'moz', 'ms', 'o'];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                prefix = _ref1[_j];
                r += "-" + prefix + "-border-radius: " + base + ";\n";
            }
        }
        return r;
    };

    return BorderRadius;

})(Filter);

BorderRadius.addProperty('radius', function(value) {
    var _this = this;
    return ['top', 'bottom'].forEach(function(x) {
        return ['left', 'right'].forEach(function(y) {
            return _this[x + '-' + y + '-radius'] = value;
        });
    });
});

['top', 'bottom'].forEach(function(x) {
    return ['left', 'right'].forEach(function(y) {
        return BorderRadius.addProperty(x + '-' + y + '-radius', function(value) {
            if (this.el) {
                return this.el.style["border" + (x.capitalize()) + (y.capitalize()) + "Radius"] =
                    value + "px";
            }
        });
    });
});

/*
 --------------- /home/gdot/github/cssshop/source/filters/transform.coffee--------------
 */


Filters.Transform = Transform = (function(_super) {

    __extends(Transform, _super);

    function Transform() {
        return Transform.__super__.constructor.apply(this, arguments);
    }

    Transform.prototype.init = function(obj) {
        if (obj == null) {
            obj = {
                rotation: 0,
                scalex: 1,
                scaley: 1,
                skewx: 0,
                skewy: 0
            };
        }
        Transform.__super__.init.call(this, obj);
        return this._default_value = this.value;
    };

    Transform.prototype.toSass = function() {
        var ret;
        if (this._default_value !== this.value) {
            return ret = "+transform(" + this.value + ")\n";
        } else {
            return '';
        }
    };

    Transform.prototype.toCSS = function() {
        var ret,
            _this = this;
        if (this._default_value !== this.value) {
            ret = "transform: " + this.value + ";\n";
            return ret += ['webkit', 'moz', 'ms', 'o'].map(function(prefix) {
                return "-" + prefix + "-transform: " + _this.value + ";\n";
            }).join("");
        } else {
            return '';
        }
    };

    return Transform;

})(Filter);

Transform.addProperty('value', function(value) {
    return this.el.style.webkitTransform = value;
}, false);

['rotation', 'scalex', 'scaley', 'skewy', 'skewx'].forEach(function(type) {
    return Transform.addProperty(type, function(value) {
        this.publish('setRect');
        return this.value = "rotate(" + this.rotation + "deg) scaleX(" + this.scalex + ") scaleY(" +
            this.scaley + ") skewX(" + this.skewx + "deg) skewY(" + this.skewy + "deg)";
    });
});

/*
 --------------- /home/gdot/github/cssshop/source/filters/basic.coffee--------------
 */


Filters.Basic = Basic = (function(_super) {

    __extends(Basic, _super);

    function Basic() {
        return Basic.__super__.constructor.apply(this, arguments);
    }

    Basic.prototype.init = function(obj) {
        if (obj == null) {
            obj = {
                height: 200,
                width: 200,
                x: 0,
                y: 0,
                opacity: 1
            };
        }
        return Basic.__super__.init.call(this, obj);
    };

    Basic.prototype.toCSS = function(position) {
        var item, name, props, r, type, _i, _len, _ref;
        r = '';
        props = ['width:px', 'height:px', 'opacity'];
        if (position) {
            r += "position: absolute;\n";
            r += "top: " + this.y + "px;\n";
            r += "left: " + this.x + "px;\n";
        }
        for (_i = 0, _len = props.length; _i < _len; _i++) {
            item = props[_i];
            _ref = item.split(":"), name = _ref[0], type = _ref[1];
            if (type == null) {
                type = "";
            }
            r += "" + name + ": " + this[name] + type + ";\n";
        }
        return r;
    };

    return Basic;

})(Filter);

['x:left', 'y:top', 'width:width', 'height:height'].forEach(function(item) {
    var prop, style, _ref;
    _ref = item.split(/:/), prop = _ref[0], style = _ref[1];
    return Basic.addProperty(prop, function(value) {
        this.el.style[style] = parseInt(value);
        return this.publish('setRect');
    });
});

['opacity'].forEach(function(prop) {
    return Basic.addProperty(prop, function(value) {
        return this.el.style[prop] = value;
    });
});

/*
 --------------- /home/gdot/github/cssshop/source/index.coffee--------------
 */


ENDPOINT = ENV === 'production' ? 'romanysoft.github.io/CSSDesigner' : 'localhost:9292';

window.app = Application["new"](function() {
    this.set('logger', ConsoleLogger);
    this.def('setBoundingRect', function(layer) {
        var bc, key, value, _ref;
        if (layer) {
            if ((_ref = this.rect) == null) {
                this.rect = Element.create("#rect");
            }
            document.body.append(this.rect);
            bc = layer.el.getBoundingClientRect();
            for (key in bc) {
                value = bc[key];
                if (key === 'top') {
                    value += window.scrollY;
                }
                if (key === 'left' || key === 'top') {
                    value -= 1;
                }
                this.rect.css(key, value + "px");
            }
            if (document.first("layergroup")) {
                return this.rect.css('border-color', "#" + new Color(document.first("layergroup").css(
                    'background-color')).invert().hex);
            }
        }
    });
    this.def('onImportFileCallbackFunc', function(info) {
        var _this = this;
        if (info.success) {
            if (info.filesCount > 0) {

                var fileObj = info.filesArray[0];
                var filePath = fileObj.filePath;
                info["path"] = filePath;
                _this.fileManager.current = info;

                _this.fileManager.b$.Binary.getUTF8TextContentFromFile({
                    filePath: filePath
                }, function(obj) {
                    if (obj) {
                        if (obj.success) {
                            if (obj.content.length > 1) {
                                _this.setTitle(true);
                                _this.document.fromObj(JSON.parse(obj.content));
                            }
                        } else {
                            alert(obj.error);
                        }
                    }
                });

            }
        }

    });
    this.def('onSaveFileCallbackFunc', function(info) {
        var _this = this;
        if (info.success) {
            var filePath = info.filePath;
            var content = _this.document.toObj();
            info["path"] = filePath;
            _this.fileManager.current = info;


            _this.fileManager.b$.Binary.createTextFile({
                filePath: filePath,
                text: JSON.stringify(content)
            }, function(obj) {
                if (obj) {
                    try {
                        if (obj.success) {
                            _this.setTitle(true);
                        } else {
                            alert(obj.error);
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            });
        }
    });
    this.def('openPublish', function() {
        var _this = this;
        return this.publish('publish', 'publish', function(title, description) {
            var data, r;
            if (title !== "" && description !== "") {
                r = new Request("http://" + ENDPOINT + "/publish");
                data = {
                    html: _this.document.toHTML(),
                    css: _this.document.toCSS(),
                    title: title,
                    description: description
                };
                return r.post(data, function(resp) {
                    return _this.openLink(res.body);
                });
            }
        });
    });
    this.def('copyToClipboard', function(text) {
        var _ref, _ref1;
        if (this.gui) {
            if ((_ref = this.clipboardNW) == null) {
                this.clipboardNW = this.gui.Clipboard.get();
            }
            return this.clipboardNW.set(text, 'text');
        } else if (this.fileManager.b$) {
            this.fileManager.b$.Clipboard.copy(text);

        } else {
            if ((_ref1 = this.clipboardTextarea) == null) {
                this.clipboardTextarea = document.createElement('textarea');
            }
            this.clipboardTextarea.value = text;
            document.body.appendChild(this.clipboardTextarea);
            this.clipboardTextarea.select();
            document.execCommand('copy');
            return document.body.removeChild(this.clipboardTextarea);
        }
    });
    this.def('openLink', function(href) {
        var _base;
        if (PLATFORM === Platforms.NODE_WEBKIT) {
            return require('nw.gui').Shell.openExternal(href);
        } else {
            if (!this.anchor) {
                this.anchor = Element.create('a');
                this.anchor.setAttribute('target', '_blank');
            }
            this.anchor.setAttribute('href', href);
            return typeof(_base = this.anchor).click === "function" ? _base.click() : void 0;
        }
    });
    this.def('initalizeControllers', function() {
        var key, name, value;
        for (key in Filters) {
            value = Filters[key];
            name = key.replace(/[A-Z]/g, function(match, index) {
                var ret;
                ret = index ? "-" : "";
                return ret += match.toLowerCase();
            });
            new AbstractController("." + name + "-controls", value.prototype);
        }
        return new AbstractController("[name=settings]", this.document, true);
    });
    this.def('handleColorPicker', function(e) {
        if (e.target.webkitMatchesSelector("[name=color], [data-type=color]")) {
            return this.colorPicker.show(e.target);
        } else {
            if (!e.target.webkitMatchesSelector("picker, picker *")) {
                return this.colorPicker.hide();
            }
        }
    });
    this.def('updateDocumentControls', function() {
        document.first('[name=settings] [name=height]').val = this.document.height;
        document.first('[name=settings] [name=width]').val = this.document.width;
        return document.first('[name=settings] [name=color]').value = this.document.color;
    });
    this.def({
        'toggleFullscreen': function() {
            if (this.window) {
                if (this.isFullscreen) {
                    this.window.leaveFullscreen();
                    return this.isFullscreen = false;
                } else {
                    this.isFullscreen = true;
                    if (this.window) {
                        return this.window.enterFullscreen();
                    }
                }
            }
        }
    });
    this.def({
        'show': function() {
            var _this = this;
            document.first('app').css('opacity', 1);
            this.document.layerGroup.base.css('opacity', 1);
            return setTimeout(function() {
                return _this.document.layerGroup.base.css('webkitTransitionDuration', 0);
            }, 600);
        }
    });
    this.on('load', function() {
        var request, suffix, _ref,
            _this = this;
        this.logger.log('Loading application');
        if (PLATFORM === Platforms.NODE_WEBKIT) {
            this.gui = require('nw.gui');
            this.window = this.gui.Window.get();
            this.isFullscreen = false;
            this.lm = {
                isValid: true
            }; //new LicenceManager(document.first('.license'), 'license.lic');
        } else {
            //document.first(".icon-shopping-cart").setAttribute('tooltip', 'Buy!');
        }
        if (ENV === 'production') {
            suffix = "";
            if (PLATFORM === Platforms.NODE_WEBKIT) {
                suffix = "?desktop=true";
            }
        }
        this.document = new CSSDocument;
        this.fileDropper = new FileDrop;
        this.colorPicker = new ColorPicker();
        this.layerManager = new LayerManager(document.first("[name=layers] .controls"), this.document.layerGroup);
        this.fileManager = new FileManager(this.document);
        this.fileManager.on('change', function() {
            return _this.setTitle();
        });
        this.document.on('change:color', function() {
            return _this.setBoundingRect(_this.selected);
        });
        this.code = new Code(document.first('bottom'));
        this.textModal = new Modal(document.first("modal#text"), 'text');
        this.textareaModal = new Modal(document.first("modal#textarea"), 'textarea');
        this.publishModal = new PublishModal(document.first("modal#publish"), 'publish');
        this.alertModal = new AlertModal(document.first("modal#alert"));
        this.initalizeControllers();
        this.document.reset();
        this.dragger = new Dragger(this.document.layerGroup);
        this.history = new AppHistory(this.document);
        this.history.publish('action');
        this.def('openBuyLink', function() {
            return;
        });
        if ((_ref = document.first('.buy')) != null) {
            _ref.addEvent('click', function() {
                return _this.openBuyLink();
            });
        }
        document.body.all('input[type=range]').forEach(function(el) {
            return new RangeInput(el);
        });
        document.body.append(this.document.layerGroup.base);
        return this.show.delay(1500, this);
    });
    this.def('setBuyBox', function() {
        var _ref, _ref1;
        if (PLATFORM === Platforms.NODE_WEBKIT) {
            if (this.lm.isValid) {
                if ((_ref = document.first("[name=buy]")) != null) {
                    _ref.dispose();
                }
                return (_ref1 = document.first("top .icon-shopping-cart")) != null ? _ref1.dispose() :
                    void 0;
            }
        }
    });
    this.def('setTitle', function(saved) {
        var suffix;
        if (saved == null) {
            saved = false;
        }
        suffix = saved == true ? "" : " *";
        if (this.fileManager.current) {
            return window.document.title = 'CSSDesigner - ' + this.fileManager.current.path + suffix;
        } else {
            return window.document.title = 'CSSDesigner ' + suffix;
        }
    });
    this.subscribe({
        'action': function() {
            this.setTitle();
            return this.setBuyBox();
        },
        'setRect': function() {
            return this.setBoundingRect(this.selected);
        },
        'copyToClipboard': function(e, text) {
            return this.copyToClipboard(text);
        },
        'setColor': function(e, color) {
            return this.colorPicker.fromColor(color);
        },
        'imageDropped': function(e, layer) {
            return this.document.layerGroup.addLayer(layer);
        },
        'select': function(e) {
            this.selected = e.target;
            this.setBoundingRect(this.selected);
            return this.logger.log('select >>> ' + e.target);
        },
        'document:update': function() {
            this.updateDocumentControls();
            this.document.center();
            return this.setBoundingRect(this.selected);
        },
        'save': function() {
            var _ref;
            this.setTitle(true);
        }
    });
    this.event({
        "mousedown": function(e) {
            return this.handleColorPicker(e);
        },
        'click:top .icon-cloud': function() {
            return this.openPublish();
        },
        'click:top .icon-file': function() {
            return this.fileManager["new"]();
        },
        'click:top .icon-folder-open': function() {
            return this.fileManager.open();
        },
        'click:top .icon-save': function() {
            return this.fileManager.save();
        },
        'click:top .icon-download-alt': function() {
            return this.fileManager["export"]();
        },
        'click:top .icon-support': function() {
            return this.openLink('https://github.com/Romanysoft/CSSDesigner/issues');
        },
        'click:top .icon-bug': function() {
            return this.openLink('https://github.com/Romanysoft/CSSDesigner/issues');
        },
        'click:top .icon-undo': function() {
            return this.history.undo();
        },
        'click:top .icon-repeat': function() {
            return this.history.redo();
        },
        'click:top .icon-shopping-cart': function() {
            if (PLATFORM === Platforms.NODE_WEBKIT) {
                return this.lm.show();
            } else {
                return this.openBuyLink();
            }
        }
    });
    return this.sc({
        'ctrl+f': function() {
            return this.toggleFullscreen();
        },
        'ctrl+q': function() {
            if (this.window) {
                return this.window.close(true);
            }
        },
        'ctrl+s': function() {
            return this.fileManager.save();
        },
        'ctrl+o': function() {
            return this.fileManager.open();
        },
        'ctrl+shift+z': function() {
            return this.history.redo();
        },
        'ctrl+z': function() {
            return this.history.undo();
        },
        'ctrl+shift+right': function() {
            return this.selected.styles.basic.width += 10;
        },
        'ctrl+shift+down': function() {
            return this.selected.styles.basic.height += 10;
        },
        'ctrl+shift+left': function() {
            return this.selected.styles.basic.width -= 10;
        },
        'ctrl+shift+up': function() {
            return this.selected.styles.basic.height -= 10;
        },
        'ctrl+right': function() {
            return this.selected.styles.basic.width += 1;
        },
        'ctrl+down': function() {
            return this.selected.styles.basic.height += 1;
        },
        'ctrl+left': function() {
            return this.selected.styles.basic.width -= 1;
        },
        'ctrl+up': function() {
            return this.selected.styles.basic.height -= 1;
        },
        'shift+right': function() {
            return this.selected.styles.basic.x += 10;
        },
        'shift+left': function() {
            return this.selected.styles.basic.x -= 10;
        },
        'shift+down': function() {
            return this.selected.styles.basic.y += 10;
        },
        'shift+up': function() {
            return this.selected.styles.basic.y -= 10;
        },
        'right': function() {
            return this.selected.styles.basic.x += 1;
        },
        'down': function() {
            return this.selected.styles.basic.y += 1;
        },
        'left': function() {
            return this.selected.styles.basic.x -= 1;
        },
        'up': function() {
            return this.selected.styles.basic.y -= 1;
        },
        'ctrl+shift+i': function() {
            if (PLATFORM === Platforms.NODE_WEBKIT) {
                if (ENV !== 'production') {
                    return this.window.showDevTools();
                }
            }
        },
        'ctrl+add': function() {
            var zoom;
            zoom = parseFloat(document.querySelector('layergroup').style.zoom) || 1;
            return document.querySelector('layergroup').style.zoom = zoom + 0.1;
        },
        'ctrl+subtract': function() {
            var zoom;
            zoom = parseFloat(document.querySelector('layergroup').style.zoom) || 1;
            return document.querySelector('layergroup').style.zoom = zoom - 0.1;
        },
        'tab': function() {
            return document.querySelectorAll('top, right, left, bottom').forEach(function(node) {
                return node.classList.toggle('hidden');
            });
        }
    });
});
