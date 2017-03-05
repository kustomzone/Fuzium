

/* ---- data/1EU1tbG9oC1A8jz2ouVwGZyQ5asrNsE4Vr/js/lib/DateSince.coffee ---- */


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


/* ---- data/1EU1tbG9oC1A8jz2ouVwGZyQ5asrNsE4Vr/js/lib/Utils.coffee ---- */


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


/* ---- data/1EU1tbG9oC1A8jz2ouVwGZyQ5asrNsE4Vr/js/lib/ZeroFrame.coffee ---- */

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


// testing API...
ZeroAPI = new ZeroFrame();

function loadTemplate(ntemplate, data) {
    ZeroAPI.cmd("fileGet", {
          "inner_path": "pages/" + ntemplate + ".html",
          "required": false
      }, (function(html) {
        $("main").append("<section n-template=\"" + ntemplate + "\">" + Mustache.render(html, data) + "</section>");
    }));
	$("section[n-template]").each(function() {
      $(this).addClass("hide");
    });
	// alert($("[n-template=\"" + ntemplate + "\"]").length);
	
	// hide previous
	if($("[n-template=\"" + ntemplate + "\"]").length) {
	  $("[n-template=\"" + ntemplate + "\"]").toggleClass("hide");
	}
	// hack for old templates and double loading
	if(ntemplate == "view-post" || ntemplate == "new") {
	  if($("[n-template=\"" + ntemplate + "\"]").length) {
		$("[n-template=\"" + ntemplate + "\"]")[0].remove();
	  }
	}
	// hack for double loading
	if(ntemplate == "all") {
	  if($("[n-template=\"" + ntemplate + "\"]").length) {
		$("[n-template=\"" + ntemplate + "\"]")[1].toggleClass("hide");
	  }
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

// testing...
ZeroAPI.cmd("dbQuery", ["SELECT posts.*, keyvalue.value AS cert_user_id FROM posts LEFT JOIN json AS data_json USING (json_id) LEFT JOIN json AS content_json ON (data_json.directory = content_json.directory AND content_json.file_name = 'content.json') LEFT JOIN keyvalue ON (keyvalue.key = 'cert_user_id' AND keyvalue.json_id = content_json.json_id) ORDER BY post_date DESC LIMIT 30"], (function(t_posts) { 
	
	ZeroAPI.cmd("siteInfo", {}, (function(site_info) {
		var all_info = {
		  posts: t_posts,
		  stats: { posts: t_posts.length, peers: site_info.peers, active_peers: site_info.settings.peers, comments: 0}
		};
		loadTemplate("all", all_info);
	}));
}));

// testing API forms...
$(document).ready(function() {
  /* templates easy */
  $(document).on("click", ".lastposts a", function () {
    // alert($(this).attr("data-key"));
    ZeroAPI.cmd("dbQuery", ["SELECT * FROM posts WHERE post_id = '" + $(this).attr("data-key") + "'"], (function(post_variables) { 
      loadTemplate("view-post", post_variables[0]);
      console.log(post_variables[0]);
    }));
  });
  
  $(document).on("click", "[template]", function () {
    var ntemplate = $(this).attr("template");
    loadTemplate(ntemplate);
  });
  
  /* menu */
  $(document).on("click", "#menu > ul > li", function () {
    $("#menu > ul > li.active").toggleClass("active");
    $(this).toggleClass("active");
  });  
  
  /*  submenu */
  $(document).on("click", "#submenu > ul > li", function () {
    $("#submenu > ul > li.active").toggleClass("active");
    $(this).toggleClass("active");
  });
  
  /* crear post */
  $(document).on("submit", "#new-post-f", function () {
    ZeroAPI.cmd("siteInfo", {}, (function(site_info) {
      if (!site_info.cert_user_id) {
        ZeroAPI.cmd("wrapperNotification", ["info", "Please, select your account."]);
        return false;
      } else {
      var form_title = $("input[name=title]").val();
      var form_cuerpo = $("textarea[name=cuerpo]").val();
      var form_cat = $('select#categorias').val();

      if(form_title.length < 1) {  
          ZeroAPI.cmd("wrapperNotification", ["error", "Please, put a title."]);
          return false;  
      }  

      if(form_cuerpo.length < 20) {  
          ZeroAPI.cmd("wrapperNotification", ["error", "Minimum 20 characters in the \"Content\"."]);
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
            "post_title": form_title,
            "post_cat": form_cat,
            "post_date": +(new Date),
            "post_content": form_cuerpo
          });

          ZeroAPI.cmd("fileWrite", [inner_path, btoa(JSON.stringify(data))], function(on_write) { 

          if (on_write === "ok") {

            ZeroAPI.cmd("sitePublish", { "inner_path": inner_path }, function(on_publish) {
              console.log(on_publish);
              alert("published")
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


/*	
    return ZeroFrame;

  })();

  window.ZeroFrame = ZeroFrame;

}).call(this);
*/


/* ---- data/1EU1tbG9oC1A8jz2ouVwGZyQ5asrNsE4Vr/js/lib/identicon.js ---- */


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


/* ---- data/1EU1tbG9oC1A8jz2ouVwGZyQ5asrNsE4Vr/js/lib/jquery.cssanim.js ---- */


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
			elem.style.transform = 'translate3d(0px, 0px, 0px) matrix('+transforms.join(", ")+')'
		} else {
			elem.style.transform = "scale("+val+")"
		}
	}
}

jQuery.fx.step.scale = function(fx) {
	jQuery.cssHooks['scale'].set(fx.elem, fx.now)
};


/* ---- data/1EU1tbG9oC1A8jz2ouVwGZyQ5asrNsE4Vr/js/lib/jquery.csslater.coffee ---- */


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


/* ---- data/1EU1tbG9oC1A8jz2ouVwGZyQ5asrNsE4Vr/js/lib/jquery.easing.1.3.js ---- */


/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
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

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */


/* ---- data/1EU1tbG9oC1A8jz2ouVwGZyQ5asrNsE4Vr/js/lib/pnglib.js ---- */


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
		this.ihdr_offs = 0;									// IHDR offset and size
		this.ihdr_size = 4 + 4 + 13 + 4;
		this.plte_offs = this.ihdr_offs + this.ihdr_size;	// PLTE offset and size
		this.plte_size = 4 + 4 + 3 * depth + 4;
		this.trns_offs = this.plte_offs + this.plte_size;	// tRNS offset and size
		this.trns_size = 4 + 4 + depth + 4;
		this.idat_offs = this.trns_offs + this.trns_size;	// IDAT offset and size
		this.idat_size = 4 + 4 + this.data_size + 4;
		this.iend_offs = this.idat_offs + this.idat_size;	// IEND offset and size
		this.iend_size = 4 + 4 + 4;
		this.buffer_size  = this.iend_offs + this.iend_size;	// total PNG size

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



/* ---- data/1EU1tbG9oC1A8jz2ouVwGZyQ5asrNsE4Vr/js/SiteMenu.coffee ---- */


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
      this.addItem("Update", (function() {
        return window.zero_hello.siteUpdate(site.address);
      }));
      if (site.settings.serving) {
        this.addItem("Pause", (function() {
          return window.zero_hello.sitePause(site.address);
        }));
      } else {
        this.addItem("Resume", (function() {
          return window.zero_hello.siteResume(site.address);
        }));
      }
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


/* ---- data/1EU1tbG9oC1A8jz2ouVwGZyQ5asrNsE4Vr/js/ZeroHello.coffee ---- */


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
      this.sites = {};
      this.local_storage = null;
      this.is_proxy_request = document.location.host === "zero" || document.location.pathname === "/";
      this.cmd("wrapperGetLocalStorage", [], (function(_this) {
        return function(res) {
          if (res == null) {
            res = {};
          }
          return _this.local_storage = res;
        };
      })(this));
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
      this.reloadSites();
      $(".button-update").removeClass("loading");
      return this.cmd("channelJoinAllsite", {
        "channel": "siteChanged"
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
          _this.address = site_info.addres;
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
      var error, href, modified, success, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      if (typeof site.bad_files === "object") {
        site.bad_files = site.bad_files.length;
      }
      if (typeof site.tasks === "object") {
        site.tasks = site.tasks.length;
      }
      elem.addClass("site-" + site.address);
      if (site.peers) {
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
        error = site.bad_files + " file update failed";
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
      this.sites[site.address] = site;
      if (site.address === this.address && site.peers > 0) {
        $("#peers").text(site.peers);
      }
      return elem;
    };

    ZeroHello.prototype.reloadSites = function() {
      return this.cmd("siteList", {}, (function(_this) {
        return function(sites) {
          var elem, elem_category, sample_sites, site, _i, _j, _len, _len1;
		  
		  // shared.. (zerohello + lander apps)
          // $("#sites > :not(.template)").remove();
		  
          elem_category = $(".site-category.template").clone();
          elem_category.removeClass("template");
          $("#sites").append(elem_category);
          sites.sort(function(a, b) {
            return cmp(b["peers"], a["peers"]);
          });
          if (sites.length > 6) {
            $(".site-container.template").addClass("site-small");
          }
          for (_i = 0, _len = sites.length; _i < _len; _i++) {
            site = sites[_i];
            elem = $(".site-container.template").clone().removeClass("template");
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
            }, {
              "content": {
                "title": "ZeroMarket",
                "description": "Simple market demo (coming soon)"
              },
              "address": "ZeroMarket",
              "disabled": true,
              "settings": {
                "serving": false
              }
            }
          ];
          for (_j = 0, _len1 = sample_sites.length; _j < _len1; _j++) {
            site = sample_sites[_j];
            if ($(".site-" + site.address).length > 0) {
              continue;
            }
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

    ZeroHello.prototype.siteUpdate = function(address) {
      return this.cmd("siteUpdate", {
        "address": address
      });
    };

    ZeroHello.prototype.sitePause = function(address) {
      return this.cmd("sitePause", {
        "address": address
      });
    };

    ZeroHello.prototype.siteResume = function(address) {
      return this.cmd("siteResume", {
        "address": address
      });
    };

    ZeroHello.prototype.siteClone = function(address) {
      return this.cmd("siteClone", {
        "address": address
      });
    };

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
