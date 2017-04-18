var ZeroAPI = {

    waiting_cb: {},
    wrapper_nonce: document.location.href.replace(/.*wrapper_nonce=([A-Za-z0-9]+).*/, "$1"),
    next_message_id: 1,
    target: window.parent,

    connect: function() {
      window.addEventListener("message", this.onMessage, false);
      return this.cmd("innerReady");
    },

    onMessage: function(e) {
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
        return "testz";
      } else if (cmd === "wrapperClosedWebsocket") {
        return "test";
      } else {
        return this.route(cmd, message);
      }
    },

    route: function(cmd, message) {
      if (cmd === "setSiteInfo") {
        if (message.params.cert_user_id) {
          $("#logget").toggleClass("hide");
          $("#no-login").toggleClass("hide");
        }

        $(".nickbar span").html(message.params.cert_user_id.replace('@zeroid.bit', ''));
      } else {
        return this.log("Unknown command: " + cmd, message);
      }
    },

    cmd: function(cmd, params, cb) {
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
    },

    send: function(message, cb) {
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
    },

    log: function() {
      var args;
      args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
      return console.log.apply(console, ["[ZeroFrame]"].concat(Array.prototype.slice.call(args)));
    },

    onOpenWebsocket: function() {
      return this.log("Websocket open");
    },

    onCloseWebsocket: function() {
      return this.log("Websocket close");
    }

}

