
var zites = 0;

/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/lib/jquery.cssanim.coffee ---- */


(function() {
  jQuery.fn.cssSlideDown = function() {
    var elem;
    elem = this;
    elem.css({
      "opacity": 0,
      "margin-bottom": 0,
      "margin-top": 0,
      "padding-bottom": 0,
      "padding-top": 0,
      "display": "none",
      "transform": "scale(0.8)"
    });
    setTimeout((function() {
      var height;
      elem.css("display", "");
      height = elem.outerHeight();
      elem.css({
        "height": 0,
        "display": ""
      }).cssLater("transition", "all 0.3s ease-out", 20);
      elem.cssLater({
        "height": height,
        "opacity": 1,
        "margin-bottom": "",
        "margin-top": "",
        "padding-bottom": "",
        "padding-top": "",
        "transform": "scale(1)"
      }, null, 40);
      return elem.one(transitionEnd, function() {
        return elem.css("transition", "").css("transform", "");
      });
    }), 300);
    return this;
  };

  jQuery.fn.fancySlideDown = function() {
    var elem;
    elem = this;
    return elem.css({
      "opacity": 0,
      "transform": "scale(0.9)"
    }).slideDown().animate({
      "opacity": 1,
      "scale": 1
    }, {
      "duration": 600,
      "queue": false,
      "easing": "easeOutBack"
    });
  };

  jQuery.fn.fancySlideUp = function() {
    var elem;
    elem = this;
    return elem.css("backface-visibility", "hidden").delay(600).slideUp(600).animate({
      "opacity": 0,
      "scale": 0.9
    }, {
      "duration": 600,
      "queue": false,
      "easing": "easeOutQuad"
    });
  };

  window.transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend';

}).call(this);


/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/lib/jquery.cssanim.js ---- */


jQuery.cssHooks['scale'] = {
    get: function(elem, computed, extra) {
        var match = window.getComputedStyle(elem).transform.match("[0-9\.]+")
        if (match) {
            var scale = parseFloat(match[0])
            return scale
        } else {
            return 1.0
        }
    },
    set: function(elem, val) {
        //var transforms = $(elem).css("transform").match(/[0-9\.]+/g)
        var transforms = window.getComputedStyle(elem).transform.match(/[0-9\.]+/g)
        if (transforms) {
            transforms[0] = val
            transforms[3] = val
            //$(elem).css("transform", 'matrix('+transforms.join(", ")+")")
            // elem.style.transform = 'matrix('+transforms.join(", ")+')'
            elem.style.transform = 'translate3d(0px, 0px, 0px) matrix('+transforms.join(", ")+')'
        } else {
            elem.style.transform = "scale("+val+")"
        }
    }
}

jQuery.fx.step.scale = function(fx) {
    jQuery.cssHooks['scale'].set(fx.elem, fx.now)
};


/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/lib/jquery.csslater.coffee ---- */


(function() {
  jQuery.fn.readdClass = function(class_name) {
    var elem;
    elem = this;
    elem.removeClass(class_name);
    setTimeout((function() {
      return elem.addClass(class_name);
    }), 1);
    return this;
  };

  jQuery.fn.removeLater = function(time) {
    var elem;
    if (time == null) {
      time = 500;
    }
    elem = this;
    setTimeout((function() {
      return elem.remove();
    }), time);
    return this;
  };

  jQuery.fn.hideLater = function(time) {
    var elem;
    if (time == null) {
      time = 500;
    }
    elem = this;
    setTimeout((function() {
      return elem.css("display", "none");
    }), time);
    return this;
  };

  jQuery.fn.addClassLater = function(class_name, time) {
    var elem;
    if (time == null) {
      time = 5;
    }
    elem = this;
    setTimeout((function() {
      return elem.addClass(class_name);
    }), time);
    return this;
  };

  /*
  jQuery.fn.removeClassLater = function(class_name, time) {
    var elem;
    if (time == null) {
      time = 500;
    }
    elem = this;
    setTimeout((function() {
      return elem.removeClass(class_name);
    }), time);
    return this;
  };

  jQuery.fn.toggleClassLater = function(name, val, time) {
    var elem;
    if (time == null) {
      time = 10;
    }
    elem = this;
    setTimeout((function() {
      return elem.toggleClass(name, val);
    }), time);
    return this;
  };
  */
  
  jQuery.fn.cssLater = function(name, val, time) {
    var elem;
    if (time == null) {
      time = 500;
    }
    elem = this;
    setTimeout((function() {
      return elem.css(name, val);
    }), time);
    return this;
  };

}).call(this);


/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/lib/jquery.easing.1.3.js ---- */


// t: current time, b: begInnIng value, c: change In value, d: duration

jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
    def: 'easeOutQuad',
    swing: function (x, t, b, c, d) {
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
    },
    easeInQuad: function (x, t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    easeOutQuad: function (x, t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
    easeInOutQuad: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInCubic: function (x, t, b, c, d) {
        return c*(t/=d)*t*t + b;
    },
    easeOutCubic: function (x, t, b, c, d) {
        return c*((t=t/d-1)*t*t + 1) + b;
    },
    easeInOutCubic: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    },
    easeInQuart: function (x, t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
    },
    easeOutQuart: function (x, t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeInOutQuart: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    easeInQuint: function (x, t, b, c, d) {
        return c*(t/=d)*t*t*t*t + b;
    },
    easeOutQuint: function (x, t, b, c, d) {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    },
    easeInOutQuint: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    },
    easeInSine: function (x, t, b, c, d) {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    },
    easeOutSine: function (x, t, b, c, d) {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    },
    easeInOutSine: function (x, t, b, c, d) {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    },
    easeInExpo: function (x, t, b, c, d) {
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },
    easeOutExpo: function (x, t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },
    easeInOutExpo: function (x, t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function (x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    },
    easeOutCirc: function (x, t, b, c, d) {
        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    },
    easeInOutCirc: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    },
    easeInElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    easeOutElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    easeInOutElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },
    easeInBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    easeOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    easeInOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158; 
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    easeInBounce: function (x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
    },
    easeOutBounce: function (x, t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    },
    easeInOutBounce: function (x, t, b, c, d) {
        if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
    }
});


/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/lib/pnglib.js ---- */


/**
* A handy class to calculate color values.
*
* @version 1.0
* @author Robert Eisele <robert@xarg.org>
* @copyright Copyright (c) 2010, Robert Eisele
* @link http://www.xarg.org/2010/03/generate-client-side-png-files-using-javascript/
* @license http://www.opensource.org/licenses/bsd-license.php BSD License
*
*/

(function() {

    // helper functions for that ctx
    function write(buffer, offs) {
        for (var i = 2; i < arguments.length; i++) {
            for (var j = 0; j < arguments[i].length; j++) {
                buffer[offs++] = arguments[i].charAt(j);
            }
        }
    }

    function byte2(w) {
        return String.fromCharCode((w >> 8) & 255, w & 255);
    }

    function byte4(w) {
        return String.fromCharCode((w >> 24) & 255, (w >> 16) & 255, (w >> 8) & 255, w & 255);
    }

    function byte2lsb(w) {
        return String.fromCharCode(w & 255, (w >> 8) & 255);
    }

    window.PNGlib = function(width,height,depth) {

        this.width   = width;
        this.height  = height;
        this.depth   = depth;

        // pixel data and row filter identifier size
        this.pix_size = height * (width + 1);

        // deflate header, pix_size, block headers, adler32 checksum
        this.data_size = 2 + this.pix_size + 5 * Math.floor((0xfffe + this.pix_size) / 0xffff) + 4;

        // offsets and sizes of Png chunks
        this.ihdr_offs = 0;                                    // IHDR offset and size
        this.ihdr_size = 4 + 4 + 13 + 4;
        this.plte_offs = this.ihdr_offs + this.ihdr_size;    // PLTE offset and size
        this.plte_size = 4 + 4 + 3 * depth + 4;
        this.trns_offs = this.plte_offs + this.plte_size;    // tRNS offset and size
        this.trns_size = 4 + 4 + depth + 4;
        this.idat_offs = this.trns_offs + this.trns_size;    // IDAT offset and size
        this.idat_size = 4 + 4 + this.data_size + 4;
        this.iend_offs = this.idat_offs + this.idat_size;    // IEND offset and size
        this.iend_size = 4 + 4 + 4;
        this.buffer_size  = this.iend_offs + this.iend_size;    // total PNG size

        this.buffer  = new Array();
        this.palette = new Object();
        this.pindex  = 0;

        var _crc32 = new Array();

        // initialize buffer with zero bytes
        for (var i = 0; i < this.buffer_size; i++) {
            this.buffer[i] = "\x00";
        }

        // initialize non-zero elements
        write(this.buffer, this.ihdr_offs, byte4(this.ihdr_size - 12), 'IHDR', byte4(width), byte4(height), "\x08\x03");
        write(this.buffer, this.plte_offs, byte4(this.plte_size - 12), 'PLTE');
        write(this.buffer, this.trns_offs, byte4(this.trns_size - 12), 'tRNS');
        write(this.buffer, this.idat_offs, byte4(this.idat_size - 12), 'IDAT');
        write(this.buffer, this.iend_offs, byte4(this.iend_size - 12), 'IEND');

        // initialize deflate header
        var header = ((8 + (7 << 4)) << 8) | (3 << 6);
        header+= 31 - (header % 31);

        write(this.buffer, this.idat_offs + 8, byte2(header));

        // initialize deflate block headers
        for (var i = 0; (i << 16) - 1 < this.pix_size; i++) {
            var size, bits;
            if (i + 0xffff < this.pix_size) {
                size = 0xffff;
                bits = "\x00";
            } else {
                size = this.pix_size - (i << 16) - i;
                bits = "\x01";
            }
            write(this.buffer, this.idat_offs + 8 + 2 + (i << 16) + (i << 2), bits, byte2lsb(size), byte2lsb(~size));
        }

        /* Create crc32 lookup table */
        for (var i = 0; i < 256; i++) {
            var c = i;
            for (var j = 0; j < 8; j++) {
                if (c & 1) {
                    c = -306674912 ^ ((c >> 1) & 0x7fffffff);
                } else {
                    c = (c >> 1) & 0x7fffffff;
                }
            }
            _crc32[i] = c;
        }

        // compute the index into a png for a given pixel
        this.index = function(x,y) {
            var i = y * (this.width + 1) + x + 1;
            var j = this.idat_offs + 8 + 2 + 5 * Math.floor((i / 0xffff) + 1) + i;
            return j;
        }

        // convert a color and build up the palette
        this.color = function(red, green, blue, alpha) {

            alpha = alpha >= 0 ? alpha : 255;
            var color = (((((alpha << 8) | red) << 8) | green) << 8) | blue;

            if (typeof this.palette[color] == "undefined") {
                if (this.pindex == this.depth) return "\x00";

                var ndx = this.plte_offs + 8 + 3 * this.pindex;

                this.buffer[ndx + 0] = String.fromCharCode(red);
                this.buffer[ndx + 1] = String.fromCharCode(green);
                this.buffer[ndx + 2] = String.fromCharCode(blue);
                this.buffer[this.trns_offs+8+this.pindex] = String.fromCharCode(alpha);

                this.palette[color] = String.fromCharCode(this.pindex++);
            }
            return this.palette[color];
        }

        // output a PNG string, Base64 encoded
        this.getBase64 = function() {

            var s = this.getDump();

            var ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var c1, c2, c3, e1, e2, e3, e4;
            var l = s.length;
            var i = 0;
            var r = "";

            do {
                c1 = s.charCodeAt(i);
                e1 = c1 >> 2;
                c2 = s.charCodeAt(i+1);
                e2 = ((c1 & 3) << 4) | (c2 >> 4);
                c3 = s.charCodeAt(i+2);
                if (l < i+2) { e3 = 64; } else { e3 = ((c2 & 0xf) << 2) | (c3 >> 6); }
                if (l < i+3) { e4 = 64; } else { e4 = c3 & 0x3f; }
                r+= ch.charAt(e1) + ch.charAt(e2) + ch.charAt(e3) + ch.charAt(e4);
            } while ((i+= 3) < l);
            return r;
        }

        // output a PNG string
        this.getDump = function() {

            // compute adler32 of output pixels + row filter bytes
            var BASE = 65521; /* largest prime smaller than 65536 */
            var NMAX = 5552;  /* NMAX is the largest n such that 255n(n+1)/2 + (n+1)(BASE-1) <= 2^32-1 */
            var s1 = 1;
            var s2 = 0;
            var n = NMAX;

            for (var y = 0; y < this.height; y++) {
                for (var x = -1; x < this.width; x++) {
                    s1+= this.buffer[this.index(x, y)].charCodeAt(0);
                    s2+= s1;
                    if ((n-= 1) == 0) {
                        s1%= BASE;
                        s2%= BASE;
                        n = NMAX;
                    }
                }
            }
            s1%= BASE;
            s2%= BASE;
            write(this.buffer, this.idat_offs + this.idat_size - 8, byte4((s2 << 16) | s1));

            // compute crc32 of the PNG chunks
            function crc32(png, offs, size) {
                var crc = -1;
                for (var i = 4; i < size-4; i += 1) {
                    crc = _crc32[(crc ^ png[offs+i].charCodeAt(0)) & 0xff] ^ ((crc >> 8) & 0x00ffffff);
                }
                write(png, offs+size-4, byte4(crc ^ -1));
            }

            crc32(this.buffer, this.ihdr_offs, this.ihdr_size);
            crc32(this.buffer, this.plte_offs, this.plte_size);
            crc32(this.buffer, this.trns_offs, this.trns_size);
            crc32(this.buffer, this.idat_offs, this.idat_size);
            crc32(this.buffer, this.iend_offs, this.iend_size);

            // convert PNG to string
            return "\211PNG\r\n\032\n"+this.buffer.join('');
        }
    }

})();


/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/lib/highlight.pack.js ---- */


!function(e){"undefined"!=typeof exports?e(exports):(window.hljs=e({}),"function"==typeof define&&define.amd&&define([],function(){return window.hljs}))}(function(e){function n(e){return e.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;")}function t(e){return e.nodeName.toLowerCase()}function r(e,n){var t=e&&e.exec(n);return t&&0==t.index}function a(e){var n=(e.className+" "+(e.parentNode?e.parentNode.className:"")).split(/\s+/);return n=n.map(function(e){return e.replace(/^lang(uage)?-/,"")}),n.filter(function(e){return N(e)||/no(-?)highlight/.test(e)})[0]}function o(e,n){var t={};for(var r in e)t[r]=e[r];if(n)for(var r in n)t[r]=n[r];return t}function i(e){var n=[];return function r(e,a){for(var o=e.firstChild;o;o=o.nextSibling)3==o.nodeType?a+=o.nodeValue.length:1==o.nodeType&&(n.push({event:"start",offset:a,node:o}),a=r(o,a),t(o).match(/br|hr|img|input/)||n.push({event:"stop",offset:a,node:o}));return a}(e,0),n}function c(e,r,a){function o(){return e.length&&r.length?e[0].offset!=r[0].offset?e[0].offset<r[0].offset?e:r:"start"==r[0].event?e:r:e.length?e:r}function i(e){function r(e){return" "+e.nodeName+'="'+n(e.value)+'"'}l+="<"+t(e)+Array.prototype.map.call(e.attributes,r).join("")+">"}function c(e){l+="</"+t(e)+">"}function u(e){("start"==e.event?i:c)(e.node)}for(var s=0,l="",f=[];e.length||r.length;){var g=o();if(l+=n(a.substr(s,g[0].offset-s)),s=g[0].offset,g==e){f.reverse().forEach(c);do u(g.splice(0,1)[0]),g=o();while(g==e&&g.length&&g[0].offset==s);f.reverse().forEach(i)}else"start"==g[0].event?f.push(g[0].node):f.pop(),u(g.splice(0,1)[0])}return l+n(a.substr(s))}function u(e){function n(e){return e&&e.source||e}function t(t,r){return RegExp(n(t),"m"+(e.cI?"i":"")+(r?"g":""))}function r(a,i){if(!a.compiled){if(a.compiled=!0,a.k=a.k||a.bK,a.k){var c={},u=function(n,t){e.cI&&(t=t.toLowerCase()),t.split(" ").forEach(function(e){var t=e.split("|");c[t[0]]=[n,t[1]?Number(t[1]):1]})};"string"==typeof a.k?u("keyword",a.k):Object.keys(a.k).forEach(function(e){u(e,a.k[e])}),a.k=c}a.lR=t(a.l||/\b[A-Za-z0-9_]+\b/,!0),i&&(a.bK&&(a.b="\\b("+a.bK.split(" ").join("|")+")\\b"),a.b||(a.b=/\B|\b/),a.bR=t(a.b),a.e||a.eW||(a.e=/\B|\b/),a.e&&(a.eR=t(a.e)),a.tE=n(a.e)||"",a.eW&&i.tE&&(a.tE+=(a.e?"|":"")+i.tE)),a.i&&(a.iR=t(a.i)),void 0===a.r&&(a.r=1),a.c||(a.c=[]);var s=[];a.c.forEach(function(e){e.v?e.v.forEach(function(n){s.push(o(e,n))}):s.push("self"==e?a:e)}),a.c=s,a.c.forEach(function(e){r(e,a)}),a.starts&&r(a.starts,i);var l=a.c.map(function(e){return e.bK?"\\.?("+e.b+")\\.?":e.b}).concat([a.tE,a.i]).map(n).filter(Boolean);a.t=l.length?t(l.join("|"),!0):{exec:function(){return null}}}}r(e)}function s(e,t,a,o){function i(e,n){for(var t=0;t<n.c.length;t++)if(r(n.c[t].bR,e))return n.c[t]}function c(e,n){return r(e.eR,n)?e:e.eW?c(e.parent,n):void 0}function f(e,n){return!a&&r(n.iR,e)}function g(e,n){var t=x.cI?n[0].toLowerCase():n[0];return e.k.hasOwnProperty(t)&&e.k[t]}function p(e,n,t,r){var a=r?"":E.classPrefix,o='<span class="'+a,i=t?"":"</span>";return o+=e+'">',o+n+i}function d(){if(!w.k)return n(y);var e="",t=0;w.lR.lastIndex=0;for(var r=w.lR.exec(y);r;){e+=n(y.substr(t,r.index-t));var a=g(w,r);a?(B+=a[1],e+=p(a[0],n(r[0]))):e+=n(r[0]),t=w.lR.lastIndex,r=w.lR.exec(y)}return e+n(y.substr(t))}function h(){if(w.sL&&!R[w.sL])return n(y);var e=w.sL?s(w.sL,y,!0,L[w.sL]):l(y);return w.r>0&&(B+=e.r),"continuous"==w.subLanguageMode&&(L[w.sL]=e.top),p(e.language,e.value,!1,!0)}function v(){return void 0!==w.sL?h():d()}function b(e,t){var r=e.cN?p(e.cN,"",!0):"";e.rB?(M+=r,y=""):e.eB?(M+=n(t)+r,y=""):(M+=r,y=t),w=Object.create(e,{parent:{value:w}})}function m(e,t){if(y+=e,void 0===t)return M+=v(),0;var r=i(t,w);if(r)return M+=v(),b(r,t),r.rB?0:t.length;var a=c(w,t);if(a){var o=w;o.rE||o.eE||(y+=t),M+=v();do w.cN&&(M+="</span>"),B+=w.r,w=w.parent;while(w!=a.parent);return o.eE&&(M+=n(t)),y="",a.starts&&b(a.starts,""),o.rE?0:t.length}if(f(t,w))throw new Error('Illegal lexeme "'+t+'" for mode "'+(w.cN||"<unnamed>")+'"');return y+=t,t.length||1}var x=N(e);if(!x)throw new Error('Unknown language: "'+e+'"');u(x);for(var w=o||x,L={},M="",k=w;k!=x;k=k.parent)k.cN&&(M=p(k.cN,"",!0)+M);var y="",B=0;try{for(var C,j,I=0;;){if(w.t.lastIndex=I,C=w.t.exec(t),!C)break;j=m(t.substr(I,C.index-I),C[0]),I=C.index+j}m(t.substr(I));for(var k=w;k.parent;k=k.parent)k.cN&&(M+="</span>");return{r:B,value:M,language:e,top:w}}catch(A){if(-1!=A.message.indexOf("Illegal"))return{r:0,value:n(t)};throw A}}function l(e,t){t=t||E.languages||Object.keys(R);var r={r:0,value:n(e)},a=r;return t.forEach(function(n){if(N(n)){var t=s(n,e,!1);t.language=n,t.r>a.r&&(a=t),t.r>r.r&&(a=r,r=t)}}),a.language&&(r.second_best=a),r}function f(e){return E.tabReplace&&(e=e.replace(/^((<[^>]+>|\t)+)/gm,function(e,n){return n.replace(/\t/g,E.tabReplace)})),E.useBR&&(e=e.replace(/\n/g,"<br>")),e}function g(e,n,t){var r=n?x[n]:t,a=[e.trim()];return e.match(/(\s|^)hljs(\s|$)/)||a.push("hljs"),r&&a.push(r),a.join(" ").trim()}function p(e){var n=a(e);if(!/no(-?)highlight/.test(n)){var t;E.useBR?(t=document.createElementNS("http://www.w3.org/1999/xhtml","div"),t.innerHTML=e.innerHTML.replace(/\n/g,"").replace(/<br[ \/]*>/g,"\n")):t=e;var r=t.textContent,o=n?s(n,r,!0):l(r),u=i(t);if(u.length){var p=document.createElementNS("http://www.w3.org/1999/xhtml","div");p.innerHTML=o.value,o.value=c(u,i(p),r)}o.value=f(o.value),e.innerHTML=o.value,e.className=g(e.className,n,o.language),e.result={language:o.language,re:o.r},o.second_best&&(e.second_best={language:o.second_best.language,re:o.second_best.r})}}function d(e){E=o(E,e)}function h(){if(!h.called){h.called=!0;var e=document.querySelectorAll("pre code");Array.prototype.forEach.call(e,p)}}function v(){addEventListener("DOMContentLoaded",h,!1),addEventListener("load",h,!1)}function b(n,t){var r=R[n]=t(e);r.aliases&&r.aliases.forEach(function(e){x[e]=n})}function m(){return Object.keys(R)}function N(e){return R[e]||R[x[e]]}var E={classPrefix:"hljs-",tabReplace:null,useBR:!1,languages:void 0},R={},x={};return e.highlight=s,e.highlightAuto=l,e.fixMarkup=f,e.highlightBlock=p,e.configure=d,e.initHighlighting=h,e.initHighlightingOnLoad=v,e.registerLanguage=b,e.listLanguages=m,e.getLanguage=N,e.inherit=o,e.IR="[a-zA-Z][a-zA-Z0-9_]*",e.UIR="[a-zA-Z_][a-zA-Z0-9_]*",e.NR="\\b\\d+(\\.\\d+)?",e.CNR="(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",e.BNR="\\b(0b[01]+)",e.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",e.BE={b:"\\\\[\\s\\S]",r:0},e.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[e.BE]},e.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[e.BE]},e.PWM={b:/\b(a|an|the|are|I|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such)\b/},e.CLCM={cN:"comment",b:"//",e:"$",c:[e.PWM]},e.CBCM={cN:"comment",b:"/\\*",e:"\\*/",c:[e.PWM]},e.HCM={cN:"comment",b:"#",e:"$",c:[e.PWM]},e.NM={cN:"number",b:e.NR,r:0},e.CNM={cN:"number",b:e.CNR,r:0},e.BNM={cN:"number",b:e.BNR,r:0},e.CSSNM={cN:"number",b:e.NR+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",r:0},e.RM={cN:"regexp",b:/\//,e:/\/[gimuy]*/,i:/\n/,c:[e.BE,{b:/\[/,e:/\]/,r:0,c:[e.BE]}]},e.TM={cN:"title",b:e.IR,r:0},e.UTM={cN:"title",b:e.UIR,r:0},e});hljs.registerLanguage("cpp",function(t){var i={keyword:"false int float while private char catch export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const struct for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using true class asm case typeid short reinterpret_cast|10 default double register explicit signed typename try this switch continue wchar_t inline delete alignof char16_t char32_t constexpr decltype noexcept nullptr static_assert thread_local restrict _Bool complex _Complex _Imaginaryintmax_t uintmax_t int8_t uint8_t int16_t uint16_t int32_t uint32_t  int64_t uint64_tint_least8_t uint_least8_t int_least16_t uint_least16_t int_least32_t uint_least32_tint_least64_t uint_least64_t int_fast8_t uint_fast8_t int_fast16_t uint_fast16_t int_fast32_tuint_fast32_t int_fast64_t uint_fast64_t intptr_t uintptr_t atomic_bool atomic_char atomic_scharatomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llongatomic_ullong atomic_wchar_t atomic_char16_t atomic_char32_t atomic_intmax_t atomic_uintmax_tatomic_intptr_t atomic_uintptr_t atomic_size_t atomic_ptrdiff_t atomic_int_least8_t atomic_int_least16_tatomic_int_least32_t atomic_int_least64_t atomic_uint_least8_t atomic_uint_least16_t atomic_uint_least32_tatomic_uint_least64_t atomic_int_fast8_t atomic_int_fast16_t atomic_int_fast32_t atomic_int_fast64_tatomic_uint_fast8_t atomic_uint_fast16_t atomic_uint_fast32_t atomic_uint_fast64_t",built_in:"std string cin cout cerr clog stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap array shared_ptr abort abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf"};return{aliases:["c","h","c++","h++"],k:i,i:"</",c:[t.CLCM,t.CBCM,t.QSM,{cN:"string",b:"'\\\\?.",e:"'",i:"."},{cN:"number",b:"\\b(\\d+(\\.\\d*)?|\\.\\d+)(u|U|l|L|ul|UL|f|F)"},t.CNM,{cN:"preprocessor",b:"#",e:"$",k:"if else elif endif define undef warning error line pragma",c:[{b:'include\\s*[<"]',e:'[>"]',k:"include",i:"\\n"},t.CLCM]},{cN:"stl_container",b:"\\b(deque|list|queue|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",e:">",k:i,c:["self"]},{b:t.IR+"::"},{bK:"new throw return",r:0},{cN:"function",b:"("+t.IR+"\\s+)+"+t.IR+"\\s*\\(",rB:!0,e:/[{;=]/,eE:!0,k:i,c:[{b:t.IR+"\\s*\\(",rB:!0,c:[t.TM],r:0},{cN:"params",b:/\(/,e:/\)/,k:i,r:0,c:[t.CBCM]},t.CLCM,t.CBCM]}]}});hljs.registerLanguage("ruby",function(e){var b="[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?",r="and false then defined module in return redo if BEGIN retry end for true self when next until do begin unless END rescue nil else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor",c={cN:"yardoctag",b:"@[A-Za-z]+"},a={cN:"value",b:"#<",e:">"},s={cN:"comment",v:[{b:"#",e:"$",c:[c]},{b:"^\\=begin",e:"^\\=end",c:[c],r:10},{b:"^__END__",e:"\\n$"}]},n={cN:"subst",b:"#\\{",e:"}",k:r},t={cN:"string",c:[e.BE,n],v:[{b:/'/,e:/'/},{b:/"/,e:/"/},{b:/`/,e:/`/},{b:"%[qQwWx]?\\(",e:"\\)"},{b:"%[qQwWx]?\\[",e:"\\]"},{b:"%[qQwWx]?{",e:"}"},{b:"%[qQwWx]?<",e:">"},{b:"%[qQwWx]?/",e:"/"},{b:"%[qQwWx]?%",e:"%"},{b:"%[qQwWx]?-",e:"-"},{b:"%[qQwWx]?\\|",e:"\\|"},{b:/\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/}]},i={cN:"params",b:"\\(",e:"\\)",k:r},d=[t,a,s,{cN:"class",bK:"class module",e:"$|;",i:/=/,c:[e.inherit(e.TM,{b:"[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?"}),{cN:"inheritance",b:"<\\s*",c:[{cN:"parent",b:"("+e.IR+"::)?"+e.IR}]},s]},{cN:"function",bK:"def",e:" |$|;",r:0,c:[e.inherit(e.TM,{b:b}),i,s]},{cN:"constant",b:"(::)?(\\b[A-Z]\\w*(::)?)+",r:0},{cN:"symbol",b:e.UIR+"(\\!|\\?)?:",r:0},{cN:"symbol",b:":",c:[t,{b:b}],r:0},{cN:"number",b:"(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",r:0},{cN:"variable",b:"(\\$\\W)|((\\$|\\@\\@?)(\\w+))"},{b:"("+e.RSR+")\\s*",c:[a,s,{cN:"regexp",c:[e.BE,n],i:/\n/,v:[{b:"/",e:"/[a-z]*"},{b:"%r{",e:"}[a-z]*"},{b:"%r\\(",e:"\\)[a-z]*"},{b:"%r!",e:"![a-z]*"},{b:"%r\\[",e:"\\][a-z]*"}]}],r:0}];n.c=d,i.c=d;var l="[>?]>",u="[\\w#]+\\(\\w+\\):\\d+:\\d+>",N="(\\w+-)?\\d+\\.\\d+\\.\\d(p\\d+)?[^>]+>",o=[{b:/^\s*=>/,cN:"status",starts:{e:"$",c:d}},{cN:"prompt",b:"^("+l+"|"+u+"|"+N+")",starts:{e:"$",c:d}}];return{aliases:["rb","gemspec","podspec","thor","irb"],k:r,c:[s].concat(o).concat(d)}});hljs.registerLanguage("apache",function(e){var r={cN:"number",b:"[\\$%]\\d+"};return{aliases:["apacheconf"],cI:!0,c:[e.HCM,{cN:"tag",b:"</?",e:">"},{cN:"keyword",b:/\w+/,r:0,k:{common:"order deny allow setenv rewriterule rewriteengine rewritecond documentroot sethandler errordocument loadmodule options header listen serverroot servername"},starts:{e:/$/,r:0,k:{literal:"on off all"},c:[{cN:"sqbracket",b:"\\s\\[",e:"\\]$"},{cN:"cbracket",b:"[\\$%]\\{",e:"\\}",c:["self",r]},r,e.QSM]}}],i:/\S/}});hljs.registerLanguage("python",function(e){var r={cN:"prompt",b:/^(>>>|\.\.\.) /},b={cN:"string",c:[e.BE],v:[{b:/(u|b)?r?'''/,e:/'''/,c:[r],r:10},{b:/(u|b)?r?"""/,e:/"""/,c:[r],r:10},{b:/(u|r|ur)'/,e:/'/,r:10},{b:/(u|r|ur)"/,e:/"/,r:10},{b:/(b|br)'/,e:/'/},{b:/(b|br)"/,e:/"/},e.ASM,e.QSM]},l={cN:"number",r:0,v:[{b:e.BNR+"[lLjJ]?"},{b:"\\b(0o[0-7]+)[lLjJ]?"},{b:e.CNR+"[lLjJ]?"}]},c={cN:"params",b:/\(/,e:/\)/,c:["self",r,l,b]};return{aliases:["py","gyp"],k:{keyword:"and elif is global as in if from raise for except finally print import pass return exec else break not with class assert yield try while continue del or def lambda nonlocal|10 None True False",built_in:"Ellipsis NotImplemented"},i:/(<\/|->|\?)/,c:[r,l,b,e.HCM,{v:[{cN:"function",bK:"def",r:10},{cN:"class",bK:"class"}],e:/:/,i:/[${=;\n]/,c:[e.UTM,c]},{cN:"decorator",b:/@/,e:/$/},{b:/\b(print|exec)\(/}]}});hljs.registerLanguage("javascript",function(r){return{aliases:["js"],k:{keyword:"in if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const class",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document"},c:[{cN:"pi",r:10,v:[{b:/^\s*('|")use strict('|")/},{b:/^\s*('|")use asm('|")/}]},r.ASM,r.QSM,r.CLCM,r.CBCM,r.CNM,{b:"("+r.RSR+"|\\b(case|return|throw)\\b)\\s*",k:"return throw case",c:[r.CLCM,r.CBCM,r.RM,{b:/</,e:/>;/,r:0,sL:"xml"}],r:0},{cN:"function",bK:"function",e:/\{/,eE:!0,c:[r.inherit(r.TM,{b:/[A-Za-z$_][0-9A-Za-z$_]*/}),{cN:"params",b:/\(/,e:/\)/,c:[r.CLCM,r.CBCM],i:/["'\(]/}],i:/\[|%/},{b:/\$[(.]/},{b:"\\."+r.IR,r:0}]}});hljs.registerLanguage("coffeescript",function(e){var c={keyword:"in if for while finally new do return else break catch instanceof throw try this switch continue typeof delete debugger super then unless until loop of by when and or is isnt not",literal:"true false null undefined yes no on off",reserved:"case default function var void with const let enum export import native __hasProp __extends __slice __bind __indexOf",built_in:"npm require console print module global window document"},n="[A-Za-z$_][0-9A-Za-z$_]*",t={cN:"subst",b:/#\{/,e:/}/,k:c},r=[e.BNM,e.inherit(e.CNM,{starts:{e:"(\\s*/)?",r:0}}),{cN:"string",v:[{b:/'''/,e:/'''/,c:[e.BE]},{b:/'/,e:/'/,c:[e.BE]},{b:/"""/,e:/"""/,c:[e.BE,t]},{b:/"/,e:/"/,c:[e.BE,t]}]},{cN:"regexp",v:[{b:"///",e:"///",c:[t,e.HCM]},{b:"//[gim]*",r:0},{b:/\/(?![ *])(\\\/|.)*?\/[gim]*(?=\W|$)/}]},{cN:"property",b:"@"+n},{b:"`",e:"`",eB:!0,eE:!0,sL:"javascript"}];t.c=r;var i=e.inherit(e.TM,{b:n}),s="(\\(.*\\))?\\s*\\B[-=]>",o={cN:"params",b:"\\([^\\(]",rB:!0,c:[{b:/\(/,e:/\)/,k:c,c:["self"].concat(r)}]};return{aliases:["coffee","cson","iced"],k:c,i:/\/\*/,c:r.concat([{cN:"comment",b:"###",e:"###",c:[e.PWM]},e.HCM,{cN:"function",b:"^\\s*"+n+"\\s*=\\s*"+s,e:"[-=]>",rB:!0,c:[i,o]},{b:/[:\(,=]\s*/,r:0,c:[{cN:"function",b:s,e:"[-=]>",rB:!0,c:[o]}]},{cN:"class",bK:"class",e:"$",i:/[:="\[\]]/,c:[{bK:"extends",eW:!0,i:/[:="\[\]]/,c:[i]},i]},{cN:"attribute",b:n+":",e:":",rB:!0,rE:!0,r:0}])}});hljs.registerLanguage("http",function(){return{i:"\\S",c:[{cN:"status",b:"^HTTP/[0-9\\.]+",e:"$",c:[{cN:"number",b:"\\b\\d{3}\\b"}]},{cN:"request",b:"^[A-Z]+ (.*?) HTTP/[0-9\\.]+$",rB:!0,e:"$",c:[{cN:"string",b:" ",e:" ",eB:!0,eE:!0}]},{cN:"attribute",b:"^\\w",e:": ",eE:!0,i:"\\n|\\s|=",starts:{cN:"string",e:"$"}},{b:"\\n\\n",starts:{sL:"",eW:!0}}]}});hljs.registerLanguage("css",function(e){var c="[a-zA-Z-][a-zA-Z0-9_-]*",a={cN:"function",b:c+"\\(",rB:!0,eE:!0,e:"\\("};return{cI:!0,i:"[=/|']",c:[e.CBCM,{cN:"id",b:"\\#[A-Za-z0-9_-]+"},{cN:"class",b:"\\.[A-Za-z0-9_-]+",r:0},{cN:"attr_selector",b:"\\[",e:"\\]",i:"$"},{cN:"pseudo",b:":(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\\"\\']+"},{cN:"at_rule",b:"@(font-face|page)",l:"[a-z-]+",k:"font-face page"},{cN:"at_rule",b:"@",e:"[{;]",c:[{cN:"keyword",b:/\S+/},{b:/\s/,eW:!0,eE:!0,r:0,c:[a,e.ASM,e.QSM,e.CSSNM]}]},{cN:"tag",b:c,r:0},{cN:"rules",b:"{",e:"}",i:"[^\\s]",r:0,c:[e.CBCM,{cN:"rule",b:"[^\\s]",rB:!0,e:";",eW:!0,c:[{cN:"attribute",b:"[A-Z\\_\\.\\-]+",e:":",eE:!0,i:"[^\\s]",starts:{cN:"value",eW:!0,eE:!0,c:[a,e.CSSNM,e.QSM,e.ASM,e.CBCM,{cN:"hexcolor",b:"#[0-9A-Fa-f]+"},{cN:"important",b:"!important"}]}}]}]}]}});hljs.registerLanguage("ini",function(e){return{cI:!0,i:/\S/,c:[{cN:"comment",b:";",e:"$"},{cN:"title",b:"^\\[",e:"\\]"},{cN:"setting",b:"^[a-z0-9\\[\\]_-]+[ \\t]*=[ \\t]*",e:"$",c:[{cN:"value",eW:!0,k:"on off true false yes no",c:[e.QSM,e.NM],r:0}]}]}});hljs.registerLanguage("objectivec",function(e){var t={keyword:"int float while char export sizeof typedef const struct for union unsigned long volatile static bool mutable if do return goto void enum else break extern asm case short default double register explicit signed typename this switch continue wchar_t inline readonly assign readwrite self @synchronized id typeof nonatomic super unichar IBOutlet IBAction strong weak copy in out inout bycopy byref oneway __strong __weak __block __autoreleasing @private @protected @public @try @property @end @throw @catch @finally @autoreleasepool @synthesize @dynamic @selector @optional @required",literal:"false true FALSE TRUE nil YES NO NULL",built_in:"NSString NSData NSDictionary CGRect CGPoint UIButton UILabel UITextView UIWebView MKMapView NSView NSViewController NSWindow NSWindowController NSSet NSUUID NSIndexSet UISegmentedControl NSObject UITableViewDelegate UITableViewDataSource NSThread UIActivityIndicator UITabbar UIToolBar UIBarButtonItem UIImageView NSAutoreleasePool UITableView BOOL NSInteger CGFloat NSException NSLog NSMutableString NSMutableArray NSMutableDictionary NSURL NSIndexPath CGSize UITableViewCell UIView UIViewController UINavigationBar UINavigationController UITabBarController UIPopoverController UIPopoverControllerDelegate UIImage NSNumber UISearchBar NSFetchedResultsController NSFetchedResultsChangeType UIScrollView UIScrollViewDelegate UIEdgeInsets UIColor UIFont UIApplication NSNotFound NSNotificationCenter NSNotification UILocalNotification NSBundle NSFileManager NSTimeInterval NSDate NSCalendar NSUserDefaults UIWindow NSRange NSArray NSError NSURLRequest NSURLConnection NSURLSession NSURLSessionDataTask NSURLSessionDownloadTask NSURLSessionUploadTask NSURLResponseUIInterfaceOrientation MPMoviePlayerController dispatch_once_t dispatch_queue_t dispatch_sync dispatch_async dispatch_once"},o=/[a-zA-Z@][a-zA-Z0-9_]*/,a="@interface @class @protocol @implementation";return{aliases:["m","mm","objc","obj-c"],k:t,l:o,i:"</",c:[e.CLCM,e.CBCM,e.CNM,e.QSM,{cN:"string",v:[{b:'@"',e:'"',i:"\\n",c:[e.BE]},{b:"'",e:"[^\\\\]'",i:"[^\\\\][^']"}]},{cN:"preprocessor",b:"#",e:"$",c:[{cN:"title",v:[{b:'"',e:'"'},{b:"<",e:">"}]}]},{cN:"class",b:"("+a.split(" ").join("|")+")\\b",e:"({|$)",eE:!0,k:a,l:o,c:[e.UTM]},{cN:"variable",b:"\\."+e.UIR,r:0}]}});hljs.registerLanguage("bash",function(e){var t={cN:"variable",v:[{b:/\$[\w\d#@][\w\d_]*/},{b:/\$\{(.*?)\}/}]},s={cN:"string",b:/"/,e:/"/,c:[e.BE,t,{cN:"variable",b:/\$\(/,e:/\)/,c:[e.BE]}]},a={cN:"string",b:/'/,e:/'/};return{aliases:["sh","zsh"],l:/-?[a-z\.]+/,k:{keyword:"if then else elif fi for while in do done case esac function",literal:"true false",built_in:"break cd continue eval exec exit export getopts hash pwd readonly return shift test times trap umask unset alias bind builtin caller command declare echo enable help let local logout mapfile printf read readarray source type typeset ulimit unalias set shopt autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate fc fg float functions getcap getln history integer jobs kill limit log noglob popd print pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof zpty zregexparse zsocket zstyle ztcp",operator:"-ne -eq -lt -gt -f -d -e -s -l -a"},c:[{cN:"shebang",b:/^#![^\n]+sh\s*$/,r:10},{cN:"function",b:/\w[\w\d_]*\s*\(\s*\)\s*\{/,rB:!0,c:[e.inherit(e.TM,{b:/\w[\w\d_]*/})],r:0},e.HCM,e.NM,s,a,t]}});hljs.registerLanguage("markdown",function(){return{aliases:["md","mkdown","mkd"],c:[{cN:"header",v:[{b:"^#{1,6}",e:"$"},{b:"^.+?\\n[=-]{2,}$"}]},{b:"<",e:">",sL:"xml",r:0},{cN:"bullet",b:"^([*+-]|(\\d+\\.))\\s+"},{cN:"strong",b:"[*_]{2}.+?[*_]{2}"},{cN:"emphasis",v:[{b:"\\*.+?\\*"},{b:"_.+?_",r:0}]},{cN:"blockquote",b:"^>\\s+",e:"$"},{cN:"code",v:[{b:"`.+?`"},{b:"^( {4}|    )",e:"$",r:0}]},{cN:"horizontal_rule",b:"^[-\\*]{3,}",e:"$"},{b:"\\[.+?\\][\\(\\[].*?[\\)\\]]",rB:!0,c:[{cN:"link_label",b:"\\[",e:"\\]",eB:!0,rE:!0,r:0},{cN:"link_url",b:"\\]\\(",e:"\\)",eB:!0,eE:!0},{cN:"link_reference",b:"\\]\\[",e:"\\]",eB:!0,eE:!0}],r:10},{b:"^\\[.+\\]:",rB:!0,c:[{cN:"link_reference",b:"\\[",e:"\\]:",eB:!0,eE:!0,starts:{cN:"link_url",e:"$"}}]}]}});hljs.registerLanguage("java",function(e){var a=e.UIR+"(<"+e.UIR+">)?",t="false synchronized int abstract float private char boolean static null if const for true while long strictfp finally protected import native final void enum else break transient catch instanceof byte super volatile case assert short package default double public try this switch continue throws protected public private",c="(\\b(0b[01_]+)|\\b0[xX][a-fA-F0-9_]+|(\\b[\\d_]+(\\.[\\d_]*)?|\\.[\\d_]+)([eE][-+]?\\d+)?)[lLfF]?",r={cN:"number",b:c,r:0};return{aliases:["jsp"],k:t,i:/<\//,c:[{cN:"javadoc",b:"/\\*\\*",e:"\\*/",r:0,c:[{cN:"javadoctag",b:"(^|\\s)@[A-Za-z]+"}]},e.CLCM,e.CBCM,e.ASM,e.QSM,{cN:"class",bK:"class interface",e:/[{;=]/,eE:!0,k:"class interface",i:/[:"\[\]]/,c:[{bK:"extends implements"},e.UTM]},{bK:"new throw return",r:0},{cN:"function",b:"("+a+"\\s+)+"+e.UIR+"\\s*\\(",rB:!0,e:/[{;=]/,eE:!0,k:t,c:[{b:e.UIR+"\\s*\\(",rB:!0,r:0,c:[e.UTM]},{cN:"params",b:/\(/,e:/\)/,k:t,r:0,c:[e.ASM,e.QSM,e.CNM,e.CBCM]},e.CLCM,e.CBCM]},r,{cN:"annotation",b:"@[A-Za-z]+"}]}});hljs.registerLanguage("diff",function(){return{aliases:["patch"],c:[{cN:"chunk",r:10,v:[{b:/^\@\@ +\-\d+,\d+ +\+\d+,\d+ +\@\@$/},{b:/^\*\*\* +\d+,\d+ +\*\*\*\*$/},{b:/^\-\-\- +\d+,\d+ +\-\-\-\-$/}]},{cN:"header",v:[{b:/Index: /,e:/$/},{b:/=====/,e:/=====$/},{b:/^\-\-\-/,e:/$/},{b:/^\*{3} /,e:/$/},{b:/^\+\+\+/,e:/$/},{b:/\*{5}/,e:/\*{5}$/}]},{cN:"addition",b:"^\\+",e:"$"},{cN:"deletion",b:"^\\-",e:"$"},{cN:"change",b:"^\\!",e:"$"}]}});hljs.registerLanguage("perl",function(e){var t="getpwent getservent quotemeta msgrcv scalar kill dbmclose undef lc ma syswrite tr send umask sysopen shmwrite vec qx utime local oct semctl localtime readpipe do return format read sprintf dbmopen pop getpgrp not getpwnam rewinddir qqfileno qw endprotoent wait sethostent bless s|0 opendir continue each sleep endgrent shutdown dump chomp connect getsockname die socketpair close flock exists index shmgetsub for endpwent redo lstat msgctl setpgrp abs exit select print ref gethostbyaddr unshift fcntl syscall goto getnetbyaddr join gmtime symlink semget splice x|0 getpeername recv log setsockopt cos last reverse gethostbyname getgrnam study formline endhostent times chop length gethostent getnetent pack getprotoent getservbyname rand mkdir pos chmod y|0 substr endnetent printf next open msgsnd readdir use unlink getsockopt getpriority rindex wantarray hex system getservbyport endservent int chr untie rmdir prototype tell listen fork shmread ucfirst setprotoent else sysseek link getgrgid shmctl waitpid unpack getnetbyname reset chdir grep split require caller lcfirst until warn while values shift telldir getpwuid my getprotobynumber delete and sort uc defined srand accept package seekdir getprotobyname semop our rename seek if q|0 chroot sysread setpwent no crypt getc chown sqrt write setnetent setpriority foreach tie sin msgget map stat getlogin unless elsif truncate exec keys glob tied closedirioctl socket readlink eval xor readline binmode setservent eof ord bind alarm pipe atan2 getgrent exp time push setgrent gt lt or ne m|0 break given say state when",r={cN:"subst",b:"[$@]\\{",e:"\\}",k:t},s={b:"->{",e:"}"},n={cN:"variable",v:[{b:/\$\d/},{b:/[\$\%\@](\^\w\b|#\w+(\:\:\w+)*|{\w+}|\w+(\:\:\w*)*)/},{b:/[\$\%\@][^\s\w{]/,r:0}]},o={cN:"comment",b:"^(__END__|__DATA__)",e:"\\n$",r:5},i=[e.BE,r,n],c=[n,e.HCM,o,{cN:"comment",b:"^\\=\\w",e:"\\=cut",eW:!0},s,{cN:"string",c:i,v:[{b:"q[qwxr]?\\s*\\(",e:"\\)",r:5},{b:"q[qwxr]?\\s*\\[",e:"\\]",r:5},{b:"q[qwxr]?\\s*\\{",e:"\\}",r:5},{b:"q[qwxr]?\\s*\\|",e:"\\|",r:5},{b:"q[qwxr]?\\s*\\<",e:"\\>",r:5},{b:"qw\\s+q",e:"q",r:5},{b:"'",e:"'",c:[e.BE]},{b:'"',e:'"'},{b:"`",e:"`",c:[e.BE]},{b:"{\\w+}",c:[],r:0},{b:"-?\\w+\\s*\\=\\>",c:[],r:0}]},{cN:"number",b:"(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",r:0},{b:"(\\/\\/|"+e.RSR+"|\\b(split|return|print|reverse|grep)\\b)\\s*",k:"split return print reverse grep",r:0,c:[e.HCM,o,{cN:"regexp",b:"(s|tr|y)/(\\\\.|[^/])*/(\\\\.|[^/])*/[a-z]*",r:10},{cN:"regexp",b:"(m|qr)?/",e:"/[a-z]*",c:[e.BE],r:0}]},{cN:"sub",bK:"sub",e:"(\\s*\\(.*?\\))?[;{]",r:5},{cN:"operator",b:"-\\w\\b",r:0}];return r.c=c,s.c=c,{aliases:["pl"],k:t,c:c}});hljs.registerLanguage("makefile",function(e){var a={cN:"variable",b:/\$\(/,e:/\)/,c:[e.BE]};return{aliases:["mk","mak"],c:[e.HCM,{b:/^\w+\s*\W*=/,rB:!0,r:0,starts:{cN:"constant",e:/\s*\W*=/,eE:!0,starts:{e:/$/,r:0,c:[a]}}},{cN:"title",b:/^[\w]+:\s*$/},{cN:"phony",b:/^\.PHONY:/,e:/$/,k:".PHONY",l:/[\.\w]+/},{b:/^\t+/,e:/$/,r:0,c:[e.QSM,a]}]}});hljs.registerLanguage("cs",function(e){var r="abstract as base bool break byte case catch char checked const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long null object operator out override params private protected public readonly ref sbyte sealed short sizeof stackalloc static string struct switch this true try typeof uint ulong unchecked unsafe ushort using virtual volatile void while async protected public private internal ascending descending from get group into join let orderby partial select set value var where yield",t=e.IR+"(<"+e.IR+">)?";return{aliases:["csharp"],k:r,i:/::/,c:[{cN:"comment",b:"///",e:"$",rB:!0,c:[{cN:"xmlDocTag",v:[{b:"///",r:0},{b:"<!--|-->"},{b:"</?",e:">"}]}]},e.CLCM,e.CBCM,{cN:"preprocessor",b:"#",e:"$",k:"if else elif endif define undef warning error line region endregion pragma checksum"},{cN:"string",b:'@"',e:'"',c:[{b:'""'}]},e.ASM,e.QSM,e.CNM,{bK:"class namespace interface",e:/[{;=]/,i:/[^\s:]/,c:[e.TM,e.CLCM,e.CBCM]},{bK:"new return throw await",r:0},{cN:"function",b:"("+t+"\\s+)+"+e.IR+"\\s*\\(",rB:!0,e:/[{;=]/,eE:!0,k:r,c:[{b:e.IR+"\\s*\\(",rB:!0,c:[e.TM],r:0},{cN:"params",b:/\(/,e:/\)/,k:r,r:0,c:[e.ASM,e.QSM,e.CNM,e.CBCM]},e.CLCM,e.CBCM]}]}});hljs.registerLanguage("json",function(e){var t={literal:"true false null"},i=[e.QSM,e.CNM],l={cN:"value",e:",",eW:!0,eE:!0,c:i,k:t},c={b:"{",e:"}",c:[{cN:"attribute",b:'\\s*"',e:'"\\s*:\\s*',eB:!0,eE:!0,c:[e.BE],i:"\\n",starts:l}],i:"\\S"},n={b:"\\[",e:"\\]",c:[e.inherit(l,{cN:null})],i:"\\S"};return i.splice(i.length,0,c,n),{c:i,k:t,i:"\\S"}});hljs.registerLanguage("nginx",function(e){var r={cN:"variable",v:[{b:/\$\d+/},{b:/\$\{/,e:/}/},{b:"[\\$\\@]"+e.UIR}]},b={eW:!0,l:"[a-z/_]+",k:{built_in:"on off yes no true false none blocked debug info notice warn error crit select break last permanent redirect kqueue rtsig epoll poll /dev/poll"},r:0,i:"=>",c:[e.HCM,{cN:"string",c:[e.BE,r],v:[{b:/"/,e:/"/},{b:/'/,e:/'/}]},{cN:"url",b:"([a-z]+):/",e:"\\s",eW:!0,eE:!0,c:[r]},{cN:"regexp",c:[e.BE,r],v:[{b:"\\s\\^",e:"\\s|{|;",rE:!0},{b:"~\\*?\\s+",e:"\\s|{|;",rE:!0},{b:"\\*(\\.[a-z\\-]+)+"},{b:"([a-z\\-]+\\.)+\\*"}]},{cN:"number",b:"\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b"},{cN:"number",b:"\\b\\d+[kKmMgGdshdwy]*\\b",r:0},r]};return{aliases:["nginxconf"],c:[e.HCM,{b:e.UIR+"\\s",e:";|{",rB:!0,c:[{cN:"title",b:e.UIR,starts:b}],r:0}],i:"[^\\s\\}]"}});hljs.registerLanguage("sql",function(e){var t={cN:"comment",b:"--",e:"$"};return{cI:!0,i:/[<>]/,c:[{cN:"operator",bK:"begin end start commit rollback savepoint lock alter create drop rename call delete do handler insert load replace select truncate update set show pragma grant merge describe use explain help declare prepare execute deallocate savepoint release unlock purge reset change stop analyze cache flush optimize repair kill install uninstall checksum restore check backup",e:/;/,eW:!0,k:{keyword:"abs absolute acos action add adddate addtime aes_decrypt aes_encrypt after aggregate all allocate alter analyze and any are as asc ascii asin assertion at atan atan2 atn2 authorization authors avg backup before begin benchmark between bin binlog bit_and bit_count bit_length bit_or bit_xor both by cache call cascade cascaded case cast catalog ceil ceiling chain change changed char_length character_length charindex charset check checksum checksum_agg choose close coalesce coercibility collate collation collationproperty column columns columns_updated commit compress concat concat_ws concurrent connect connection connection_id consistent constraint constraints continue contributors conv convert convert_tz corresponding cos cot count count_big crc32 create cross cume_dist curdate current current_date current_time current_timestamp current_user cursor curtime data database databases datalength date_add date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts datetimeoffsetfromparts day dayname dayofmonth dayofweek dayofyear deallocate declare decode default deferrable deferred degrees delayed delete des_decrypt des_encrypt des_key_file desc describe descriptor diagnostics difference disconnect distinct distinctrow div do domain double drop dumpfile each else elt enclosed encode encrypt end end-exec engine engines eomonth errors escape escaped event eventdata events except exception exec execute exists exp explain export_set extended external extract fast fetch field fields find_in_set first first_value floor flush for force foreign format found found_rows from from_base64 from_days from_unixtime full function get get_format get_lock getdate getutcdate global go goto grant grants greatest group group_concat grouping grouping_id gtid_subset gtid_subtract handler having help hex high_priority hosts hour ident_current ident_incr ident_seed identified identity if ifnull ignore iif ilike immediate in index indicator inet6_aton inet6_ntoa inet_aton inet_ntoa infile initially inner innodb input insert install instr intersect into is is_free_lock is_ipv4 is_ipv4_compat is_ipv4_mapped is_not is_not_null is_used_lock isdate isnull isolation join key kill language last last_day last_insert_id last_value lcase lead leading least leaves left len lenght level like limit lines ln load load_file local localtime localtimestamp locate lock log log10 log2 logfile logs low_priority lower lpad ltrim make_set makedate maketime master master_pos_wait match matched max md5 medium merge microsecond mid min minute mod mode module month monthname mutex name_const names national natural nchar next no no_write_to_binlog not now nullif nvarchar oct octet_length of old_password on only open optimize option optionally or ord order outer outfile output pad parse partial partition password patindex percent_rank percentile_cont percentile_disc period_add period_diff pi plugin position pow power pragma precision prepare preserve primary prior privileges procedure procedure_analyze processlist profile profiles public publishingservername purge quarter query quick quote quotename radians rand read references regexp relative relaylog release release_lock rename repair repeat replace replicate reset restore restrict return returns reverse revoke right rlike rollback rollup round row row_count rows rpad rtrim savepoint schema scroll sec_to_time second section select serializable server session session_user set sha sha1 sha2 share show sign sin size slave sleep smalldatetimefromparts snapshot some soname soundex sounds_like space sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_no_cache sql_small_result sql_variant_property sqlstate sqrt square start starting status std stddev stddev_pop stddev_samp stdev stdevp stop str str_to_date straight_join strcmp string stuff subdate substr substring subtime subtring_index sum switchoffset sysdate sysdatetime sysdatetimeoffset system_user sysutcdatetime table tables tablespace tan temporary terminated tertiary_weights then time time_format time_to_sec timediff timefromparts timestamp timestampadd timestampdiff timezone_hour timezone_minute to to_base64 to_days to_seconds todatetimeoffset trailing transaction translation trigger trigger_nestlevel triggers trim truncate try_cast try_convert try_parse ucase uncompress uncompressed_length unhex unicode uninstall union unique unix_timestamp unknown unlock update upgrade upped upper usage use user user_resources using utc_date utc_time utc_timestamp uuid uuid_short validate_password_strength value values var var_pop var_samp variables variance varp version view warnings week weekday weekofyear weight_string when whenever where with work write xml xor year yearweek zon",literal:"true false null",built_in:"array bigint binary bit blob boolean char character date dec decimal float int integer interval number numeric real serial smallint varchar varying int8 serial8 text"},c:[{cN:"string",b:"'",e:"'",c:[e.BE,{b:"''"}]},{cN:"string",b:'"',e:'"',c:[e.BE,{b:'""'}]},{cN:"string",b:"`",e:"`",c:[e.BE]},e.CNM,e.CBCM,t]},e.CBCM,t]}});hljs.registerLanguage("xml",function(){var t="[A-Za-z0-9\\._:-]+",e={b:/<\?(php)?(?!\w)/,e:/\?>/,sL:"php",subLanguageMode:"continuous"},c={eW:!0,i:/</,r:0,c:[e,{cN:"attribute",b:t,r:0},{b:"=",r:0,c:[{cN:"value",c:[e],v:[{b:/"/,e:/"/},{b:/'/,e:/'/},{b:/[^\s\/>]+/}]}]}]};return{aliases:["html","xhtml","rss","atom","xsl","plist"],cI:!0,c:[{cN:"doctype",b:"<!DOCTYPE",e:">",r:10,c:[{b:"\\[",e:"\\]"}]},{cN:"comment",b:"<!--",e:"-->",r:10},{cN:"cdata",b:"<\\!\\[CDATA\\[",e:"\\]\\]>",r:10},{cN:"tag",b:"<style(?=\\s|>|$)",e:">",k:{title:"style"},c:[c],starts:{e:"</style>",rE:!0,sL:"css"}},{cN:"tag",b:"<script(?=\\s|>|$)",e:">",k:{title:"script"},c:[c],starts:{e:"</script>",rE:!0,sL:"javascript"}},e,{cN:"pi",b:/<\?\w+/,e:/\?>/,r:10},{cN:"tag",b:"</?",e:"/?>",c:[{cN:"title",b:/[^ \/><\n\t]+/,r:0},c]}]}});hljs.registerLanguage("php",function(e){var c={cN:"variable",b:"\\$+[a-zA-Z_-ÿ][a-zA-Z0-9_-ÿ]*"},i={cN:"preprocessor",b:/<\?(php)?|\?>/},a={cN:"string",c:[e.BE,i],v:[{b:'b"',e:'"'},{b:"b'",e:"'"},e.inherit(e.ASM,{i:null}),e.inherit(e.QSM,{i:null})]},n={v:[e.BNM,e.CNM]};return{aliases:["php3","php4","php5","php6"],cI:!0,k:"and include_once list abstract global private echo interface as static endswitch array null if endwhile or const for endforeach self var while isset public protected exit foreach throw elseif include __FILE__ empty require_once do xor return parent clone use __CLASS__ __LINE__ else break print eval new catch __METHOD__ case exception default die require __FUNCTION__ enddeclare final try switch continue endfor endif declare unset true false trait goto instanceof insteadof __DIR__ __NAMESPACE__ yield finally",c:[e.CLCM,e.HCM,{cN:"comment",b:"/\\*",e:"\\*/",c:[{cN:"phpdoc",b:"\\s@[A-Za-z]+"},i]},{cN:"comment",b:"__halt_compiler.+?;",eW:!0,k:"__halt_compiler",l:e.UIR},{cN:"string",b:"<<<['\"]?\\w+['\"]?$",e:"^\\w+;",c:[e.BE]},i,c,{b:/->+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/},{cN:"function",bK:"function",e:/[;{]/,eE:!0,i:"\\$|\\[|%",c:[e.UTM,{cN:"params",b:"\\(",e:"\\)",c:["self",c,e.CBCM,a,n]}]},{cN:"class",bK:"class interface",e:"{",eE:!0,i:/[:\(\$"]/,c:[{bK:"extends implements"},e.UTM]},{bK:"namespace",e:";",i:/[\.']/,c:[e.UTM]},{bK:"use",e:";",c:[e.UTM]},{b:"=>"},a,n]}});


/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/libs/Text.coffee ---- */


(function() {
  var Text,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Text = (function() {
    function Text() {}

    Text.prototype.toColor = function(text, saturation, lightness) {
      var hash, i, _i, _ref;
      if (saturation == null) {
        saturation = 30;
      }
      if (lightness == null) {
        lightness = 50;
      }
      hash = 0;
      for (i = _i = 0, _ref = text.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        hash += text.charCodeAt(i) * i;
        hash = hash % 1777;
      }
      return "hsl(" + (hash % 360) + ("," + saturation + "%," + lightness + "%)");
    };

    Text.prototype.renderMarked = function(text, options) {
      if (options == null) {
        options = {};
      }
      options["gfm"] = true;
      options["breaks"] = true;
      options["renderer"] = marked_renderer;
      text = this.fixReply(text);
      text = marked(text, options);
      text = this.emailLinks(text);
      return this.fixHtmlLinks(text);
    };

    Text.prototype.emailLinks = function(text) {
      return text.replace(/([a-zA-Z0-9]+)@zeroid.bit/g, "<a href='?to=$1' onclick='return Page.message_create.show(\"$1\")'>$1@zeroid.bit</a>");
    };

    Text.prototype.fixHtmlLinks = function(text) {
      if (window.is_proxy) {
        return text.replace(/href="http:\/\/(127.0.0.1|localhost):43110/g, 'href="http://zero');
      } else {
        return text.replace(/href="http:\/\/(127.0.0.1|localhost):43110/g, 'href="');
      }
    };

    Text.prototype.fixLink = function(link) {
      var back;
      if (window.is_proxy) {
        back = link.replace(/http:\/\/(127.0.0.1|localhost):43110/, 'http://zero');
        return back.replace(/http:\/\/zero\/([^\/]+\.bit)/, "http://$1");
      } else {
        return link.replace(/http:\/\/(127.0.0.1|localhost):43110/, '');
      }
    };

    Text.prototype.toUrl = function(text) {
      return text.replace(/[^A-Za-z0-9]/g, "+").replace(/[+]+/g, "+").replace(/[+]+$/, "");
    };

    Text.prototype.getSiteUrl = function(address) {
      if (window.is_proxy) {
        if (__indexOf.call(address, ".") >= 0) {
          return "http://" + address;
        } else {
          return "http://zero/" + address;
        }
      } else {
        return "/" + address;
      }
    };

    Text.prototype.fixReply = function(text) {
      return text.replace(/(>.*\n)([^\n>])/gm, "$1\n$2");
    };

    Text.prototype.toBitcoinAddress = function(text) {
      return text.replace(/[^A-Za-z0-9]/g, "");
    };

    Text.prototype.jsonEncode = function(obj) {
      return unescape(encodeURIComponent(JSON.stringify(obj)));
    };

    Text.prototype.jsonDecode = function(obj) {
      return JSON.parse(decodeURIComponent(escape(obj)));
    };

    Text.prototype.fileEncode = function(obj) {
      if (typeof obj === "string") {
        return btoa(unescape(encodeURIComponent(obj)));
      } else {
        return btoa(unescape(encodeURIComponent(JSON.stringify(obj, void 0, '\t'))));
      }
    };

    Text.prototype.utf8Encode = function(s) {
      return unescape(encodeURIComponent(s));
    };

    Text.prototype.utf8Decode = function(s) {
      return decodeURIComponent(escape(s));
    };

    Text.prototype.distance = function(s1, s2) {
      var char, extra_parts, key, match, next_find, next_find_i, val, _i, _len;
      s1 = s1.toLocaleLowerCase();
      s2 = s2.toLocaleLowerCase();
      next_find_i = 0;
      next_find = s2[0];
      match = true;
      extra_parts = {};
      for (_i = 0, _len = s1.length; _i < _len; _i++) {
        char = s1[_i];
        if (char !== next_find) {
          if (extra_parts[next_find_i]) {
            extra_parts[next_find_i] += char;
          } else {
            extra_parts[next_find_i] = char;
          }
        } else {
          next_find_i++;
          next_find = s2[next_find_i];
        }
      }
      if (extra_parts[next_find_i]) {
        extra_parts[next_find_i] = "";
      }
      extra_parts = (function() {
        var _results;
        _results = [];
        for (key in extra_parts) {
          val = extra_parts[key];
          _results.push(val);
        }
        return _results;
      })();
      if (next_find_i >= s2.length) {
        return extra_parts.length + extra_parts.join("").length;
      } else {
        return false;
      }
    };

    Text.prototype.parseQuery = function(query) {
      var key, params, part, parts, val, _i, _len, _ref;
      params = {};
      parts = query.split('&');
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        part = parts[_i];
        _ref = part.split("="), key = _ref[0], val = _ref[1];
        if (val) {
          params[decodeURIComponent(key)] = decodeURIComponent(val);
        } else {
          params["url"] = decodeURIComponent(key);
        }
      }
      return params;
    };

    Text.prototype.encodeQuery = function(params) {
      var back, key, val;
      back = [];
      if (params.url) {
        back.push(params.url);
      }
      for (key in params) {
        val = params[key];
        if (!val || key === "url") {
          continue;
        }
        back.push((encodeURIComponent(key)) + "=" + (encodeURIComponent(val)));
      }
      return back.join("&");
    };

    return Text;

  })();

  window.is_proxy = document.location.host === "zero" || window.location.pathname === "/";

  window.Text = new Text();

}).call(this);


/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/lib/DateSince.coffee ---- */


(function() {
  var DateSince;

  DateSince = (function() {
    function DateSince(_at_elem, _at_time) {
      this.elem = _at_elem;
      this.time = _at_time;
      this.render();
      date_since_db.push(this);
    }

    DateSince.prototype.formatSince = function(time) {
      var back, now, secs;
      now = +(new Date) / 1000;
      secs = now - time;
      if (secs < 60) {
        back = "Just now";
      } else if (secs < 60 * 60) {
        back = (Math.round(secs / 60)) + " minutes ago";
      } else if (secs < 60 * 60 * 24) {
        back = (Math.round(secs / 60 / 60)) + " hours ago";
      } else if (secs < 60 * 60 * 24 * 3) {
        back = (Math.round(secs / 60 / 60 / 24)) + " days ago";
      } else {
        back = "on " + this.formatDate(time);
      }
      back = back.replace(/^1 ([a-z]+)s/, "1 $1");
      return back;
    };

    DateSince.prototype.formatDate = function(timestamp, format) {
      var display, parts;
      if (format == null) {
        format = "short";
      }
      parts = (new Date(timestamp * 1000)).toString().split(" ");
      if (format === "short") {
        display = parts.slice(1, 4);
      } else {
        display = parts.slice(1, 5);
      }
      return display.join(" ").replace(/( [0-9]{4})/, ",$1");
    };

    DateSince.prototype.render = function() {
      return this.elem.textContent = this.formatSince(this.time);
    };

    return DateSince;

  })();

  window.date_since_db = [];

  setInterval((function() {
    var date_since, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = date_since_db.length; _i < _len; _i++) {
      date_since = date_since_db[_i];
      _results.push(date_since.render());
    }
    return _results;
  }), 1000);

  window.DateSince = DateSince;

}).call(this);


/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/lib/Utils.coffee ---- */


(function() {
  window.cmp = function(a, b) {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  };


  /* 
  Array::sortBy = (key, options={}) ->
    @sort (a, b) ->
      [av, bv] = [a[key], b[key]]
      [av, bv] = [av.toLowerCase(), bv.toLowerCase()] if options.lower
      cmp av, bv */

}).call(this);


/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/lib/ZeroFrame.coffee ---- */

/*
(function() {
  var ZeroFrame,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  ZeroFrame = (function() {
    function ZeroFrame(url) {
      this.onCloseWebsocket = __bind(this.onCloseWebsocket, this);
      this.onOpenWebsocket = __bind(this.onOpenWebsocket, this);
      this.route = __bind(this.route, this);
      this.onMessage = __bind(this.onMessage, this);
      this.url = url;
      this.waiting_cb = {};
      this.connect();
      this.next_message_id = 1;
      this.init();
    }
*/

/* zeronet api */
var _bind = function(fn, me){ 
    return function() { 
        return fn.apply(me, arguments); 
    }; 
}

var _slice = [].slice;

function ZeroFrame() {
    this.onCloseWebsocket = _bind(this.onCloseWebsocket, this);
    this.onOpenWebsocket  = _bind(this.onOpenWebsocket, this);
    this.route            = _bind(this.route, this);
    this.onMessage        = _bind(this.onMessage, this);
    this.waiting_cb       = {};
    this.wrapper_nonce    = document.location.href.replace(/.*wrapper_nonce=([A-Za-z0-9]+).*/, "$1");
    this.connect();
    this.next_message_id = 1;
    this.init();
}

    ZeroFrame.prototype.init = function() {
      return this;
    };

    ZeroFrame.prototype.connect = function() {
      this.target = window.parent;
      window.addEventListener("message", this.onMessage, false);
      return this.cmd("innerReady");
      
      /*
      window.addEventListener("beforeunload", (function(_this) {
        return function(e) {
          _this.log("save scrollTop", window.pageYOffset);
          _this.history_state["scrollTop"] = window.pageYOffset;
          return _this.cmd("wrapperReplaceState", [_this.history_state, null]);
        };
      })(this));
      return this.cmd("wrapperGetState", [], (function(_this) {
        return function(state) {
          if (state != null) {
            _this.history_state = state;
          }
          _this.log("restore scrollTop", state, window.pageYOffset);
          if (window.pageYOffset === 0 && state) {
            return window.scroll(window.pageXOffset, state.scrollTop);
          }
        };
      })(this));
      */
    
    };

    ZeroFrame.prototype.onMessage = function(e) {
      var cmd, message;
      message = e.data;
      cmd = message.cmd;
      if (cmd === "response") {
        if (this.waiting_cb[message.to] != null) {
          return this.waiting_cb[message.to](message.result);
        } else {
          return this.log("Websocket callback not found:", message);
        }
      } else if (cmd === "wrapperReady") {
        return this.cmd("innerReady");
      } else if (cmd === "ping") {
        return this.response(message.id, "pong");
      } else if (cmd === "wrapperOpenedWebsocket") {
        return this.onOpenWebsocket();
      } else if (cmd === "wrapperClosedWebsocket") {
        return this.onCloseWebsocket();
      } else {
        return this.route(cmd, message);
      }
    };

    ZeroFrame.prototype.route = function(cmd, message) {
      if (cmd === "setSiteInfo") {
        if (message.params.cert_user_id) {
            $("#logget").removeClass("hide");
            $("#no-login").addClass("hide");
            $(".nickbar span").html(message.params.cert_user_id.replace('@zeroid.bit', ''));
            this.log("log in");
        } else {
            $("#logget").addClass("hide");
            $("#no-login").removeClass("hide");
            this.log("no log");
        }
      } else {
        return this.log("Unknown command: " + cmd, message);
      }
    };

    ZeroFrame.prototype.response = function(to, result) {
      return this.send({
        "cmd": "response",
        "to": to,
        "result": result
      });
    };

    ZeroFrame.prototype.cmd = function(cmd, params, cb) {
      if (params == null) {
        params = {};
      }
      if (cb == null) {
        cb = null;
      }
      return this.send({
        "cmd": cmd,
        "params": params
      }, cb);
    };

    ZeroFrame.prototype.send = function(message, cb) {
      if (cb == null) {
        cb = null;
      }
      message.wrapper_nonce = this.wrapper_nonce;
      message.id = this.next_message_id;
      this.next_message_id += 1;
      this.target.postMessage(message, "*");
      if (cb) {
        return this.waiting_cb[message.id] = cb;
      }
    };

    ZeroFrame.prototype.log = function() {
      var args;
      args = 1 <= arguments.length ? _slice.call(arguments, 0) : [];
      return console.log.apply(console, ["[ZeroFrame]"].concat(_slice.call(args)));
    };

    ZeroFrame.prototype.onOpenWebsocket = function() {
      return this.log("Websocket open");
    };

    ZeroFrame.prototype.onCloseWebsocket = function() {
      return this.log("Websocket close");
    };

/*    
    return ZeroFrame;
  })();
  window.ZeroFrame = ZeroFrame;
}).call(this);
*/


/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/lib/identicon.js ---- */


/**
 * Identicon.js v1.0
 * http://github.com/stewartlord/identicon.js
 *
 * Requires PNGLib
 * http://www.xarg.org/download/pnglib.js
 *
 * Copyright 2013, Stewart Lord
 * Released under the BSD license
 * http://www.opensource.org/licenses/bsd-license.php
 */

(function() {
    Identicon = function(hash, size, margin){
        this.hash   = hash;
        this.size   = size   || 64;
        this.margin = margin || .08;
    }

    Identicon.prototype = {
        hash:   null,
        size:   null,
        margin: null,

        render: function(){
            var hash    = this.hash,
                size    = this.size,
                margin  = Math.floor(size * this.margin),
                cell    = Math.floor((size - (margin * 2)) / 5),
                image   = new PNGlib(size, size, 256);

            // light-grey background
            var bg      = image.color(240, 240, 240);

            // foreground is last 7 chars as hue at 50% saturation, 70% brightness
            var rgb     = this.hsl2rgb(parseInt(hash.substr(-7), 16) / 0xfffffff, .5, .7),
                fg      = image.color(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);

            // the first 15 characters of the hash control the pixels (even/odd)
            // they are drawn down the middle first, then mirrored outwards
            var i, color;
            for (i = 0; i < 15; i++) {
                color = parseInt(hash.charAt(i), 16) % 2 ? bg : fg;
                if (i < 5) {
                    this.rectangle(2 * cell + margin, i * cell + margin, cell, cell, color, image);
                } else if (i < 10) {
                    this.rectangle(1 * cell + margin, (i - 5) * cell + margin, cell, cell, color, image);
                    this.rectangle(3 * cell + margin, (i - 5) * cell + margin, cell, cell, color, image);
                } else if (i < 15) {
                    this.rectangle(0 * cell + margin, (i - 10) * cell + margin, cell, cell, color, image);
                    this.rectangle(4 * cell + margin, (i - 10) * cell + margin, cell, cell, color, image);
                }
            }

            return image;
        },

        rectangle: function(x, y, w, h, color, image) {
            var i, j;
            for (i = x; i < x + w; i++) {
                for (j = y; j < y + h; j++) {
                    image.buffer[image.index(i, j)] = color;
                }
            }
        },

        // adapted from: https://gist.github.com/aemkei/1325937
        hsl2rgb: function(h, s, b){
            h *= 6;
            s = [
                b += s *= b < .5 ? b : 1 - b,
                b - h % 1 * s * 2,
                b -= s *= 2,
                b,
                b + h % 1 * s,
                b + s
            ];

            return[
                s[ ~~h    % 6 ],  // red
                s[ (h|16) % 6 ],  // green
                s[ (h|8)  % 6 ]   // blue
            ];
        },

        toString: function(){
            return this.render().getBase64();
        }
    }

    window.Identicon = Identicon;
})();


/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/SiteMenu.coffee ---- */


(function() {
  var Menu, SiteMenu,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Menu = (function() {
    function Menu(button) {
      this.button = button;
      this.elem = $(".menu.template").clone().removeClass("template");
      this.elem.appendTo("body");
    }

    Menu.prototype.show = function() {
      var button_pos;
      if (window.visible_menu) {
        this.log("visible_menu", window.visible_menu.button, this.button);
      }
      if (window.visible_menu && window.visible_menu.button[0] === this.button[0]) {
        window.visible_menu.hide();
        return this.hide();
      } else {
        button_pos = this.button.offset();
        this.elem.css({
          "top": button_pos.top + this.button.outerHeight(),
          "left": button_pos.left
        });
        this.button.addClass("menu-active");
        this.elem.addClass("visible");
        if (window.visible_menu) {
          window.visible_menu.hide();
        }
        return window.visible_menu = this;
      }
    };

    Menu.prototype.hide = function() {
      this.elem.removeClass("visible");
      this.button.removeClass("menu-active");
      return window.visible_menu = null;
    };

    Menu.prototype.addItem = function(title, cb) {
      var item;
      item = $(".menu-item.template", this.elem).clone().removeClass("template");
      item.html(title);
      item.on("click", (function(_this) {
        return function() {
          _this.hide();
          cb();
          return false;
        };
      })(this));
      item.appendTo(this.elem);
      return item;
    };

    Menu.prototype.log = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return console.log.apply(console, ["[Menu]"].concat(__slice.call(args)));
    };

    return Menu;

  })();

  SiteMenu = (function(_super) {
    __extends(SiteMenu, _super);

    function SiteMenu(elem, site) {
      var _ref;
      SiteMenu.__super__.constructor.call(this, $(".hamburger", elem));
      this.elem.addClass("menu-site");
      // update
      this.addItem("Update", (function() {
        return window.zero_hello.siteUpdate(site.address);
      }));
      
      // favorite (testing)
      // if (Page.local_storage.favorite_sites[site]) {
        this.addItem("Favorite", (function() {
            return window.zero_hello.siteFavorite(site.address);
        }));
      // } else {
        // this.addItem("Unfavorite", (function() {
        //   return window.zero_hello.siteFavorite(site.address);
        // }));
      // }
      
      // pause
      if (site.settings.serving) {
        this.addItem("Pause", (function() {
          return window.zero_hello.sitePause(site.address);
        }));
      } else { // resume
        this.addItem("Resume", (function() {
          return window.zero_hello.siteResume(site.address);
        }));
      }
      // clone
      if ((_ref = site.content) != null ? _ref.cloneable : void 0) {
        if (zero_hello.server_info.rev < 200) {
          this.addItem("Clone", (function() {
            return window.zero_hello.cmd("wrapperNotification", ["info", "Please update to version 0.3.1 to use the site clone feature!"]);
          }));
        } else {
          this.addItem("Clone", (function() {
            return window.zero_hello.siteClone(site.address);
          }));
        }
      }
      // delete
      this.addItem("Delete", (function() {
        return window.zero_hello.siteDelete(site.address);
      })).addClass("menu-item-separator");
    }

    return SiteMenu;

  })(Menu);

  window.visible_menu = null;

  window.SiteMenu = SiteMenu;

  window.Menu = Menu;

  $("body").on("click", function(e) {
    if (window.visible_menu && e.target !== window.visible_menu.button[0] && $(e.target).parent()[0] !== window.visible_menu.elem[0]) {
      return window.visible_menu.hide();
    }
  });

}).call(this);



/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/utils/Class.coffee ---- */


(function() {
  var Class,
    slice = [].slice;

  Class = (function() {
    function Class() {}

    Class.prototype.trace = true;

    Class.prototype.log = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (!this.trace) {
        return;
      }
      if (typeof console === 'undefined') {
        return;
      }
      args.unshift("[" + this.constructor.name + "]");
      console.log.apply(console, args);
      return this;
    };

    Class.prototype.logStart = function() {
      var args, name;
      name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      if (!this.trace) {
        return;
      }
      this.logtimers || (this.logtimers = {});
      this.logtimers[name] = +(new Date);
      if (args.length > 0) {
        this.log.apply(this, ["" + name].concat(slice.call(args), ["(started)"]));
      }
      return this;
    };

    Class.prototype.logEnd = function() {
      var args, ms, name;
      name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      ms = +(new Date) - this.logtimers[name];
      this.log.apply(this, ["" + name].concat(slice.call(args), ["(Done in " + ms + "ms)"]));
      return this;
    };

    return Class;

  })();

  window.Class = Class;

}).call(this);



/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/utils/Follow.coffee ---- */


(function() {
  var Follow,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Follow = (function(superClass) {
    extend(Follow, superClass);

    function Follow(elem) {
      this.elem = elem;
      this.handleMenuClick = bind(this.handleMenuClick, this);
      this.init = bind(this.init, this);
      this.menu = new Menu(this.elem);
      this.feeds = {};
      this.follows = {};
      this.elem.on("click", (function(_this) {
        return function() {
          if (Page.server_info.rev > 850) {
            if (_this.elem.hasClass("following")) {
              _this.showFeeds();
            } else {
              _this.followDefaultFeeds();
            }
          } else {
            Page.cmd("wrapperNotification", ["info", "Please update your ZeroNet client to use this feature"]);
          }
          return false;
        };
      })(this));
    }

    Follow.prototype.init = function() {
      if (!this.feeds) {
        return;
      }
      return Page.cmd("feedListFollow", [], (function(_this) {
        return function(follows1) {
          var is_default_feed, menu_item, param, query, ref, ref1, title;
          _this.follows = follows1;
          ref = _this.feeds;
          for (title in ref) {
            ref1 = ref[title], query = ref1[0], menu_item = ref1[1], is_default_feed = ref1[2], param = ref1[3];
            if (_this.follows[title] && indexOf.call(_this.follows[title][1], param) >= 0) {
              menu_item.addClass("selected");
            } else {
              menu_item.removeClass("selected");
            }
          }
          _this.updateListitems();
          return _this.elem.css("display", "inline-block");
        };
      })(this));
    };

    Follow.prototype.addFeed = function(title, query, is_default_feed, param) {
      var menu_item;
      if (is_default_feed == null) {
        is_default_feed = false;
      }
      if (param == null) {
        param = "";
      }
      menu_item = this.menu.addItem(title, this.handleMenuClick);
      return this.feeds[title] = [query, menu_item, is_default_feed, param];
    };

    Follow.prototype.handleMenuClick = function(item) {
      item.toggleClass("selected");
      this.updateListitems();
      this.saveFeeds();
      return true;
    };

    Follow.prototype.showFeeds = function() {
      return this.menu.show();
    };

    Follow.prototype.followDefaultFeeds = function() {
      var is_default_feed, menu_item, param, query, ref, ref1, title;
      ref = this.feeds;
      for (title in ref) {
        ref1 = ref[title], query = ref1[0], menu_item = ref1[1], is_default_feed = ref1[2], param = ref1[3];
        if (is_default_feed) {
          menu_item.addClass("selected");
          this.log("Following", title);
        }
      }
      this.updateListitems();
      return this.saveFeeds();
    };

    Follow.prototype.updateListitems = function() {
      if (this.menu.elem.find(".selected").length > 0) {
        return this.elem.addClass("following");
      } else {
        return this.elem.removeClass("following");
      }
    };

    Follow.prototype.saveFeeds = function() {
      return Page.cmd("feedListFollow", [], (function(_this) {
        return function(follows) {
          var is_default_feed, item, menu_item, param, params, query, ref, ref1, title;
          _this.follows = follows;
          ref = _this.feeds;
          for (title in ref) {
            ref1 = ref[title], query = ref1[0], menu_item = ref1[1], is_default_feed = ref1[2], param = ref1[3];
            if (follows[title]) {
              params = (function() {
                var i, len, ref2, results;
                ref2 = follows[title][1];
                results = [];
                for (i = 0, len = ref2.length; i < len; i++) {
                  item = ref2[i];
                  if (item !== param) {
                    results.push(item);
                  }
                }
                return results;
              })();
            } else {
              params = [];
            }
            if (menu_item.hasClass("selected")) {
              params.push(param);
            }
            if (params.length === 0) {
              delete follows[title];
            } else {
              follows[title] = [query, params];
            }
          }
          return Page.cmd("feedFollow", [follows]);
        };
      })(this));
    };

    return Follow;

  })(Class);

  window.Follow = Follow;

}).call(this);



/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/utils/InlineEditor.coffee ---- */


(function() {
  var InlineEditor,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  InlineEditor = (function() {
    function InlineEditor(elem1, getContent, saveContent, getObject) {
      this.elem = elem1;
      this.getContent = getContent;
      this.saveContent = saveContent;
      this.getObject = getObject;
      this.cancelEdit = bind(this.cancelEdit, this);
      this.deleteObject = bind(this.deleteObject, this);
      this.saveEdit = bind(this.saveEdit, this);
      this.stopEdit = bind(this.stopEdit, this);
      this.startEdit = bind(this.startEdit, this);
      this.edit_button = $("<a href='#Edit' class='editable-edit icon-edit'></a>");
      this.edit_button.on("click", this.startEdit);
      this.elem.addClass("editable").before(this.edit_button);
      this.editor = null;
      this.elem.on("mouseenter", (function(_this) {
        return function(e) {
          var scrolltop, top;
          _this.edit_button.css("opacity", "0.4");
          scrolltop = $(window).scrollTop();
          top = _this.edit_button.offset().top - parseInt(_this.edit_button.css("margin-top"));
          if (scrolltop > top) {
            return _this.edit_button.css("margin-top", scrolltop - top + e.clientY - 20);
          } else {
            return _this.edit_button.css("margin-top", "");
          }
        };
      })(this));
      this.elem.on("mouseleave", (function(_this) {
        return function() {
          return _this.edit_button.css("opacity", "");
        };
      })(this));
      if (this.elem.is(":hover")) {
        this.elem.trigger("mouseenter");
      }
    }

    InlineEditor.prototype.startEdit = function() {
      var j, results;
      this.content_before = this.elem.html();
      this.editor = $("<textarea class='editor'></textarea>");
      this.editor.val(this.getContent(this.elem, "raw"));
      this.elem.after(this.editor);
      $(".editbg").css("display", "block").cssLater("opacity", 0.9, 10);
      this.elem.html((function() {
        results = [];
        for (j = 1; j <= 50; j++){ results.push(j); }
        return results;
      }).apply(this).join("fill the width"));
      this.copyStyle(this.elem, this.editor);
      this.elem.html(this.content_before);
      this.autoExpand(this.editor);
      this.elem.css("display", "none");
      if ($(window).scrollTop() === 0) {
        this.editor[0].selectionEnd = 0;
        this.editor.focus();
      }
      $(".editable-edit").css("display", "none");
      $(".editbar").css("display", "inline-block").addClassLater("visible", 10);
      $(".publishbar").css("opacity", 0);
      $(".editbar .object").text(this.getObject(this.elem).data("object") + "." + this.elem.data("editable"));
      $(".editbar .button").removeClass("loading");
      $(".editbar .save").off("click").on("click", this.saveEdit);
      $(".editbar .delete").off("click").on("click", this.deleteObject);
      $(".editbar .cancel").off("click").on("click", this.cancelEdit);
      if (this.getObject(this.elem).data("deletable")) {
        $(".editbar .delete").css("display", "").html("Delete " + this.getObject(this.elem).data("object").split(":")[0]);
      } else {
        $(".editbar .delete").css("display", "none");
      }
      window.onbeforeunload = function() {
        return 'Your unsaved blog changes will be lost!';
      };
      return false;
    };

    InlineEditor.prototype.stopEdit = function() {
      if (this.editor) {
        this.editor.remove();
      }
      this.editor = null;
      this.elem.css("display", "");
      $(".editbg").css("opacity", 0).cssLater("display", "none", 300);
      $(".editable-edit").css("display", "");
      $(".editbar").cssLater("display", "none", 1000).removeClass("visible");
      $(".publishbar").css("opacity", 1);
      return window.onbeforeunload = null;
    };

    InlineEditor.prototype.saveEdit = function() {
      var content;
      content = this.editor.val();
      $(".editbar .save").addClass("loading");
      this.saveContent(this.elem, content, (function(_this) {
        return function(content_html) {
          if (content_html) {
            $(".editbar .save").removeClass("loading");
            _this.stopEdit();
            if (typeof content_html === "string") {
              _this.elem.html(content_html);
            }
            return $('pre code').each(function(i, block) {
              return hljs.highlightBlock(block);
            });
          } else {
            return $(".editbar .save").removeClass("loading");
          }
        };
      })(this));
      return false;
    };

    InlineEditor.prototype.deleteObject = function() {
      var object_type;
      object_type = this.getObject(this.elem).data("object").split(":")[0];
      Page.cmd("wrapperConfirm", ["Are you sure you sure to delete this " + object_type + "?", "Delete"], (function(_this) {
        return function(confirmed) {
          $(".editbar .delete").addClass("loading");
          return Page.saveContent(_this.getObject(_this.elem), null, function() {
            return _this.stopEdit();
          });
        };
      })(this));
      return false;
    };

    InlineEditor.prototype.cancelEdit = function() {
      this.stopEdit();
      this.elem.html(this.content_before);
      $('pre code').each(function(i, block) {
        return hljs.highlightBlock(block);
      });
      return false;
    };

    InlineEditor.prototype.copyStyle = function(elem_from, elem_to) {
      var from_style;
      elem_to.addClass(elem_from[0].className);
      from_style = getComputedStyle(elem_from[0]);
      elem_to.css({
        fontFamily: from_style.fontFamily,
        fontSize: from_style.fontSize,
        fontWeight: from_style.fontWeight,
        marginTop: from_style.marginTop,
        marginRight: from_style.marginRight,
        marginBottom: from_style.marginBottom,
        marginLeft: from_style.marginLeft,
        paddingTop: from_style.paddingTop,
        paddingRight: from_style.paddingRight,
        paddingBottom: from_style.paddingBottom,
        paddingLeft: from_style.paddingLeft,
        lineHeight: from_style.lineHeight,
        textAlign: from_style.textAlign,
        color: from_style.color,
        letterSpacing: from_style.letterSpacing
      });
      if (elem_from.innerWidth() < 1000) {
        return elem_to.css("minWidth", elem_from.innerWidth());
      }
    };

    InlineEditor.prototype.autoExpand = function(elem) {
      var editor;
      editor = elem[0];
      elem.height(1);
      elem.on("input", function() {
        if (editor.scrollHeight > elem.height()) {
          return elem.height(1).height(editor.scrollHeight + parseFloat(elem.css("borderTopWidth")) + parseFloat(elem.css("borderBottomWidth")));
        }
      });
      elem.trigger("input");
      return elem.on('keydown', function(e) {
        var s, val;
        if (e.which === 9) {
          e.preventDefault();
          s = this.selectionStart;
          val = elem.val();
          elem.val(val.substring(0, this.selectionStart) + "\t" + val.substring(this.selectionEnd));
          return this.selectionEnd = s + 1;
        }
      });
    };

    return InlineEditor;

  })();

  window.InlineEditor = InlineEditor;

}).call(this);




/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/User.coffee ---- */


(function() {
  var User,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  User = (function(superClass) {
    extend(User, superClass);

    function User() {
      this.my_topic_votes = {};
      this.my_comment_votes = {};
      this.rules = {};
      this.certselectButtons();
    }

    User.prototype.updateMyInfo = function(cb) {
      if (cb == null) {
        cb = null;
      }
      this.log("Updating user info...", this.my_address);
      return this.updateMyVotes(cb);
    };

    User.prototype.updateMyVotes = function(cb) {
      var query;
      if (cb == null) {
        cb = null;
      }
      query = "SELECT 'topics_vote' AS type, topic_uri AS uri FROM json LEFT JOIN topic_vote USING (json_id) WHERE directory = \"" + Page.site_info.auth_address + "\" AND file_name = 'data.json'\nUNION\nSELECT 'comment_vote' AS type, comment_uri AS uri FROM json LEFT JOIN comment_vote USING (json_id) WHERE directory = \"" + Page.site_info.auth_address + "\" AND file_name = 'data.json'";
      Page.cmd("dbQuery", [query], (function(_this) {
        return function(votes) {
          var i, len, results, vote;
          results = [];
          for (i = 0, len = votes.length; i < len; i++) {
            vote = votes[i];
            if (vote.type === "topic_vote") {
              results.push(_this.my_topic_votes[vote.uri] = true);
            } else {
              results.push(_this.my_comment_votes[vote.uri] = true);
            }
          }
          return results;
        };
      })(this));
      if (cb) {
        return cb();
      }
    };

    User.prototype.certselectButtons = function() {
      return $(".certselect").on("click", (function(_this) {
        return function() {
          if (Page.server_info.rev < 160) {
            Page.cmd("wrapperNotification", ["error", "Comments requires at least ZeroNet 0.3.0 Please upgade!"]);
          } else {
            Page.cmd("certSelect", [["zeroid.bit"]]);
          }
          return false;
        };
      })(this));
    };

    User.prototype.checkCert = function(type) {
      var last_cert_user_id;
      last_cert_user_id = $(".user_name-my").text();
      console.log(Page);
      console.log(Page.site_info);
      if ($(".comment-new .user_name").text() !== Page.site_info.cert_user_id || type === "updaterules") {
        if (Page.site_info.cert_user_id) {
          $(".comment-new").removeClass("comment-nocert");
          $(".user_name-my").text(Page.site_info.cert_user_id).css({
            "color": Text.toColor(Page.site_info.cert_user_id)
          });
        } else {
          $(".comment-new").addClass("comment-nocert");
          $(".user_name-my").text("Please sign in");
        }
        if (Page.site_info.cert_user_id) {
          return Page.cmd("fileRules", "data/users/" + Page.site_info.auth_address + "/content.json", (function(_this) {
            return function(rules) {
              _this.rules = rules;
              if (rules.max_size) {
                return _this.setCurrentSize(rules.current_size);
              } else {
                return _this.setCurrentSize(0);
              }
            };
          })(this));
        } else {
          return this.setCurrentSize(0);
        }
      }
    };

    User.prototype.setCurrentSize = function(current_size) {
      var current_size_kb, percent;
      if (current_size) {
        current_size_kb = current_size / 1000;
        $(".user-size").text("used: " + (current_size_kb.toFixed(1)) + "k/" + (Math.round(this.rules.max_size / 1000)) + "k").attr("title", "Every new user has limited space to store comments, topics and votes.\n" + "This indicator shows your used/total allowed KBytes.\n" + "The site admin can increase it if you about to run out of it.");
        percent = Math.round(100 * current_size / this.rules.max_size);
        $(".user-size-used").css("width", percent + "%");
        if (percent > 80) {
          return $(".user-size-warning").css("display", "block").find("a").text(Page.site_info.content.settings.admin).attr("href", Text.fixLink(Page.site_info.content.settings.admin_href));
        }
      } else {
        return $(".user-size").text("");
      }
    };

    User.prototype.getData = function(cb) {
      var inner_path;
      inner_path = "data/users/" + Page.site_info.auth_address + "/data.json";
      return Page.cmd("fileGet", {
        "inner_path": inner_path,
        "required": false
      }, (function(_this) {
        return function(data) {
          if (data) {
            data = JSON.parse(data);
          } else {
            data = {
              "next_topic_id": 1,
              "topic": [],
              "topic_vote": {},
              "next_comment_id": 1,
              "comment": {},
              "comment_vote": {}
            };
          }
          return cb(data);
        };
      })(this));
    };

    User.prototype.publishData = function(data, cb) {
      var inner_path;
      inner_path = "data/users/" + Page.site_info.auth_address + "/data.json";
      return Page.writePublish(inner_path, Text.jsonEncode(data), (function(_this) {
        return function(res) {
          _this.checkCert("updaterules");
          if (cb) {
            return cb(res);
          }
        };
      })(this));
    };

    return User;

  })(Class);

  window.User = new User();

}).call(this);


/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/TopicList.coffee ---- */


$(window).scroll(function(){
    if ($(this).scrollTop() > 1000) {
        $('.scrollToTop').fadeIn();
    } else {
        $('.scrollToTop').fadeOut();
    }
});
$('.scrollToTop').click(function(){
    $('html, body').animate({scrollTop : 0},900);
    return false;
});

/*
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}
*/

// redraw x3 bug
var globel = [];
var lastid = "";

(function() {
  var TopicList,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TopicList = (function(superClass) {
    extend(TopicList, superClass);

    function TopicList() {
      this.submitTopicVote = bind(this.submitTopicVote, this);
      this.thread_sorter = null;
      this.parent_topic_uri = void 0;
      this.list_all = false;
      this.topic_parent_uris = {};
      this.topic_sticky_uris = {};
    }

    TopicList.prototype.actionList = function(parent_topic_id, parent_topic_user_address) {
      var i, len, ref, topic_sticky_uri;
      ref = Page.site_info.content.settings.topic_sticky_uris;
      for (i = 0, len = ref.length; i < len; i++) {
        topic_sticky_uri = ref[i];
        this.topic_sticky_uris[topic_sticky_uri] = 1;
      }
      $(".topics-loading").cssLater("top", "0px", 200);
      if (parent_topic_id) {
        $(".topics-title").html("&nbsp;");
        this.parent_topic_uri = parent_topic_id + "_" + parent_topic_user_address;
        Page.local_storage["topic." + parent_topic_id + "_" + parent_topic_user_address + ".visited"] = Time.timestamp();
        Page.cmd("wrapperSetLocalStorage", Page.local_storage);
      } else {
        $(".topics-title").html("Newest posts");
      }
      this.loadTopics("noanim");
      $(".topic-new-link").on("click", (function(_this) {
        return function() {
          $(".topic-new").fancySlideDown();
          $(".topic-new-link").slideUp();
          return false;
        };
      })(this));
      $(".topic-new .button-submit").on("click", (function(_this) {
        return function() {
          _this.submitCreateTopic();
          return false;
        };
      })(this));
      $(".topics-more").on("click", (function(_this) {
        return function() {
          _this.list_all = true;
          $(".topics-more").text("Loading...");
          _this.loadTopics("noanim");
          return false;
        };
      })(this));
      return this.initFollowButton();
    };

    TopicList.prototype.initFollowButton = function() {
      var username;
      this.follow = new Follow($(".feed-follow-list"));
      if (this.parent_topic_uri) {
        this.follow.addFeed("New topics in this group", "SELECT title AS title, body, added AS date_added, 'topics' AS image_thumb, '?Topic:' || topics.topic_id || '_' || topic_creator_json.directory AS url, parent_topic_uri AS param FROM topics LEFT JOIN json AS topic_creator_json ON (topic_creator_json.json_id = topics.json_id) WHERE parent_topic_uri IN (:params)", true, this.parent_topic_uri);
      } else {
        this.follow.addFeed("New topics", "SELECT title AS title, body, added AS date_added, 'topics' AS image_thumb, '?Topic:' || topics.topic_id || '_' || topic_creator_json.directory AS url FROM topics LEFT JOIN json AS topic_creator_json ON (topic_creator_json.json_id = topics.json_id) WHERE parent_topic_uri IS NULL", true);
        if (Page.site_info.cert_user_id) {
          username = Page.site_info.cert_user_id.replace(/@.*/, "");
          this.follow.addFeed("Username mentions", "SELECT 'mention' AS type, comment.added AS date_added, topics.title, commenter_user.value || ': ' || comment.body AS body, topic_creator_json.directory AS topic_creator_address, topics.topic_id || '_' || topic_creator_json.directory AS row_topic_uri, '?Topic:' || topics.topic_id || '_' || topic_creator_json.directory AS url FROM topics LEFT JOIN json AS topic_creator_json ON (topic_creator_json.json_id = topics.json_id) LEFT JOIN comment ON (comment.topic_uri = row_topic_uri) LEFT JOIN json AS commenter_json ON (commenter_json.json_id = comment.json_id) LEFT JOIN json AS commenter_content ON (commenter_content.directory = commenter_json.directory AND commenter_content.file_name = 'content.json') LEFT JOIN keyvalue AS commenter_user ON (commenter_user.json_id = commenter_content.json_id AND commenter_user.key = 'cert_user_id') WHERE comment.body LIKE '%[" + username + "%' OR comment.body LIKE '%@" + username + "%'", true);
        }
        this.follow.addFeed("All comments", "SELECT 'comment' AS type, comment.added AS date_added, topics.title, commenter_user.value || ': ' || comment.body AS body, topic_creator_json.directory AS topic_creator_address, topics.topic_id || '_' || topic_creator_json.directory AS row_topic_uri, '?Topic:' || topics.topic_id || '_' || topic_creator_json.directory AS url FROM topics LEFT JOIN json AS topic_creator_json ON (topic_creator_json.json_id = topics.json_id) LEFT JOIN comment ON (comment.topic_uri = row_topic_uri) LEFT JOIN json AS commenter_json ON (commenter_json.json_id = comment.json_id) LEFT JOIN json AS commenter_content ON (commenter_content.directory = commenter_json.directory AND commenter_content.file_name = 'content.json') LEFT JOIN keyvalue AS commenter_user ON (commenter_user.json_id = commenter_content.json_id AND commenter_user.key = 'cert_user_id')");
      }
      return this.follow.init();
    };

    TopicList.prototype.loadTopics = function(type, cb) {
      var last_elem, query, where;
      if (type == null) {
        type = "list";
      }
      if (cb == null) {
        cb = false;
      }
      this.logStart("Load topics...");
      if (this.parent_topic_uri) {
        where = "WHERE parent_topic_uri = '" + this.parent_topic_uri + "' OR row_topic_uri = '" + this.parent_topic_uri + "'";
      } else {
        where = "WHERE topics.parent_topic_uri IS NULL AND (comment.added < " + (Date.now() / 1000 + 120) + " OR comment.added IS NULL)";
      }
      last_elem = $(".topics-list .topic.template");
      query = "SELECT\n COUNT(comment_id) AS comments_num, MAX(comment.added) AS last_comment, topics.added as last_added, CASE WHEN MAX(comment.added) IS NULL THEN topics.added ELSE MAX(comment.added) END as last_action,\n topics.*,\n topic_creator_user.value AS topic_creator_user_name,\n topic_creator_content.directory AS topic_creator_address,\n topics.topic_id || '_' || topic_creator_content.directory AS row_topic_uri,\n NULL AS row_topic_sub_uri,\n (SELECT COUNT(*) FROM topic_vote WHERE topic_vote.topic_uri = topics.topic_id || '_' || topic_creator_content.directory)+1 AS votes\nFROM topics\nLEFT JOIN json AS topic_creator_json ON (topic_creator_json.json_id = topics.json_id)\nLEFT JOIN json AS topic_creator_content ON (topic_creator_content.directory = topic_creator_json.directory AND topic_creator_content.file_name = 'content.json')\nLEFT JOIN keyvalue AS topic_creator_user ON (topic_creator_user.json_id = topic_creator_content.json_id AND topic_creator_user.key = 'cert_user_id')\nLEFT JOIN comment ON (comment.topic_uri = row_topic_uri)\n" + where + "\nGROUP BY topics.topic_id, topics.json_id";
      if (!this.parent_topic_uri) {
        query += "\nUNION ALL\n\nSELECT\n COUNT(comment_id) AS comments_num, MAX(comment.added) AS last_comment, MAX(topic_sub.added) AS last_added, CASE WHEN MAX(topic_sub.added) > MAX(comment.added) THEN MAX(topic_sub.added) ELSE MAX(comment.added) END as last_action,\n topics.*,\n topic_creator_user.value AS topic_creator_user_name,\n topic_creator_content.directory AS topic_creator_address,\n topics.topic_id || '_' || topic_creator_content.directory AS row_topic_uri,\n topic_sub.topic_id || '_' || topic_sub_creator_content.directory AS row_topic_sub_uri,\n (SELECT COUNT(*) FROM topic_vote WHERE topic_vote.topic_uri = topics.topic_id || '_' || topic_creator_content.directory)+1 AS votes\nFROM topics\nLEFT JOIN json AS topic_creator_json ON (topic_creator_json.json_id = topics.json_id)\nLEFT JOIN json AS topic_creator_content ON (topic_creator_content.directory = topic_creator_json.directory AND topic_creator_content.file_name = 'content.json')\nLEFT JOIN keyvalue AS topic_creator_user ON (topic_creator_user.json_id = topic_creator_content.json_id AND topic_creator_user.key = 'cert_user_id')\nLEFT JOIN topics AS topic_sub ON (topic_sub.parent_topic_uri = topics.topic_id || '_' || topic_creator_content.directory)\nLEFT JOIN json AS topic_sub_creator_json ON (topic_sub_creator_json.json_id = topic_sub.json_id)\nLEFT JOIN json AS topic_sub_creator_content ON (topic_sub_creator_content.directory = topic_sub_creator_json.directory AND topic_sub_creator_content.file_name = 'content.json')\nLEFT JOIN comment ON (comment.topic_uri = row_topic_sub_uri)\nWHERE topics.image_thumb = \"group\"\nGROUP BY topics.topic_id";
      }
      if (!this.list_all && !this.parent_topic_uri) {
        query += " ORDER BY last_action DESC LIMIT 30";
      }
      return Page.cmd("dbQuery", [query], (function(_this) {
        return function(topics) {
          var elem, i, len, topic, topic_parent, topic_uri;
          topics.sort(function(a, b) {
            var booster_a, booster_b;
            booster_a = booster_b = 0;
            if (window.TopicList.topic_sticky_uris[a.row_topic_uri]) {
              booster_a = window.TopicList.topic_sticky_uris[a.row_topic_uri] * 10000000;
            }
            if (window.TopicList.topic_sticky_uris[b.row_topic_uri]) {
              booster_b = window.TopicList.topic_sticky_uris[b.row_topic_uri] * 10000000;
            }
            return Math.max(b.last_comment + booster_b, b.last_added + booster_b) - Math.max(a.last_comment + booster_a, a.last_added + booster_a);
          });
          for (i = 0, len = topics.length; i < len; i++) {
            topic = topics[i];
            topic_uri = topic.row_topic_uri;
            if (topic.last_added) {
              topic.added = topic.last_added;
            }
            if (_this.parent_topic_uri && topic_uri === _this.parent_topic_uri) {
              topic_parent = topic;
              continue;
            }
            elem = $("#topic_" + topic_uri);
            if (elem.length === 0) {
              elem = $(".topics-list .topic.template").clone().removeClass("template").attr("id", "topic_" + topic_uri);
              if (type !== "noanim") {
                elem.cssSlideDown();
              }
            }
            elem.insertAfter(last_elem);
            last_elem = elem;
            _this.applyTopicData(elem, topic);
          }
          Page.addInlineEditors();
          $("body").css({
            "overflow": "auto",
            "height": "auto"
          });
          _this.logEnd("Load topics...");
          if (parseInt($(".topics-loading").css("top")) > -30) {
            $(".topics-loading").css("top", "-30px");
          } else {
            $(".topics-loading").remove();
          }
          if (_this.parent_topic_uri) {
            $(".topics-title").html("<span class='parent-link'><a href='?Main'>Main</a> &rsaquo;</span> " + topic_parent.title);
          }
          $(".topics").css("opacity", 1);
          if (topics.length === 0) {
            if (Page.site_info.bad_files) {
              $(".message-big").text("Initial sync in progress...");
            } else {
              $(".message-big").text("Welcome to your own forum! :)");
              $(".topic-new-link").trigger("click");
            }
            $(".message-big").css("display", "block").cssLater("opacity", 1);
          } else {
            $(".message-big").css("display", "none");
          }
          if (topics.length === 30) {
            $(".topics-more").css("display", "block");
          } else {
            $(".topics-more").css("display", "none");
          }
          if (cb) {
            return cb();
          }
        };
      })(this));
    };

    TopicList.prototype.applyTopicData = function(elem, topic, type) {
      var body, image, last_action, title_hash, topic_uri, url, url_match, visited;
      if (type == null) {
        type = "list";
      }
      title_hash = Text.toUrl(topic.title);
      topic_uri = topic.row_topic_uri;
      $(".title .title-link", elem).text(topic.title);
      $(".title .title-link, a.image, .comment-num", elem).attr("href", "?Topic:" + topic_uri + "/" + title_hash);
      $(".title", elem).attr('style', 'position: relative; left: 35px;');
      $(".title a.editable-edit.icon-edit", elem).attr('style', 'position: relative; left: -5px;');
      $("a.editable-edit.icon-edit", elem).attr('style', 'position: relative; left: 30px;');
      $(".body",  elem).attr('style', 'position: relative; left: 35px;');
      $(".info",  elem).attr('style', 'position: relative; left: 35px;');
      
      elem.data("topic_uri", topic_uri);
      body = topic.body;
      
      url_match = body.match(/http[s]{0,1}:\/\/[^"', \r\n)$]+/);
      if (type === "group") {
        $(elem).addClass("topic-group");
        $(".image .icon", elem).removeClass("icon-topic-chat").addClass("icon-topic-group");
        $(".link", elem).css("display", "none");
        $(".title .title-link, a.image, .comment-num", elem).attr("href", "?Topics:" + topic_uri + "/" + title_hash);
      } else if (url_match) {
        url = url_match[0];
        if (type !== "show") {
          body = body.replace(/http[s]{0,1}:\/\/[^"' \r\n)$]+$/g, "");
        }
        $(".image .icon", elem).removeClass("icon-topic-chat").addClass("icon-topic-link");
        $(".link", elem).css("display", "").attr("href", Text.fixLink(url));
        $(".link .link-url", elem).text(url);
      } else {
        $(".image .icon", elem).removeClass("icon-topic-link").addClass("icon-topic-chat");
        $(".link", elem).css("display", "none");
      }
      // show thumbnail preview
      
      if (topic.image_thumb && !(lastid === elem[0].id)) { // globel.contains(elem[0].id))) { // jquery = $.inArray(value, array)
       if (($.inArray(elem[0].id, globel))) {
        $(".image .icon", elem).attr("id", elem[0].id);
        $(".image .icon", elem).attr("style", "display: none;");
        var img = $("<img id='new_image'>"); // create img
        img.attr("class", elem[0].id);
        img.attr("src", topic.image_thumb);
        img.attr("style", "position: relative; top: -95px; left: -95px; width: 100px; height: 100px;");
        img.appendTo("#"+elem[0].id);
        globel.push(elem[0].id);
        lastid = elem[0].id;
      }
     }
      
      image = topic.image;
      if (type === "show") {
        $(".body", elem).html(Text.toMarked(body, {
          "sanitize": true
        }) + '<br /><img src="' + image + '">');
      } else {
        $(".body", elem).text(body);
      }
      if (window.TopicList.topic_sticky_uris[topic_uri]) {
        elem.addClass("topic-sticky");
      }
      if (type !== "show") {
        last_action = Math.max(topic.last_comment, topic.added);
        if (topic.image_thumb === "group") {
          $(".comment-num", elem).text("last activity");
          $(".added", elem).text(Time.since(last_action));
        } else if (topic.comments_num > 0) {
          $(".comment-num", elem).text(topic.comments_num + " comment");
          $(".added", elem).text("last " + Time.since(last_action));
        } else {
          $(".comment-num", elem).text("0 comments");
          $(".added", elem).text(Time.since(last_action));
        }
      }
      $(".user_name", elem).text(topic.topic_creator_user_name.replace(/@.*/, "")).attr("title", topic.topic_creator_user_name + ": " + topic.topic_creator_address);
      if (User.my_topic_votes[topic_uri]) {
        $(".score-inactive .score-num", elem).text(topic.votes - 1);
        $(".score-active .score-num", elem).text(topic.votes);
        $(".score", elem).addClass("active");
      } else {
        $(".score-inactive .score-num", elem).text(topic.votes);
        $(".score-active .score-num", elem).text(topic.votes + 1);
      }
      $(".score", elem).off("click").on("click", this.submitTopicVote);
      visited = Page.local_storage["topic." + topic_uri + ".visited"];
      if (!visited) {
        elem.addClass("visit-none");
      } else if (visited < last_action) {
        elem.addClass("visit-newcomment");
      }
      if (type === "show") {
        $(".added", elem).text(Time.since(topic.added));
      }
      if (topic.topic_creator_address === Page.site_info.auth_address) {
        $(elem).attr("data-object", "Topic:" + topic_uri).attr("data-deletable", "yes");
        $(".title .title-link", elem).attr("data-editable", "title").data("content", topic.title);
        return $(".body", elem).attr("data-editable", "body").data("content", topic.body);
      }
    };

    TopicList.prototype.submitCreateTopic = function() {
      var body, image_file, title;
      if (!Page.site_info.cert_user_id) {
        Page.cmd("wrapperNotification", ["info", "Please, choose your account before creating a topic."]);
        return false;
      }
      title       = $(".topic-new #topic_title").val().trim();
      body        = $(".topic-new #topic_body").val().trim();
      image_file  = $(".topic-new #filedata").val();
      image_thumb = $('#image_preview').attr('src');
      if (!title) {
        return $(".topic-new #topic_title").focus();
      }
      $(".topic-new .button-submit").addClass("loading");
      return User.getData((function(_this) {
        return function(data) {
          var topic;
          topic = {
            "topic_id":    data.next_topic_id,
            "title":       title,
            "body":        body,
            "image":       image_file,
            "image_thumb": image_thumb,
            "added":       Time.timestamp()
          };
          if (_this.parent_topic_uri) {
            topic.parent_topic_uri = _this.parent_topic_uri;
          }
          data.topic.push(topic);
          data.next_topic_id += 1;
          return User.publishData(data, function(res) {
            $(".topic-new .button-submit").removeClass("loading");
            $(".topic-new").slideUp();
            $(".topic-new-link").slideDown();
            setTimeout((function() {
              return _this.loadTopics();
            }), 600);
            $(".topic-new #topic_body").val("");
            return $(".topic-new #topic_title").val("");
          });
        };
      })(this));
    };

    TopicList.prototype.submitTopicVote = function(e) {
      var elem, inner_path;
      if (!Page.site_info.cert_user_id) {
        Page.cmd("wrapperNotification", ["info", "Please, choose your account before upvoting."]);
        return false;
      }
      elem = $(e.currentTarget);
      elem.toggleClass("active").addClass("loading");
      inner_path = "data/users/" + User.my_address + "/data.json";
      User.getData((function(_this) {
        return function(data) {
          var topic_uri;
          if (data.topic_vote == null) {
            data.topic_vote = {};
          }
          topic_uri = elem.parents(".topic").data("topic_uri");
          if (elem.hasClass("active")) {
            data.topic_vote[topic_uri] = 1;
          } else {
            delete data.topic_vote[topic_uri];
          }
          return User.publishData(data, function(res) {
            return elem.removeClass("loading");
          });
        };
      })(this));
      return false;
    };

    return TopicList;

  })(Class);

  window.TopicList = new TopicList();

}).call(this);



/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/TopicShow.coffee ---- */


(function() {
  var TopicShow,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TopicShow = (function(superClass) {
    extend(TopicShow, superClass);

    function TopicShow() {
      this.submitCommentVote = bind(this.submitCommentVote, this);
      return TopicShow.__super__.constructor.apply(this, arguments);
    }

    TopicShow.prototype.actionShow = function(topic_id, topic_user_address) {
      var textarea;
      this.topic_id = topic_id;
      this.topic_user_address = topic_user_address;
      this.topic_uri = this.topic_id + "_" + this.topic_user_address;
      this.topic = null;
      this.list_all = false;
      this.loadTopic();
      this.loadComments("noanim");
      $(".comment-new .button-submit-form").on("click", (function(_this) {
        return function() {
          _this.submitComment();
          return false;
        };
      })(this));
      textarea = $(".comment-new #comment_body");
      $(".comment-new #comment_body").on("input", (function(_this) {
        return function() {
          var current_size;
          if (User.rules.max_size) {
            if (textarea.val().length > 0) {
              current_size = User.rules.current_size + textarea.val().length + 90;
            } else {
              current_size = User.rules.current_size;
            }
            return User.setCurrentSize(current_size);
          }
        };
      })(this));
      $(".comments-more").on("click", (function(_this) {
        return function() {
          _this.list_all = true;
          $(".comments-more").text("Loading...");
          _this.loadComments("noanim");
          return false;
        };
      })(this));
      return this.initFollowButton();
    };

    TopicShow.prototype.initFollowButton = function() {
      this.follow = new Follow($(".feed-follow-show"));
      this.follow.addFeed("Comments in this topics", "SELECT 'comment' AS type, comment.added AS date_added, topics.title, commenter_user.value || ': ' || comment.body AS body, topic_creator_json.directory AS topic_creator_address, topics.topic_id || '_' || topic_creator_json.directory AS row_topic_uri, '?Topic:' || topics.topic_id || '_' || topic_creator_json.directory AS url FROM topics LEFT JOIN json AS topic_creator_json ON (topic_creator_json.json_id = topics.json_id) LEFT JOIN comment ON (comment.topic_uri = row_topic_uri) LEFT JOIN json AS commenter_json ON (commenter_json.json_id = comment.json_id) LEFT JOIN json AS commenter_content ON (commenter_content.directory = commenter_json.directory AND commenter_content.file_name = 'content.json') LEFT JOIN keyvalue AS commenter_user ON (commenter_user.json_id = commenter_content.json_id AND commenter_user.key = 'cert_user_id') WHERE row_topic_uri IN (:params)", true, this.topic_uri);
      return this.follow.init();
    };

    TopicShow.prototype.queryTopic = function(topic_id, topic_user_address) {
      return "SELECT topics.*, topic_creator_user.value AS topic_creator_user_name, topic_creator_content.directory AS topic_creator_address, topics.topic_id || '_' || topic_creator_content.directory AS row_topic_uri, (SELECT COUNT(*) FROM topic_vote WHERE topic_vote.topic_uri = topics.topic_id || '_' || topic_creator_content.directory)+1 AS votes FROM topics LEFT JOIN json AS topic_creator_json ON (topic_creator_json.json_id = topics.json_id) LEFT JOIN json AS topic_creator_content ON (topic_creator_content.directory = topic_creator_json.directory AND topic_creator_content.file_name = 'content.json') LEFT JOIN keyvalue AS topic_creator_user ON (topic_creator_user.json_id = topic_creator_content.json_id AND topic_creator_user.key = 'cert_user_id') WHERE topics.topic_id = " + topic_id + " AND topic_creator_address = '" + topic_user_address + "' LIMIT 1";
    };

    TopicShow.prototype.loadTopic = function(cb) {
      if (cb == null) {
        cb = false;
      }
      this.logStart("Loading topic...");
      $(".topic-full").attr("id", "topic_" + this.topic_uri);
      $(".topic-title").css("display", "none");
      return Page.cmd("dbQuery", [this.queryTopic(this.topic_id, this.topic_user_address)], (function(_this) {
        return function(res) {
          var parent_topic_id, parent_topic_user_address, ref;
          _this.topic = res[0];
          TopicList.applyTopicData($(".topic-full"), _this.topic, "show");
          if (_this.topic.parent_topic_uri) {
            $(".topic-title").html("&nbsp;").css("display", "");
            ref = _this.topic.parent_topic_uri.split("_"), parent_topic_id = ref[0], parent_topic_user_address = ref[1];
            Page.cmd("dbQuery", [_this.queryTopic(parent_topic_id, parent_topic_user_address)], function(parent_res) {
              var parent_topic;
              parent_topic = parent_res[0];
              return $(".topic-title").html("<span class='parent-link'><a href='?Main'>Main</a> &rsaquo;</span> <span class='parent-link'><a href='?Topics:" + parent_topic.row_topic_uri + "/" + (Text.toUrl(parent_topic.title)) + "'>" + parent_topic.title + "</a> &rsaquo;</span> " + _this.topic.title);
            });
          }
          $(".topic-full").css("opacity", 1);
          $("body").addClass("page-topic");
          _this.logEnd("Loading topic...");
          if (cb) {
            return cb();
          }
        };
      })(this));
    };

    TopicShow.prototype.loadComments = function(type, cb) {
      var query;
      if (type == null) {
        type = "show";
      }
      if (cb == null) {
        cb = false;
      }
      this.logStart("Loading comments...");
      query = "SELECT comment.*, user.value AS user_name, user_json_content.directory AS user_address, (SELECT COUNT(*) FROM comment_vote WHERE comment_vote.comment_uri = comment.comment_id || '_' || user_json_content.directory)+1 AS votes FROM comment LEFT JOIN json AS user_json_data ON (user_json_data.json_id = comment.json_id) LEFT JOIN json AS user_json_content ON (user_json_content.directory = user_json_data.directory AND user_json_content.file_name = 'content.json') LEFT JOIN keyvalue AS user ON (user.json_id = user_json_content.json_id AND user.key = 'cert_user_id') WHERE comment.topic_uri = '" + this.topic_id + "_" + this.topic_user_address + "' AND added < " + (Date.now() / 1000 + 120) + " ORDER BY added DESC";
      if (!this.list_all) {
        query += " LIMIT 60";
      }
      return Page.cmd("dbQuery", [query], (function(_this) {
        return function(comments) {
          var comment, comment_uri, elem, i, len;
          _this.logEnd("Loading comments...");
          $(".comments .comment:not(.template)").attr("missing", "true");
          for (i = 0, len = comments.length; i < len; i++) {
            comment = comments[i];
            comment_uri = comment.comment_id + "_" + comment.user_address;
            elem = $("#comment_" + comment_uri);
            if (elem.length === 0) {
              elem = $(".comment.template").clone().removeClass("template").attr("id", "comment_" + comment_uri).data("topic_uri", _this.topic_uri);
              if (type !== "noanim") {
                elem.cssSlideDown();
              }
              $(".reply", elem).on("click", function(e) {
                return _this.buttonReply($(e.target).parents(".comment"));
              });
              $(".score", elem).attr("id", "comment_score_" + comment_uri).on("click", _this.submitCommentVote);
            }
            _this.applyCommentData(elem, comment);
            elem.appendTo(".comments").removeAttr("missing");
          }
          $("body").css({
            "overflow": "auto",
            "height": "auto"
          });
          $(".comment[missing]").remove();
          Page.addInlineEditors();
          if (comments.length === 60) {
            $(".comments-more").css("display", "block");
          } else {
            $(".comments-more").css("display", "none");
          }
          if (comments.length > 0) {
            Page.local_storage["topic." + _this.topic_id + "_" + _this.topic_user_address + ".visited"] = comments[0].added;
          } else {
            Page.local_storage["topic." + _this.topic_id + "_" + _this.topic_user_address + ".visited"] = _this.topic.added;
          }
          Page.cmd("wrapperSetLocalStorage", Page.local_storage);
          if (cb) {
            return cb();
          }
        };
      })(this));
    };

    TopicShow.prototype.applyCommentData = function(elem, comment) {
      var comment_uri, image, user_name;
      user_name = comment.user_name;
      image = comment.image;
      if (!!image) {
        $(".body", elem).html(Text.toMarked(comment.body, {
          "sanitize": true
        }) + '<br /><img src="' + image + '">');
      } else {
        $(".body", elem).html(Text.toMarked(comment.body, {
          "sanitize": true
        }));
      }
      $(".user_name", elem).text(user_name.replace(/@.*/, "")).css({
        "color": Text.toColor(user_name)
      }).attr("title", user_name + ": " + comment.user_address);
      $(".added", elem).text(Time.since(comment.added)).attr("title", Time.date(comment.added, "long"));
      comment_uri = elem.attr("id").replace("comment_", "");
      if (User.my_comment_votes[comment_uri]) {
        $(".score-inactive .score-num", elem).text(comment.votes - 1);
        $(".score-active .score-num", elem).text(comment.votes);
        $(".score", elem).addClass("active");
      } else {
        $(".score-inactive .score-num", elem).text(comment.votes);
        $(".score-active .score-num", elem).text(comment.votes + 1);
      }
      if (comment.user_address === Page.site_info.auth_address) {
        $(elem).attr("data-object", "Comment:" + comment_uri + "@" + this.topic_uri).attr("data-deletable", "yes");
        return $(".body", elem).attr("data-editable", "body").data("content", comment.body);
      }
    };

    TopicShow.prototype.buttonReply = function(elem) {
      var body_add, elem_quote, post_id, user_name;
      this.log("Reply to", elem);
      user_name = $(".user_name", elem).text();
      post_id = elem.attr("id");
      body_add = "> [" + user_name + "](\#" + post_id + "): ";
      elem_quote = $(".body", elem).clone();
      $("blockquote", elem_quote).remove();
      body_add += elem_quote.text().trim("\n").replace(/\n/g, "\n> ");
      body_add += "\n\n";
      $(".comment-new #comment_body").val($(".comment-new #comment_body").val() + body_add);
      $(".comment-new #comment_body").trigger("input").focus();
      return false;
    };

    TopicShow.prototype.submitComment = function() {
      var body, comment_image_file;
      body = $(".comment-new #comment_body").val().trim();
      if (!body) {
        $(".comment-new #comment_body").focus();
        return;
      }
      comment_image_file = $(".comment-new #commentfiledata").val();
      $(".comment-new .button-submit").addClass("loading");
      return User.getData((function(_this) {
        return function(data) {
          var base, name;
          if ((base = data.comment)[name = _this.topic_uri] == null) {
            base[name] = [];
          }
          data.comment[_this.topic_uri].push({
            "comment_id": data.next_comment_id,
            "body": body,
            "image": comment_image_file,
            "added": Time.timestamp()
          });
          data.next_comment_id += 1;
          return User.publishData(data, function(res) {
            $(".comment-new .button-submit").removeClass("loading");
            if (res === true) {
              _this.log("File written");
              _this.loadComments();
              return $(".comment-new #comment_body").val("").delay(600).animate({
                "height": 72
              }, {
                "duration": 1000,
                "easing": "easeInOutCubic"
              });
            }
          });
        };
      })(this));
    };

    TopicShow.prototype.submitCommentVote = function(e) {
      var elem;
      if (!Page.site_info.cert_user_id) {
        Page.cmd("wrapperNotification", ["info", "Please, choose your account before upvoting."]);
        return false;
      }
      elem = $(e.currentTarget);
      elem.toggleClass("active").addClass("loading");
      User.getData((function(_this) {
        return function(data) {
          var comment_uri;
          if (data.comment_vote == null) {
            data.comment_vote = {};
          }
          comment_uri = elem.attr("id").match("_([0-9]+_[A-Za-z0-9]+)$")[1];
          if (elem.hasClass("active")) {
            data.comment_vote[comment_uri] = 1;
          } else {
            delete data.comment_vote[comment_uri];
          }
          return User.publishData(data, function(res) {
            return elem.removeClass("loading");
          });
        };
      })(this));
      return false;
    };

    return TopicShow;

  })(Class);

  window.TopicShow = new TopicShow();

}).call(this);



/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/ZeroTalk.coffee ---- */


(function() {
  var ZeroTalk,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ZeroTalk = (function(superClass) {
    extend(ZeroTalk, superClass);

    function ZeroTalk() {
      this.setSiteinfo       = bind(this.setSiteinfo, this);
      this.actionSetSiteInfo = bind(this.actionSetSiteInfo, this);
      this.saveContent       = bind(this.saveContent, this);
      this.getObject         = bind(this.getObject, this);
      this.getContent        = bind(this.getContent, this);
      this.onOpenWebsocket   = bind(this.onOpenWebsocket, this);
      return ZeroTalk.__super__.constructor.apply(this, arguments);
    }

    ZeroTalk.prototype.init = function() {
      // alert("zerotalk init");
      var i, len, ref, textarea;
      this.log("inited!");
      this.site_info     = null;
      this.server_info   = null;
      this.local_storage = {};
      this.site_address  = null;
      ref = $("textarea");
      for (i = 0, len = ref.length; i < len; i++) {
        textarea = ref[i];
        this.autoExpand($(textarea));
      }
      return $(".editbar .icon-help").on("click", (function(_this) {
        return function() {
          $(".editbar .markdown-help").css("display", "block");
          $(".editbar .markdown-help").toggleClassLater("visible", 10);
          $(".editbar .icon-help").toggleClass("active");
          return false;
        };
      })(this));
    };

    ZeroTalk.prototype.onOpenWebsocket = function(e) {
      this.cmd("wrapperSetViewport", "width=device-width, initial-scale=1.0");
      this.cmd("wrapperGetLocalStorage", [], (function(_this) {
        return function(res) {
          if (res == null) {
            res = {};
          }
          return _this.local_storage = res;
        };
      })(this));
      this.cmd("siteInfo", {}, (function(_this) {
        return function(site) {
          _this.site_address = site.address;
          _this.setSiteinfo(site);
          return User.updateMyInfo(function() {
            return _this.routeUrl(window.location.search.substring(1));
          });
        };
      })(this));
      return this.cmd("serverInfo", {}, (function(_this) {
        return function(ret) {
          var version;
          _this.server_info = ret;
          version = parseInt(_this.server_info.version.replace(/\./g, ""));
          if (version < 31) {
            return _this.cmd("wrapperNotification", ["error", "ZeroTalk requires ZeroNet 0.3.1, please update!"]);
          }
        };
      })(this));
    };

    ZeroTalk.prototype.onPageLoaded = function() {
      return $("body").addClass("loaded");
    };

    ZeroTalk.prototype.routeUrl = function(url) {
      var match;
      this.log("Routing url:", url);
      if (match = url.match(/Topic:([0-9]+)_([0-9a-zA-Z]+)/)) {
        $("body").addClass("page-topic");
        return TopicShow.actionShow(parseInt(match[1]), Text.toBitcoinAddress(match[2]));
      } else if (match = url.match(/Topics:([0-9]+)_([0-9a-zA-Z]+)/)) {
        $("body").addClass("page-topics");
        return TopicList.actionList(parseInt(match[1]), Text.toBitcoinAddress(match[2]));
      } else {
        $("body").addClass("page-main");
        return TopicList.actionList();
      }
    };

    ZeroTalk.prototype.addInlineEditors = function() {
      var editor, elem, elems, i, len;
      this.logStart("Adding inline editors");
      elems = $("[data-editable]");
      for (i = 0, len = elems.length; i < len; i++) {
        elem = elems[i];
        elem = $(elem);
        if (!elem.data("editor") && !elem.hasClass("editor")) {
          editor = new InlineEditor(elem, this.getContent, this.saveContent, this.getObject);
          elem.data("editor", editor);
        }
      }
      return this.logEnd("Adding inline editors");
    };

    ZeroTalk.prototype.getContent = function(elem, raw) {
      if (raw == null) {
        raw = false;
      }
      return elem.data("content");
    };

    ZeroTalk.prototype.getObject = function(elem) {
      if (elem.data("object")) {
        return elem;
      } else {
        return elem.parents("[data-object]");
      }
    };

    ZeroTalk.prototype.saveContent = function(elem, content, cb) {
      var delete_object, id, object, ref, type;
      if (cb == null) {
        cb = false;
      }
      if (elem.data("deletable") && content === null) {
        delete_object = true;
      } else {
        delete_object = false;
      }
      object = this.getObject(elem);
      ref = object.data("object").split(":"), type = ref[0], id = ref[1];
      return User.getData((function(_this) {
        return function(data) {
          var comment, comment_id, comment_uri, ref1, ref2, ref3, ref4, topic, topic_creator_address, topic_id, topic_uri, user_address;
          if (type === "Topic") {
            ref1 = id.split("_"), topic_id = ref1[0], user_address = ref1[1];
            topic_id = parseInt(topic_id);
            topic = ((function() {
              var i, len, ref2, results;
              ref2 = data.topic;
              results = [];
              for (i = 0, len = ref2.length; i < len; i++) {
                topic = ref2[i];
                if (topic.topic_id === topic_id) {
                  results.push(topic);
                }
              }
              return results;
            })())[0];
            if (delete_object) {
              data.topic.splice(data.topic.indexOf(topic), 1);
            } else {
              topic[elem.data("editable")] = content;
            }
          }
          if (type === "Comment") {
            ref2 = id.split("@"), comment_uri = ref2[0], topic_uri = ref2[1];
            ref3 = comment_uri.split("_"), comment_id = ref3[0], user_address = ref3[1];
            ref4 = topic_uri.split("_"), topic_id = ref4[0], topic_creator_address = ref4[1];
            comment_id = parseInt(comment_id);
            comment = ((function() {
              var i, len, ref5, results;
              ref5 = data.comment[topic_uri];
              results = [];
              for (i = 0, len = ref5.length; i < len; i++) {
                comment = ref5[i];
                if (comment.comment_id === comment_id) {
                  results.push(comment);
                }
              }
              return results;
            })())[0];
            if (delete_object) {
              data.comment[topic_uri].splice(data.comment[topic_uri].indexOf(comment), 1);
            } else {
              comment[elem.data("editable")] = content;
            }
          }
          return User.publishData(data, function(res) {
            if (res) {
              if (delete_object) {
                if (cb) {
                  cb(true);
                }
                return elem.fancySlideUp();
              } else {
                if (type === "Topic") {
                  if ($("body").hasClass("page-main") || $("body").hasClass("page-topics")) {
                    TopicList.loadTopics("list", (function() {
                      if (cb) {
                        return cb(true);
                      }
                    }));
                  }
                  if ($("body").hasClass("page-topic")) {
                    TopicShow.loadTopic((function() {
                      if (cb) {
                        return cb(true);
                      }
                    }));
                  }
                }
                if (type === "Comment") {
                  return TopicShow.loadComments("normal", (function() {
                    if (cb) {
                      return cb(true);
                    }
                  }));
                }
              }
            } else {
              if (cb) {
                return cb(false);
              }
            }
          });
        };
      })(this));
    };

    ZeroTalk.prototype.onRequest = function(cmd, message) {
      if (cmd === "setSiteInfo") {
        return this.actionSetSiteInfo(message);
      } else {
        return this.log("Unknown command", message);
      }
    };

    ZeroTalk.prototype.writePublish = function(inner_path, data, cb) {
      return this.cmd("fileWrite", [inner_path, data], (function(_this) {
        return function(res) {
          if (res !== "ok") {
            _this.cmd("wrapperNotification", ["error", "File write error: " + res]);
            cb(false);
            return false;
          }
          return _this.cmd("sitePublish", {
            "inner_path": inner_path
          }, function(res) {
            if (res === "ok") {
              return cb(true);
            } else {
              return cb(res);
            }
          });
        };
      })(this));
    };

    ZeroTalk.prototype.actionSetSiteInfo = function(res) {
      var site_info;
      site_info = res.params;
      this.setSiteinfo(site_info);
      if (site_info.event && site_info.event[0] === "file_done" && site_info.event[1].match(/.*users.*data.json$/)) {
        return RateLimit(500, (function(_this) {
          return function() {
            if ($("body").hasClass("page-topic")) {
              TopicShow.loadTopic();
              TopicShow.loadComments();
            }
            if ($("body").hasClass("page-main") || $("body").hasClass("page-topics")) {
              return TopicList.loadTopics();
            }
          };
        })(this));
      }
    };

    ZeroTalk.prototype.setSiteinfo = function(site_info) {
      this.site_info = site_info;
      return User.checkCert();
    };

    ZeroTalk.prototype.autoExpand = function(elem) {
      var editor;
      editor = elem[0];
      if (elem.height() > 0) {
        elem.height(1);
      }
      elem.on("input", function() {
        var min_height, new_height, old_height;
        if (editor.scrollHeight > elem.height()) {
          old_height = elem.height();
          elem.height(1);
          new_height = editor.scrollHeight;
          new_height += parseFloat(elem.css("borderTopWidth"));
          new_height += parseFloat(elem.css("borderBottomWidth"));
          new_height -= parseFloat(elem.css("paddingTop"));
          new_height -= parseFloat(elem.css("paddingBottom"));
          min_height = parseFloat(elem.css("lineHeight")) * 2;
          if (new_height < min_height) {
            new_height = min_height + 4;
          }
          return elem.height(new_height - 4);
        }
      });
      if (elem.height() > 0) {
        return elem.trigger("input");
      } else {
        return elem.height("48px");
      }
    };

    return ZeroTalk;

  })(ZeroFrame);

  window.Page = new ZeroTalk();

}).call(this);


/* ---- data/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv/js/ZeroHello.coffee ---- */


(function() {
  var ZeroHello,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ZeroHello = (function(_super) {
    __extends(ZeroHello, _super);

    function ZeroHello() {
      this.onOpenWebsocket = __bind(this.onOpenWebsocket, this);
      return ZeroHello.__super__.constructor.apply(this, arguments);
    }

    ZeroHello.prototype.init = function() {
      this.log("inited!");
      // handle chrome's zero plugin
      this.is_proxy_request = document.location.host === "zero" || document.location.pathname === "/";
      
      this.sites = {};
      
      // check localstore
      // this.local_storage = null;
      
      /*
      this.cmd("wrapperGetLocalStorage", [], (function(_this) {
        return function(res) {
          if (res == null) {
            res = {};
          }
          return _this.local_storage = res;
        };
      })(this));
      */
      
      $(".button-update").on("click", (function(_this) {
        return function() {
          $(".button-update").addClass("loading");
          $(".broken-autoupdate").css("display", "block").html("Please run update.py manually<br>if ZeroNet doesn't comes back within 1 minute.");
          return _this.cmd("serverUpdate", {});
        };
      })(this));
      return $(".version.current").on("click", (function(_this) {
        return function() {
          return $(".button-update").css("display", "inline-block");
        };
      })(this));
    };

    ZeroHello.prototype.onOpenWebsocket = function(e) {
      this.reloadPeers();
      this.reloadServerInfo();
      this.loadFavorites();
      this.preserveExistingFavorites();
      this.reloadSites();
      $(".button-update").removeClass("loading");
      return this.cmd("channelJoinAllsite", {
        "channel": "siteChanged"
      });
    };
    
    ZeroHello.prototype.loadFavorites = function() {
      return this.cmd("siteList", {}, (function(_this) {
        return function(sites) {
          Page.cmd("wrapperGetLocalStorage", [], (function(_this) {
            return function(res) {
              if (res == null) {
                res = {};
              }
              return _this.local_storage = res;
            };
          })(this));
        };
      })(this));
    };
    
    // pre-save favorites
    ZeroHello.prototype.preserveExistingFavorites = function() {
      return this.cmd("siteList", {}, (function(_this) {
        return function(sites) {
          if (sites.length < 1000) {
			window.zites = sites.length;
            for (_i = 0, _len = sites.length; _i < _len; _i++) {
              site = sites[_i];
              favorite = this.local_storage["site." + site.address + ".favorite"];
              if (typeof(favorite) === "boolean") {
                if (favorite) {
                  Page.local_storage["site." + site.address + ".favorite"] = true;
                  Page.cmd("wrapperSetLocalStorage", Page.local_storage);
                }
              }
            }
          }
        }
      })(this));
    };
    
    // favorite
    ZeroHello.prototype.siteFavorite = function(address) {
      var site, favorite;
      site = this.sites[address].address;
      favorite = Page.local_storage["site." + site + ".favorite"];
      
      if (!favorite) {
        // alert("favoriting..");
        Page.local_storage["site." + site + ".favorite"] = true;
        Page.cmd("wrapperSetLocalStorage", Page.local_storage);
        $(".site-" + site).addClass("favorite");
        site.peers += 100000; // Favorites hack! (todo: site.favorite)
        site.favorite = true;
        this.reloadSites();
        $('html, body').animate({scrollTop : 0},900);
      } else {
        // alert("unfavoriting..");
        site.favorite = false;
        // this.menu = new Menu();
        Page.local_storage["site." + site + ".favorite"] = false;
        Page.cmd("wrapperSetLocalStorage", Page.local_storage);
        $(".site-" + site).removeClass("favorite");
        site.peers -= 100000; // Favorites hack! (todo: site.favorite)
        this.reloadSites();
      }
      return this.cmd("siteFavorite", {
        "address": address
      });
    };

    ZeroHello.prototype.route = function(cmd, message) {
      if (cmd === "setSiteInfo") {
        return this.actionSetSiteInfo(message);
      } else {
        return this.log("Unknown command", message);
      }
    };

    ZeroHello.prototype.actionSetSiteInfo = function(message) {
      var site;
      site = message.params;
      return this.applySitedata($(".site-" + site.address), site);
    };

    ZeroHello.prototype.formatSince = function(time) {
      var back, now, secs;
      now = +(new Date) / 1000;
      secs = now - time;
      if (secs < 60) {
        back = "Just now";
      } else if (secs < 60 * 60) {
        back = (Math.round(secs / 60)) + " minutes ago";
      } else if (secs < 60 * 60 * 24) {
        back = (Math.round(secs / 60 / 60)) + " hours ago";
      } else if (secs < 60 * 60 * 24 * 3) {
        back = (Math.round(secs / 60 / 60 / 24)) + " days ago";
      } else {
        back = "on " + this.formatDate(time);
      }
      back = back.replace(/^1 ([a-z]+)s/, "1 $1");
      return back;
    };

    ZeroHello.prototype.formatDate = function(timestamp, format) {
      var display, parts;
      if (format == null) {
        format = "short";
      }
      parts = (new Date(timestamp * 1000)).toString().split(" ");
      if (format === "short") {
        display = parts.slice(1, 4);
      } else {
        display = parts.slice(1, 5);
      }
      return display.join(" ").replace(/( [0-9]{4})/, ",$1");
    };

    ZeroHello.prototype.reloadPeers = function() {
      return this.cmd("siteInfo", {}, (function(_this) {
        return function(site_info) {
          var peers;
          _this.address = site_info.auth_address;
          _this.site_info = site_info;
          peers = site_info["peers"];
          if (peers === 0) {
            peers = "n/a";
          }
          return $("#peers").removeClass("updating").text(peers);
        };
      })(this));
    };

    ZeroHello.prototype.applySitedata = function(elem, site) {
      var error, href, modified, success, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, fav, _i;
      if (typeof site.bad_files === "object") {
        site.bad_files = site.bad_files.length;
      }
      if (typeof site.tasks === "object") {
        site.tasks = site.tasks.length;
      }
      elem.addClass("site-" + site.address);
      if (site.peers) {
        if (site.peers > 100000) { site.peers -= 100000; } // Favorites hack! (todo: site.favorite)
        $(".peers", elem).html(site.peers);
      } else {
        $(".peers", elem).html("n/a");
      }
      if (site.content.title.length > 20) {
        $(".title", elem).html(site.content.title).addClass("long");
      } else {
        $(".title", elem).html(site.content.title).removeClass("long");
      }
      $(".description", elem).html(site.content.description);
      modified = site.settings.modified ? site.settings.modified : site.content.modified;
      new DateSince($(".modified-date", elem)[0], modified);
      if ((this.server_info.plugins != null) && (__indexOf.call(this.server_info.plugins, "Zeroname") >= 0 || __indexOf.call(this.server_info.plugins, "Dnschain") >= 0 || __indexOf.call(this.server_info.plugins, "Zeroname-local") >= 0) && ((_ref = site.content) != null ? _ref.domain : void 0)) {
        if (this.is_proxy_request) {
          href = "http://" + site.content.domain;
        } else {
          href = "/" + site.content.domain;
        }
      } else {
        if (this.is_proxy_request) {
          href = "http://zero/" + site.address;
        } else {
          href = "/" + site.address;
        }
      }
      $(".site", elem).attr("href", href);
      $(elem).removeClass("site-seeding").removeClass("site-paused");
      if (site.settings.serving && site.address) {
        $(elem).addClass("site-seeding");
        $(".status", elem).text("Seeding");
      } else {
        $(elem).addClass("site-paused");
        $(".status", elem).text("Paused");
      }
      
      // todo: Fav / Unfav option on zite menu
      // if (site.favorite) {
        // siteMenu.removeItem("Unfavorite");
        // siteMenu.addItem("Favorite");
        // $(".notify", elem).text("Favorited").addClassLater("visible");
      // } else {
        // siteMenu.removeItem("Favorite");
        // siteMenu.addItem("Unfavorite");
        // $(".notify", elem).text("Unfavorited").addClassLater("visible");
      // }
      
      if (site.tasks > 0 || ((_ref1 = site.event) != null ? _ref1[0] : void 0) === "updating") {
        $(".anim-updating", elem).addClass("visible");
      } else {
        $(".anim-updating", elem).removeClass("visible");
      }
      if ((_ref2 = (_ref3 = site.event) != null ? _ref3[0] : void 0) === "file_done" || _ref2 === "file_started" || _ref2 === "updating" || _ref2 === "updated") {
        if (site.bad_files > 0) {
          success = "Updating: " + site.bad_files + " left";
        } else if (((_ref4 = site.event[0]) === "file_done" || _ref4 === "updated") && site.bad_files === 0) {
          success = "Site updated";
        } else {
          success = "Site updating...";
        }
      }
      if (success) {
        $(".notify", elem).text(success).addClass("success").addClassLater("visible");
      }
      if (site.content_updated === false) {
        if (site.settings.own) {
          error = "No peers found";
        } else {
          error = "Update failed";
        }
      } else if (site.tasks === 0 && site.bad_files > 0 && ((_ref5 = site.event) != null ? _ref5[0] : void 0) !== "file_done") {
        error = site.bad_files + " failed";
      }
      if (error) {
        $(".notify", elem).text(error).removeClass("success").addClassLater("visible");
      }
      if (site.settings.size > site.settings.size_limit * 1000 * 1000) {
        $(".notify", elem).text("Check size limit");
        $(".site", elem).addClass("error");
        $(".status", elem).text("?");
      }
      if (!error && !success) {
        $(".notify", elem).removeClass("visible");
      }
      if (site.disabled) {
        $(elem).addClass("site-disabled");
      }
      $(".hamburger", elem).off("click").on("click", (function() {
        new SiteMenu(elem, site).show();
        return false;
      }));
      if ((+(new Date)) / 1000 - modified < 60 * 60 * 24) {
        $(".site", elem).addClass("modified");
      }
      // fav title color
      if (site.favorite) {
        $(elem).children("a").children("span").attr("style", "color: #EFED92;");
      }
      
      this.sites[site.address] = site;
      return elem;
    };

    ZeroHello.prototype.reloadSites = function() {
      return this.cmd("siteList", {}, (function(_this) {
        return function(sites) {
          var elem, elem_category, sample_sites, site, _i, _j, _len, _len1, favorite;
          
          // shared.. (zerohello + lander apps)
          // $("#sites > :not(.template)").remove();
          
          // if ((_base = Page.local_storage).sites_orderby == null) { _base.sites_orderby = "peers"; }
          // orderby = Page.local_storage.sites_orderby;
          
          elem_category = $(".site-category.template").clone();
          elem_category.removeClass("template");
          $("#sites").append(elem_category);
          // still testing..
          if (sites.length < 1000) { // see else bug below
            // alert(sites.length);
            for (_i = 0, _len = sites.length; _i < _len; _i++) {
              site = sites[_i];
              favorite = this.local_storage["site." + site.address + ".favorite"] || Page.local_storage["site." + site.address + ".favorite"];
              if (typeof(favorite) === "boolean") {
                if (favorite) {
                  site.peers += 100000; // Favorites hack! (todo: site.favorite)
                  site.favorite = true;
                  // alert(site.address + " is favorited!");
                }
              }
            }
          } else { // 1492 html template bug... 
              // alert (sites.length);
          }
          sites.sort(function(a, b) {
            return cmp(b["peers"], a["peers"]);
          });
          
          $(".site-container.template").addClass("site-small"); // old zerohello
          for (_i = 0, _len = sites.length; _i < _len; _i++) {
            site = sites[_i];
            $(".zite-" + site.address).remove();
            elem = $(".site-container.template").clone().removeClass("template").addClass("zite-" + site.address);
            elem = _this.applySitedata(elem, site);
            $("#sites").append(elem);
          }
          elem_category = $(".site-category.template").clone();
          elem_category.removeClass("template");
          $(".title", elem_category).html("Sample sites");
          $("#sites").append(elem_category);
          sample_sites = [
            {
              "content": {
                "title": "ZeroBlog",
                "description": "Blogging platform Demo",
                "domain": "Blog.ZeroNetwork.bit"
              },
              "address": "1BLogC9LN4oPDcruNz3qo1ysa133E9AGg8",
              "settings": {
                "serving": false
              }
            }, {
              "content": {
                "title": "ZeroTalk",
                "description": "Decentralized forum demo",
                "domain": "Talk.ZeroNetwork.bit"
              },
              "address": "1TaLkFrMwvbNsooF4ioKAY9EuxTBTjipT",
              "settings": {
                "serving": false
              }
            }, {
              "content": {
                "title": "ZeroBoard",
                "description": "Messaging board demo",
                "domain": "Board.ZeroNetwork.bit"
              },
              "address": "1Gfey7wVXXg1rxk751TBTxLJwhddDNfcdp",
              "settings": {
                "serving": false
              }
            }, {
              "content": {
                "title": "ZeroID",
                "description": "Sample trusted authorization provider",
                "domain": "ZeroID.bit"
              },
              "address": "1iD5ZQJMNXu43w1qLB8sfdHVKppVMduGz",
              "settings": {
                "serving": false
              }
            }
          ];
          for (_j = 0, _len1 = sample_sites.length; _j < _len1; _j++) {
            site = sample_sites[_j];
            if ($(".site-" + site.address).length > 0) { continue; }
            elem = $(".site-container.template").clone().removeClass("template").addClass("site-inactive");
            elem = _this.applySitedata(elem, site);
            $(".status, .right, .bottom", elem).css("display", "none");
            $(".action", elem).html("Activate site");
            $("#sites").append(elem);
          }
          $("#sites").removeClass("updating");
          $("#sites").css("height", "auto");
          if ($(document).height() <= $(window).height()) {
            return $(".topright").css("margin-right", "90px");
          }
        };
      })(this));
    };

    ZeroHello.prototype.reloadServerInfo = function() {
      return this.cmd("serverInfo", {}, (function(_this) {
        return function(server_info) {
          var imagedata, rev, title, version;
          _this.server_info = server_info;
          $(".topright").css("opacity", 0.5);
          version = server_info.version;
          if (!version) {
            version = "Unknown, please update";
          }
          if (server_info.rev) {
            rev = " (r" + server_info.rev + ")";
          } else {
            rev = "";
          }
          $(".version.current a").html("" + version + rev);
          if ($(".version.latest a").text() === version) {
            $(".version.latest").css("display", "none");
            $(".button-update").css("display", "none");
          } else {
            $(".topright").css("opacity", 1);
            $(".version.latest").css("display", "inline-block");
            $(".button-update").css("display", "inline-block");
            if (parseInt(version.replace(/[^0-9]/g, "0")) === 207) {
              $(".button-update").addClass("button-disabled");
              $(".broken-autoupdate").css("display", "block");
            } else if (parseInt(version.replace(/[^0-9]/g, "0")) === 208) {
              $(".broken-autoupdate").css("display", "block");
              $(".broken-autoupdate").html("It's possible that ZeroNet will not comes back automatically<br>after the update process. In this case please start it manually.");
            }
          }
          if (server_info.ip_external) {
            $(".port").removeClass("closed").addClass("opened");
            $(".port a").text("opened");
          } else {
            $(".port").removeClass("opened").addClass("closed").css("display", "initial");
            $(".port a").text("closed").attr("title", "(Re-check port " + server_info.fileserver_port + ")");
          }
          $(".port a").off("click").on("click", function() {
            $(".port").addClass("loading");
            return _this.cmd("serverPortcheck", [], function(res) {
              if (_this.server_info.rev < 600) {
                _this.cmd("wrapperNotification", ["info", "Please restart your ZeroNet client to re-check opened port."]);
              }
              $(".port").removeClass("loading");
              _this.log("Port open result:", res);
              return _this.reloadServerInfo();
            });
          });
          if (server_info.tor_status) {
            $(".tor").css("display", "initial");
            title = server_info.tor_status.replace(/.*\((.*)\)/, "$1");
            $(".tor span").html(server_info.tor_status.replace(/\(.*\)/, "").replace("OK", "<span class='ok' title='" + title + "'>OK</span>"));
          }
          if (server_info.multiuser) {
            $(".plugin-multiuser").css("display", "block");
            imagedata = new Identicon(server_info["master_address"], 25).toString();
            $("body").append("<style>.identicon { background-image: url(data:image/png;base64," + imagedata + ") }</style>");
            $(".plugin-multiuser .identicon").on("click", function() {
              _this.cmd("userShowMasterSeed", []);
              return false;
            });
            $(".plugin-multiuser .button-logout").on("click", function() {
              _this.cmd("userLogout", []);
              return false;
            });
          }
          if (__indexOf.call(server_info.plugins, "UiPassword") >= 0) {
            $(".plugin-uipassword").css("display", "block");
            return $(".plugin-uipassword .button-logout").on("click", function() {
              return _this.cmd("uiLogout", []);
            });
          }
        };
      })(this));
    };
    
    ZeroHello.prototype.toColor = function(text) {
      var hash, i, _i, _ref;
      hash = 0;
      for (i = _i = 0, _ref = text.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        hash += text.charCodeAt(i) * i;
      }
      return "hsl(" + (hash % 360) + ",30%,50%)";
    };
    
    ZeroHello.prototype.updateSites = function() {
        var favorites = Page.local_storage.favorite_sites;
    }
    
    ZeroHello.prototype.loadLocalStorage = function() {
      return this.on_site_info.then((function(_this) {
        return function() {
          _this.log("Loading localstorage");
          return _this.cmd("wrapperGetLocalStorage", [], function(_at_local_storage) {
            var _base, _base1;
            _this.local_storage = _at_local_storage;
            _this.log("Loaded localstorage");
            if (_this.local_storage == null) {
              _this.local_storage = {};
            }
            if ((_base = _this.local_storage).sites_orderby == null) {
              _base.sites_orderby = "peers";
            }
            if ((_base1 = _this.local_storage).favorite_sites == null) {
              _base1.favorite_sites = {};
            }
            return _this.on_local_storage.resolve(_this.local_storage);
          });
        };
      })(this));
    };
    
    ZeroHello.prototype.saveLocalStorage = function(cb) {
      if (this.local_storage) {
        return this.cmd("wrapperSetLocalStorage", this.local_storage, (function(_this) {
          return function(res) {
            if (cb) {
              return cb(res);
            }
          };
        })(this));
      }
    };
    
    // update
    ZeroHello.prototype.siteUpdate = function(address) {
      return this.cmd("siteUpdate", {
        "address": address
      });
    };
    
    // pause
    ZeroHello.prototype.sitePause = function(address) {
      return this.cmd("sitePause", {
        "address": address
      });
    };
    
    // resume
    ZeroHello.prototype.siteResume = function(address) {
      return this.cmd("siteResume", {
        "address": address
      });
    };
    
    // clone
    ZeroHello.prototype.siteClone = function(address) {
      return this.cmd("siteClone", {
        "address": address
      });
    };
    
    // delete
    ZeroHello.prototype.siteDelete = function(address) {
      var site, title;
      site = this.sites[address];
      if (site.settings.own) {
        return this.cmd("wrapperNotification", ["error", "Sorry, you can't delete your own site.<br>Please remove the directory manually."]);
      } else {
        title = site.content.title;
        if (title.length > 40) {
          title = title.substring(0, 15) + "..." + title.substring(title.length - 10);
        }
        return this.cmd("wrapperConfirm", ["Are you sure you sure? <b>" + title + "</b>", "Delete"], (function(_this) {
          return function(confirmed) {
            _this.log("Deleting " + site.address + "...", confirmed);
            if (confirmed) {
              $(".site-" + site.address).addClass("deleted");
              return _this.cmd("siteDelete", {
                "address": address
              });
            }
          };
        })(this));
      }
    };
    
    return ZeroHello;
    
  })(ZeroFrame);

  window.zero_hello = new ZeroHello();

}).call(this);

// ------------------------------------

// testing API...
ZeroAPI = new ZeroFrame();

// todo: back button
var lastTemplate = "";

function loadTemplate(ntemplate, data) {
  // alert(ntemplate + " " + lastTemplate);
  
  if (ntemplate != lastTemplate) {
    if (ntemplate == "all") {
        $("#menu > ul > li.active").toggleClass("active");
        $("#menu > ul > li.all").toggleClass("active");
    }
    ZeroAPI.cmd("fileGet", {
          "inner_path": "pages/" + ntemplate + ".html",
          "required": false
      }, (function(html) {
        // alert(ntemplate);
        $("main").append("<section n-template=\"" + ntemplate + "\">" + Mustache.render(html, data) + "</section>");
    }));
    $("section[n-template]").each(function() {
      $(this).addClass("hide");
    });
    
    // hide previous
    if($("[n-template=\"" + ntemplate + "\"]").length) {
       $("[n-template=\"" + ntemplate + "\"]").toggleClass("hide");
    }
    // hack for old templates and double loading
    if(ntemplate == "view-post" || ntemplate == "new" || ntemplate == "home" || ntemplate == "misc") {
      if($("[n-template=\"" + ntemplate + "\"]").length) {
         $("[n-template=\"" + ntemplate + "\"]")[0].remove();
      }
    }
    // hack for double loading
    if(ntemplate == "apps") {
      if($("[n-template=\"" + ntemplate + "\"]").length) {
         $("[n-template=\"" + ntemplate + "\"]")[1].toggleClass("hide");
      }
    }
    lastTemplate = ntemplate;
  }
}

ZeroAPI.cmd("siteInfo", {}, (function(site_info) {
  console.log(site_info);
  if(site_info.cert_user_id) {
    $("#logget").removeClass("hide");
    $("#no-login").addClass("hide");
    $(".nickbar span").html(site_info.cert_user_id.replace('@zeroid.bit', ''));
  }
}));

ZeroAPI.cmd("dbQuery", ["SELECT posts.*, keyvalue.value AS cert_user_id FROM posts LEFT JOIN json AS data_json USING (json_id) LEFT JOIN json AS content_json ON (data_json.directory = content_json.directory AND content_json.file_name = 'content.json') LEFT JOIN keyvalue ON (keyvalue.key = 'cert_user_id' AND keyvalue.json_id = content_json.json_id) ORDER BY post_date DESC LIMIT 1000"], (function(t_posts) {
	// testing: called 3 times.. (reloading bug?)
	// alert(window.zites);
	if (window.zites) {
	  var allzites = window.zites;
	  // alert(allzites);
	}
    ZeroAPI.cmd("siteInfo", {}, (function(site_info) {
        var all_info = {
          posts: t_posts,
          stats: { zites: allzites, posts: t_posts.length, peers: site_info.peers, active_peers: site_info.settings.peers, comments: 0}
        };
        loadTemplate("all", all_info);
    }));
}));

$(document).ready(function() {
    
  $(document).on("click", ".lastposts a", function () {
    // alert($(this).attr("data-key"));
    ZeroAPI.cmd("dbQuery", ["SELECT * FROM posts WHERE post_id = '" + $(this).attr("data-key") + "'"], (function(post_variables) { 
      loadTemplate("view-post", post_variables[0]);
      console.log(post_variables[0]);
    }));
  });
  
  $(document).on("click", "[template]", function () {
    var ntemplate = $(this).attr("template");
    // alert(ntemplate);
    loadTemplate(ntemplate);
  });
  
  /* menu */
  $(document).on("click", "#menu > ul > li", function () {
    $("#menu > ul > li.active").toggleClass("active");
    $(this).toggleClass("active");
    // menu & submenu sync
    $("#submenu > ul > li.active").toggleClass("active");
    $("#submenu > ul > li.all").toggleClass("active");
  });  
  
  /* submenu */
  $(document).on("click", "#submenu > ul > li", function () {
    $("#submenu > ul > li.active").toggleClass("active");
    $(this).toggleClass("active");
    // menu & submenu sync
    $("#menu > ul > li.active").toggleClass("active");
    $("#menu > ul > li.all").toggleClass("active");
  });
  
  /* create post */
  $(document).on("submit", "#new-post-f", function () {
    ZeroAPI.cmd("siteInfo", {}, (function(site_info) {
      if (!site_info.cert_user_id) {
        ZeroAPI.cmd("wrapperNotification", ["info", "Please, select your account."]);
        return false;
      } else {
      var form_title      = $("input[name=title]").val();
      var form_user       = site_info.cert_user_id;
      var form_cat        = $('select#categorias').val();
      var form_url        = $("input[name=url]").val();
      var form_cuerpo     = $("textarea[name=cuerpo]").val();
      var form_parent     = 'none';
      var form_image_name = $("input[name=image]").val().replace('C:\\fakepath\\', ''); // windows only!
      var form_image_url  = form_url + "/zite/thumbs/" + form_image_name;
      var form_image_blob = $('#image_preview').attr('src');

      if (form_title.length < 1) {  
          ZeroAPI.cmd("wrapperNotification", ["error", "Please, put a title."]);
          return false;  
      }

      if (form_cuerpo.length < 15) {  
          ZeroAPI.cmd("wrapperNotification", ["error", "Minimum 15 characters in the \"Content\"."]);
          return false;  
      }
      
      inner_path = "data/users/" + site_info.auth_address + "/data.json";
      ZeroAPI.cmd("fileGet", {
        "inner_path": inner_path,
        "required": false
      }, (function(data) {
          if (data) {
            data = JSON.parse(data);
          } else {
            data = {
              "posts": []
            };
          }
          
          data.posts.push({
            "post_title":      form_title,
            "post_user":       form_user,
            "post_date":       +(new Date),
            "post_cat":        form_cat,
            "post_url":        form_url,
            "post_content":    form_cuerpo,
            "post_parent":     form_parent,
            "post_image_name": form_image_name,
            "post_image_url":  form_image_url,
            "post_image_blob": form_image_blob
          });

          ZeroAPI.cmd("fileWrite", [inner_path, btoa(JSON.stringify(data))], function(on_write) { 

          if (on_write === "ok") {

            ZeroAPI.cmd("sitePublish", { "inner_path": inner_path }, function(on_publish) {
              console.log(on_publish);
              alert("published");
            });
          } else {
            ZeroAPI.cmd("wrapperNotification", ["error", "File write error: " + on_write]);
          }
          });
      }));
      }
    }));
  });
});
// end test...

/* eof */
