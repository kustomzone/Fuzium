/* zeronet api */
var bind = function(fn, me){ 
	return function() { 
		return fn.apply(me, arguments); 
	}; 
}

function ZeroFrame() {
	this.onCloseWebsocket = bind(this.onCloseWebsocket, this);
	this.onOpenWebsocket = bind(this.onOpenWebsocket, this);
	this.route = bind(this.route, this);
	this.onMessage = bind(this.onMessage, this);
	this.waiting_cb = {};
	this.wrapper_nonce = document.location.href.replace(/.*wrapper_nonce=([A-Za-z0-9]+).*/, "$1");
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
      $(".nickbar span").html(message.params.cert_user_id.replace('@zeroid.bit', '')); //.replace('@zeroid.bit', '')
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
    args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
    return console.log.apply(console, ["[ZeroFrame]"].concat(Array.prototype.slice.call(args)));
};

ZeroFrame.prototype.onOpenWebsocket = function() {
    return this.log("Websocket open");
};

ZeroFrame.prototype.onCloseWebsocket = function() {
    return this.log("Websocket close");
};

ZeroAPI = new ZeroFrame();

function loadTemplate(ntemplate, data) {
    $("section[n-template]").each(function() {
      $(this).addClass("hide");
    });

    if(!$("[n-template=\"" + ntemplate + "\"]").length) {
      ZeroAPI.cmd("fileGet", {
          "inner_path": "pages/" + ntemplate + ".html",
          "required": false
      }, (function(html) {
        $("main").append("<section n-template=\"" + ntemplate + "\">" + Mustache.render(html, data) + "</section>");
      }));
    } else {
      $("[n-template=\"" + ntemplate + "\"]").toggleClass("hide");
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

$(document).ready(function() {
  /* templates easy */
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
  $(document).on("submit", "#new-f", function () {
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
              alert("públished")
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
