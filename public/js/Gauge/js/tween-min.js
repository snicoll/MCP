function Delegate() {
}
Delegate.create = function(g, e) {
    var c = new Array();
    var b = arguments.length;
    for (var d = 2; d < b; d++) {
        c[d - 2] = arguments[d]
    }
    return function() {
        var a = [].concat(arguments, c);
        e.apply(g, a)
    }
};
Tween = function(f, g, d, c, b, e, a) {
    this.init(f, g, d, c, b, e, a)
};
var t = Tween.prototype;
t.obj = new Object();
t.prop = "";
t.func = function(e, a, g, f) {
    return g * e / f + a
};
t.begin = 0;
t.change = 0;
t.prevTime = 0;
t.prevPos = 0;
t.looping = false;
t._duration = 0;
t._time = 0;
t._pos = 0;
t._position = 0;
t._startTime = 0;
t._finish = 0;
t.name = "";
t.suffixe = "";
t._listeners = new Array();
t.setTime = function(a) {
    this.prevTime = this._time;
    if (a > this.getDuration()) {
        if (this.looping) {
            this.rewind(a - this._duration);
            this.update();
            this.broadcastMessage("onMotionLooped", {target: this, type: "onMotionLooped"})
        } else {
            this._time = this._duration;
            this.update();
            this.stop();
            this.broadcastMessage("onMotionFinished", {target: this, type: "onMotionFinished"})
        }
    } else {
        if (a < 0) {
            this.rewind();
            this.update()
        } else {
            this._time = a;
            this.update()
        }
    }
};
t.getTime = function() {
    return this._time
};
t.setDuration = function(a) {
    this._duration = (a == null || a <= 0) ? 100000 : a
};
t.getDuration = function() {
    return this._duration
};
t.setPosition = function(c) {
    this.prevPos = this._pos;
    var b = this.suffixe != "" ? this.suffixe : "";
    this.obj[this.prop] = Math.round(c) + b;
    this._pos = c;
    this.broadcastMessage("onMotionChanged", {target: this, type: "onMotionChanged"})
};
t.getPosition = function(a) {
    if (a == undefined) {
        a = this._time
    }
    return this.func(a, this.begin, this.change, this._duration)
};
t.setFinish = function(a) {
    this.change = a - this.begin
};
t.getFinish = function() {
    return this.begin + this.change
};
t.init = function(f, g, d, c, b, e, a) {
    if (!arguments.length) {
        return
    }
    this._listeners = new Array();
    this.addListener(this);
    if (a) {
        this.suffixe = a
    }
    this.obj = f;
    this.prop = g;
    this.begin = c;
    this._pos = c;
    this.setDuration(e);
    if (d != null && d != "") {
        this.func = d
    }
    this.setFinish(b)
};
t.start = function() {
    this.rewind();
    this.startEnterFrame();
    this.broadcastMessage("onMotionStarted", {target: this, type: "onMotionStarted"})
};
t.rewind = function(a) {
    this.stop();
    this._time = (a == undefined) ? 0 : a;
    this.fixTime();
    this.update()
};
t.fforward = function() {
    this._time = this._duration;
    this.fixTime();
    this.update()
};
t.update = function() {
    this.setPosition(this.getPosition(this._time))
};
t.startEnterFrame = function() {
    this.stopEnterFrame();
    this.isPlaying = true;
    this.onEnterFrame()
};
t.onEnterFrame = function() {
    if (this.isPlaying) {
        this.nextFrame();
        setTimeout(Delegate.create(this, this.onEnterFrame), 25)
    }
};
t.nextFrame = function() {
    this.setTime((this.getTimer() - this._startTime) / 1000)
};
t.stop = function() {
    this.stopEnterFrame();
    this.broadcastMessage("onMotionStopped", {target: this, type: "onMotionStopped"})
};
t.stopEnterFrame = function() {
    this.isPlaying = false
};
t.playing = function() {
    return isPlaying()
};
t.continueTo = function(a, b) {
    this.begin = this._pos;
    this.setFinish(a);
    if (this._duration != undefined) {
        this.setDuration(b)
    }
    this.start()
};
t.resume = function() {
    this.fixTime();
    this.startEnterFrame();
    this.broadcastMessage("onMotionResumed", {target: this, type: "onMotionResumed"})
};
t.yoyo = function() {
    this.continueTo(this.begin, this._time)
};
t.addListener = function(a) {
    this.removeListener(a);
    return this._listeners.push(a)
};
t.removeListener = function(d) {
    var b = this._listeners;
    var c = b.length;
    while (c--) {
        if (b[c] == d) {
            b.splice(c, 1);
            return true
        }
    }
    return false
};
t.broadcastMessage = function() {
    var b = new Array();
    for (var f = 0; f < arguments.length; f++) {
        b.push(arguments[f])
    }
    var g = b.shift();
    var d = this._listeners;
    var c = d.length;
    for (var f = 0; f < c; f++) {
        if (d[f][g]) {
            d[f][g].apply(d[f], b)
        }
    }
};
t.fixTime = function() {
    this._startTime = this.getTimer() - this._time * 1000
};
t.getTimer = function() {
    return new Date().getTime() - this._time
};
Tween.backEaseIn = function(g, e, k, j, f, i) {
    if (h == undefined) {
        var h = 1.70158
    }
    return k * (g /= j) * g * ((h + 1) * g - h) + e
};
Tween.backEaseOut = function(g, e, k, j, f, i) {
    if (h == undefined) {
        var h = 1.70158
    }
    return k * ((g = g / j - 1) * g * ((h + 1) * g + h) + 1) + e
};
Tween.backEaseInOut = function(g, e, k, j, f, i) {
    if (h == undefined) {
        var h = 1.70158
    }
    if ((g /= j / 2) < 1) {
        return k / 2 * (g * g * (((h *= (1.525)) + 1) * g - h)) + e
    }
    return k / 2 * ((g -= 2) * g * (((h *= (1.525)) + 1) * g + h) + 2) + e
};
Tween.elasticEaseIn = function(g, e, k, j, f, i) {
    if (g == 0) {
        return e
    }
    if ((g /= j) == 1) {
        return e + k
    }
    if (!i) {
        i = j * 0.3
    }
    if (!f || f < Math.abs(k)) {
        f = k;
        var h = i / 4
    } else {
        var h = i / (2 * Math.PI) * Math.asin(k / f)
    }
    return -(f * Math.pow(2, 10 * (g -= 1)) * Math.sin((g * j - h) * (2 * Math.PI) / i)) + e
};
Tween.elasticEaseOut = function(g, e, k, j, f, i) {
    if (g == 0) {
        return e
    }
    if ((g /= j) == 1) {
        return e + k
    }
    if (!i) {
        i = j * 0.3
    }
    if (!f || f < Math.abs(k)) {
        f = k;
        var h = i / 4
    } else {
        var h = i / (2 * Math.PI) * Math.asin(k / f)
    }
    return(f * Math.pow(2, -10 * g) * Math.sin((g * j - h) * (2 * Math.PI) / i) + k + e)
};
Tween.elasticEaseInOut = function(g, e, k, j, f, i) {
    if (g == 0) {
        return e
    }
    if ((g /= j / 2) == 2) {
        return e + k
    }
    if (!i) {
        var i = j * (0.3 * 1.5)
    }
    if (!f || f < Math.abs(k)) {
        var f = k;
        var h = i / 4
    } else {
        var h = i / (2 * Math.PI) * Math.asin(k / f)
    }
    if (g < 1) {
        return -0.5 * (f * Math.pow(2, 10 * (g -= 1)) * Math.sin((g * j - h) * (2 * Math.PI) / i)) + e
    }
    return f * Math.pow(2, -10 * (g -= 1)) * Math.sin((g * j - h) * (2 * Math.PI) / i) * 0.5 + k + e
};
Tween.bounceEaseOut = function(e, a, g, f) {
    if ((e /= f) < (1 / 2.75)) {
        return g * (7.5625 * e * e) + a
    } else {
        if (e < (2 / 2.75)) {
            return g * (7.5625 * (e -= (1.5 / 2.75)) * e + 0.75) + a
        } else {
            if (e < (2.5 / 2.75)) {
                return g * (7.5625 * (e -= (2.25 / 2.75)) * e + 0.9375) + a
            } else {
                return g * (7.5625 * (e -= (2.625 / 2.75)) * e + 0.984375) + a
            }
        }
    }
};
Tween.bounceEaseIn = function(e, a, g, f) {
    return g - Tween.bounceEaseOut(f - e, 0, g, f) + a
};
Tween.bounceEaseInOut = function(e, a, g, f) {
    if (e < f / 2) {
        return Tween.bounceEaseIn(e * 2, 0, g, f) * 0.5 + a
    } else {
        return Tween.bounceEaseOut(e * 2 - f, 0, g, f) * 0.5 + g * 0.5 + a
    }
};
Tween.strongEaseInOut = function(e, a, g, f) {
    return g * (e /= f) * e * e * e * e + a
};
Tween.regularEaseIn = function(e, a, g, f) {
    return g * (e /= f) * e + a
};
Tween.regularEaseOut = function(e, a, g, f) {
    return -g * (e /= f) * (e - 2) + a
};
Tween.regularEaseInOut = function(e, a, g, f) {
    if ((e /= f / 2) < 1) {
        return g / 2 * e * e + a
    }
    return -g / 2 * ((--e) * (e - 2) - 1) + a
};
Tween.strongEaseIn = function(e, a, g, f) {
    return g * (e /= f) * e * e * e * e + a
};
Tween.strongEaseOut = function(e, a, g, f) {
    return g * ((e = e / f - 1) * e * e * e * e + 1) + a
};
Tween.strongEaseInOut = function(e, a, g, f) {
    if ((e /= f / 2) < 1) {
        return g / 2 * e * e * e * e * e + a
    }
    return g / 2 * ((e -= 2) * e * e * e * e + 2) + a
};