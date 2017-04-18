


/* ---- data/1C2JhCunGLtvyX56nQ88tcb87WnXspjWN/js/utils/Class.coffee ---- */



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



/* ---- data/1C2JhCunGLtvyX56nQ88tcb87WnXspjWN/js/utils/Follow.coffee ---- */



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



/* ---- data/1C2JhCunGLtvyX56nQ88tcb87WnXspjWN/js/utils/InlineEditor.coffee ---- */


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




/* ---- data/1C2JhCunGLtvyX56nQ88tcb87WnXspjWN/js/User.coffee ---- */


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





/* ---- data/1C2JhCunGLtvyX56nQ88tcb87WnXspjWN/js/TopicList.coffee ---- */

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
	  $("a.editable-edit.icon-edit", elem).attr('style', 'position: relative; left: 30px;');
	  $(".title a.editable-edit.icon-edit", elem).attr('style', 'position: relative; left: -5px;');
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



/* ---- data/1C2JhCunGLtvyX56nQ88tcb87WnXspjWN/js/TopicShow.coffee ---- */


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



/* ---- data/1C2JhCunGLtvyX56nQ88tcb87WnXspjWN/js/ZeroTalk.coffee ---- */



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
	  alert("zerotalk init");
	  this.log("inited!");
      var i, len, ref, textarea;
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


