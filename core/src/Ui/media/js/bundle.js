
window.electron = require('electron');
window.ipc      = electron.ipcRenderer;
window.remote   = electron.remote;

// const app = window.remote.app
// console.log(app)
// console.log(__dirname);

// requires; Dexie.min.js, Dragula.min.js, String_score.min.js (pre-loaded in wrapper.html)
// window.Dexie    = require('dexie');
// var dragula     = require('dragula');
// var stringScore = require('string_score');

// disable dragdrop, since it currently doesn't work
window.addEventListener('drop', function (e) {
  e.preventDefault();
});

// defines database schema
var db = new Dexie('browsingData');

// old version
db.version(2).stores({
  bookmarks:   'url, title, text, extraData', // url must come first so it is the primary key
  history:     'url, title, color, visitCount, lastVisit, extraData', // same thing
  readingList: 'url, time, visitCount, pageHTML, article, extraData' // article is the object from readability
})

// current version
db.version(3).stores({
  bookmarks:   'url, title, text, extraData', // url must come first so it is the primary key
  history:     'url, title, color, visitCount, lastVisit, extraData', // same thing
  readingList: 'url, time, visitCount, pageHTML, article, extraData', // article is the object from readability
  settings:    'key, value' // key is the name of the setting, value is an object
})

// Min >= 1.4.0
db.version(4).stores({
  /*
  color - the main color of the page, extracted from the page icon
  pageHTMl - a saved copy of the page's HTML, when it was last visited
  extractedText - the text content of the page, extracted from pageHTML,
  searchIndex - an array of words on the page (created from extractedText), used for full-text searchIndex
  isBookmarked - whether the page is a bookmark
  extraData - other metadata about the page
  */
  places: 'url, title, color, visitCount, lastVisit, pageHTML, extractedText, *searchIndex, isBookmarked, metadata',
  readingList: 'url, time, visitCount, pageHTML, article, extraData', // article is the object from readability
  settings: 'key, value', // key is the name of the setting, value is an object
})
  // upgrade from v3 to v4
  .upgrade(function (t) {
    // upgrade history items

    t.history.each(function (historyItem) {
      t.places.put({
        url: historyItem.url,
        title: historyItem.title,
        color: historyItem.color,
        visitCount: historyItem.visitCount,
        lastVisit: historyItem.lastVisit,
        // data not stored in the old database schema
        pageHTML: '',
        extractedText: '',
        searchIndex: [],
        // the old history table did not contain bookmarks
        isBookmarked: false,
        metadata: (historyItem.extraData || {}).metadata || {}
      })
    }).then(function () {

      // upgrade bookmarks

      t.bookmarks.each(function (bookmark) {
        // t.places.add cannot be used, since an item with the bookmark's url might already exist as a history item
        t.places.put({
          url: bookmark.url,
          title: bookmark.title,
          color: '',
          visitCount: 1,
          lastVisit: 1,
          pageHTML: '',
          extractedText: bookmark.text,
          searchIndex: bookmark.text.trim().toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/g),
          isBookmarked: true,
          metadata: (bookmark.extraData || {}).metadata || {}
        })
      })
    })

    // remove the old history and bookmarks tables

  // t.bookmarks.toCollection().delete()
  // t.history.toCollection().delete()
  })

// TODO set the value of the bookmarks and history tables to null in a future version to delete them - see https://github.com/dfahlander/Dexie.js/issues/276

/* current settings:

key - filtering
value - {trackers: boolean, contentTypes: array} */

db.open().then(function () {
  console.log('database opened ', performance.now())
})

Dexie.Promise.on('error', function (error) {
  console.warn('database error occured', error)
})
;var defaultKeyMap = {
  'addPrivateTab': 'shift+mod+p',
  'toggleTasks': 'shift+mod+e',
  'goBack': 'mod+left',
  'goForward': 'mod+right',
  'enterEditMode': ['mod+l', 'mod+k'],
  'completeSearchbar': 'mod+enter',
  'closeTab': 'mod+w',
  'gotoFirstTab': 'shift+mod+9',
  'gotoLastTab': 'mod+9',
  'addToFavorites': 'mod+d',
  'toggleReaderView': 'shift+mod+r',
  'switchToNextTab': ['option+mod+right', 'ctrl+tab', 'shift+mod+pagedown'],
  'switchToPreviousTab': ['option+mod+left', 'shift+ctrl+tab', 'shift+mod+pageup'],
  'closeAllTabs': 'shift+mod+n',
  'reload': 'mod+r',
  'showAndHideMenuBar': 'alt'
}
/* Utility function to override default mapping with user settings */
function userKeyMap (settings) {
  var keyMapCopy = Object.assign({}, defaultKeyMap)
  if (settings) {
    // override the default keymap by the user defined ones
    Object.keys(keyMapCopy).forEach(function (key) {
      if (settings[key]) {
        keyMapCopy[key] = settings[key]
      }
    })
  }
  return keyMapCopy
}
;/*
gets and sets settings
requires Dexie and util/database.js
*/

var settings = {
  loaded: false,
  list: {},
  onLoadCallbacks: [],
  get: function (key, cb, options) {
    var isCacheable = !options || options.fromCache !== false

    // get the setting from the cache if possible
    if (settings.loaded && isCacheable) {
      cb(settings.list[key])

    // if the settings haven't loaded, wait until they have
    } else if (isCacheable) {
      settings.onLoadCallbacks.push({
        key: key,
        cb: cb
      })

    // the setting can't be cached, get it from the database
    } else {
      db.settings.where('key').equals(key).first(function (item) {
        if (item) {
          cb(item.value)
        } else {
          cb(null)
        }
      })
    }
  },
  set: function (key, value, cb) {
    db.settings.put({
      key: key,
      value: value
    }).then(function () {
      settings.list[key] = value
      if (cb) {
        cb()
      }
    })
  },
  delete: function (key, cb) {
    db.settings.where('key').equals(key).delete()
      .then(function () {
        delete settings.list[key]
        if (cb) {
          cb()
        }
      })
  },
  load: function () {
    db.settings.each(function (setting) {
      settings.list[setting.key] = setting.value
    }).then(function () {
      settings.loaded = true

      settings.onLoadCallbacks.forEach(function (item) {
        item.cb(settings.list[item.key])
      })

      settings.onLoadCallbacks = []
    })
  },
  onLoad: function (cb) {
    if (settings.loaded) {
      cb()
    } else {
      settings.onLoadCallbacks.push({
        key: '',
        cb: cb
      })
    }
  }
}

settings.load()
;var currentSearchEngine = {
  name: '',
  searchURL: '%s'
}

var defaultSearchEngine = 'DuckDuckGo'

var searchEngines = {
  DuckDuckGo: {
    name: 'DuckDuckGo',
    searchURL: 'https://duckduckgo.com/?q=%s&t=min'
  },
  Google: {
    name: 'Google',
    searchURL: 'https://google.com/search?q=%s'
  },
  Bing: {
    name: 'Bing',
    searchURL: 'https://www.bing.com/search?q=%s'
  },
  Yahoo: {
    name: 'Yahoo',
    searchURL: 'https://search.yahoo.com/yhs/search?p=%s'
  },
  Baidu: {
    name: 'Baidu',
    searchURL: 'https://www.baidu.com/s?wd=%s'
  },
  StartPage: {
    name: 'StartPage',
    searchURL: 'https://startpage.com/do/search?q=%s'
  },
  Wikipedia: {
    name: 'Wikipedia',
    searchURL: 'https://wikipedia.org/w/index.php?search=%s'
  },
  Yandex: {
    name: 'Yandex',
    searchURL: 'https://yandex.com/search/?text=%s'
  },
  none: {
    name: 'none',
    searchURL: 'http://%s'
  }
}

settings.get('searchEngine', function (value) {
  if (value) {
    currentSearchEngine = searchEngines[value]
  } else {
    currentSearchEngine = searchEngines[defaultSearchEngine]
  }
})
;settings.get('menuBarVisible', function (value) {
  if (value === false) {
    remote.getCurrentWindow().setMenuBarVisibility(false)
  } else {
    // menu bar should be visible, do nothing
  }
})

function showMenuBar () {
  remote.getCurrentWindow().setMenuBarVisibility(true)
  settings.set('menuBarVisible', true)
}

function hideMenuBar () {
  remote.getCurrentWindow().setMenuBarVisibility(false)
  settings.set('menuBarVisible', false)
}

function toggleMenuBar () {
  settings.get('menuBarVisible', function (value) {
    if (value === false) {
      showMenuBar()
    } else {
      hideMenuBar()
    }
  })
}
;var tabState = {
  tasks: [], // each task is {id, name, tabs: [], selectedTab}
  selectedTask: null
}

var tabPrototype = {
  add: function (tab, index) {
    // make sure the tab exists before we create it
    if (!tab) {
      var tab = {}
    }

    var tabId = String(tab.id || Math.round(Math.random() * 100000000000000000)) // you can pass an id that will be used, or a random one will be generated.

    var newTab = {
      url: tab.url || '',
      title: tab.title || '',
      id: tabId,
      lastActivity: tab.lastActivity || Date.now(),
      secure: tab.secure,
      private: tab.private || false,
      readerable: tab.readerable || false,
      backgroundColor: tab.backgroundColor,
      foregroundColor: tab.foregroundColor,
      selected: tab.selected || false
    }

    if (index) {
      this.splice(index, 0, newTab)
    } else {
      this.push(newTab)
    }

    return tabId
  },
  update: function (id, data) {
    if (!this.get(id)) {
      throw new ReferenceError('Attempted to update a tab that does not exist.')
    }
    var index = -1
    for (var i = 0; i < this.length; i++) {
      if (this[i].id === id) {
        index = i
      }
    }
    for (var key in data) {
      if (data[key] === undefined) {
        throw new ReferenceError('Key ' + key + ' is undefined.')
      }
      this[index][key] = data[key]
    }
  },
  destroy: function (id) {
    for (var i = 0; i < this.length; i++) {
      if (this[i].id === id) {
        this.splice(i, 1)
        return i
      }
    }
    return false
  },
  destroyAll: function () {
    // this = [] doesn't work, so set the length of the array to 0 to remove all of the itemss
    this.length = 0
  },
  get: function (id) {
    if (!id) { // no id provided, return an array of all tabs
      // it is important to deep-copy the tab objects when returning them. Otherwise, the original tab objects get modified when the returned tabs are modified (such as when processing a url).
      var tabsToReturn = []
      for (var i = 0; i < this.length; i++) {
        tabsToReturn.push(JSON.parse(JSON.stringify(this[i])))
      }
      return tabsToReturn
    }
    for (var i = 0; i < this.length; i++) {
      if (this[i].id === id) {
        return JSON.parse(JSON.stringify(this[i]))
      }
    }
    return undefined
  },
  getIndex: function (id) {
    for (var i = 0; i < this.length; i++) {
      if (this[i].id === id) {
        return i
      }
    }
    return -1
  },
  getSelected: function () {
    for (var i = 0; i < this.length; i++) {
      if (this[i].selected) {
        return this[i].id
      }
    }
    return null
  },
  getAtIndex: function (index) {
    return this[index] || undefined
  },
  setSelected: function (id) {
    if (!this.get(id)) {
      throw new ReferenceError('Attempted to select a tab that does not exist.')
    }
    for (var i = 0; i < this.length; i++) {
      if (this[i].id === id) {
        this[i].selected = true
      } else {
        this[i].selected = false
      }
    }
  },
  count: function () {
    return this.length
  },
  reorder: function (newOrder) { // newOrder is an array of [tabId, tabId] that indicates the order that tabs should be in
    this.sort(function (a, b) {
      return newOrder.indexOf(a.id) - newOrder.indexOf(b.id)
    })
  }
}

function getRandomId () {
  return Math.round(Math.random() * 100000000000000000)
}

var tasks = {
  add: function (task, index) {
    if (!task) {
      task = {}
    }

    var newTask = {
      name: task.name || null,
      tabs: task.tabs || [],
      selectedTab: task.selectedTab || null,
      id: task.id || String(getRandomId())
    }

    // task.currentTask.tabs.__proto__ = tabPrototype

    for (var key in tabPrototype) {
      newTask.tabs.__proto__[key] = tabPrototype[key]
    }

    if (index) {
      tabState.tasks.splice(index, 0, newTask)
    } else {
      tabState.tasks.push(newTask)
    }

    return newTask.id
  },
  get: function (id) {
    if (!id) {
      return tabState.tasks
    }

    for (var i = 0; i < tabState.tasks.length; i++) {
      if (tabState.tasks[i].id === id) {
        return tabState.tasks[i]
      }
    }
    return null
  },
  setSelected: function (id) {
    tabState.selectedTask = id
    window.currentTask = tasks.get(id)
    window.tabs = currentTask.tabs
  },
  destroy: function (id) {
    for (var i = 0; i < tabState.tasks.length; i++) {
      if (tabState.tasks[i].id === id) {
        tabState.tasks.splice(i, 1)
        return i
      }
    }
    return false
  },
  destroyAll: function () {
    tabState.tasks = []
    currentTask = null
  },
  update: function (id, data) {
    if (!tasks.get(id)) {
      throw new ReferenceError('Attempted to update a task that does not exist.')
    }

    for (var i = 0; i < tabState.tasks.length; i++) {
      if (tabState.tasks[i].id === id) {
        for (var key in data) {
          tabState.tasks[i][key] = data[key]
        }
        break
      }
    }
  },
  getLastActivity: function (id) {
    var tabs = tasks.get(id).tabs
    var lastActivity = 0

    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].lastActivity > lastActivity) {
        lastActivity = tabs[i].lastActivity
      }
    }

    return lastActivity
  }
}

function getSelectedTask () {
  return getTask(tabState.selectedTask)
}

function isEmpty (tabList) {
  if (!tabList || tabList.length === 0) {
    return true
  }

  if (tabList.length === 1 && (!tabList[0].url || tabList[0].url === 'about:blank')) {
    return true
  }

  return false
}
;// cache host file entries for host matching
var hosts = []

var HOSTS_FILE = process.platform === 'win32'
  ? 'C:/Windows/System32/drivers/etc/hosts'
  : '/etc/hosts'

require('fs').readFile(HOSTS_FILE, 'utf8', function (err, data) {
  if (err) {
    return
  }

  data = data.replace(/(\s|#.*|255\.255\.255\.255|broadcasthost)+/g, ' ').split(' ')

  data.forEach(function (host) {
    if (host.length > 0 && hosts.indexOf(host) === -1) {
      hosts.push(host)
    }
  })
})

var urlParser = {
  startingWWWRegex: /www\.(.+\..+\/)/g,
  trailingSlashRegex: /\/$/g,
  isURL: function (url) {
    return url.indexOf('http://') === 0 || url.indexOf('https://') === 0 || url.indexOf('file://') === 0 || url.indexOf('about:') === 0 || url.indexOf('chrome:') === 0 || url.indexOf('data:') === 0
  },
  isSystemURL: function (url) {
    return url.indexOf('chrome') === 0 || url.indexOf('about:') === 0
  },
  removeProtocol: function (url) {
    if (!urlParser.isURL(url)) {
      return url
    }

    var withoutProtocol = url.replace('http://', '').replace('https://', '').replace('file://', '') // chrome:, about:, data: protocols intentionally not removed

    if (withoutProtocol.indexOf('www.') === 0) {
      return withoutProtocol.replace('www.', '')
    } else {
      return withoutProtocol
    }
  },
  isURLMissingProtocol: function (url) {
    if (url.indexOf(' ') === -1 && url.indexOf('.') > 0) {
      return true
    }
    var hostPart = url.replace(/(:|\/).+/, '')
    return hosts.indexOf(hostPart) > -1
  },
  parse: function (url) {
    url = url.trim() // remove whitespace common on copy-pasted url's

    if (!url) {
      return 'about:blank'
    }
    // if the url starts with a (supported) protocol, do nothing
    if (urlParser.isURL(url)) {
      return url
    }

    if (url.indexOf('view-source:') === 0) {
      var realURL = url.replace('view-source:', '')

      return 'view-source:' + urlParser.parse(realURL)
    }

    // if the url doesn't have a space and has a ., or is a host from hosts file, assume it is a url without a protocol
    if (urlParser.isURLMissingProtocol(url)) {
      return 'http://' + url
    }
    // else, do a search
    return currentSearchEngine.searchURL.replace('%s', encodeURIComponent(url))
  },
  prettyURL: function (url) {
    try {
      var urlOBJ = new URL(url)
      return (urlOBJ.hostname + urlOBJ.pathname).replace(urlParser.startingWWWRegex, '$1').replace(urlParser.trailingSlashRegex, '')
    } catch (e) { // URL constructor will throw an error on malformed URLs
      return url
    }
  },
  areEqual: function (url1, url2) {
    try {
      var obj1 = new URL(url1)
      var obj2 = new URL(url2)

      return obj1.hostname === obj2.hostname && obj1.pathname === obj2.pathname
    } catch (e) { // if either of the url's are invalid, the URL constructor will throw an error
      return url1 === url2
    }
  }
}
;// gets the tracking settings and sends them to the main process

var setFilteringSettings = remote.getGlobal('setFilteringSettings')
var registerFiltering = remote.getGlobal('registerFiltering')

settings.get('filtering', setFilteringSettings)
;/* implements selecting webviews, switching between them, and creating new ones. */

var phishingWarningPage = 'file://' + __dirname + '/pages/phishing/index.html' // TODO move this somewhere that actually makes sense
var crashedWebviewPage = 'file:///' + __dirname + '/pages/crash/index.html'
var errorPage = 'file:///' + __dirname + '/pages/error/index.html'

var webviewBase = document.getElementById('webviews')
var webviewEvents = []
var webviewIPC = []

// this only affects newly created webviews, so all bindings should be done on startup

function bindWebviewEvent (event, fn) {
  webviewEvents.push({
    event: event,
    fn: fn
  })
}

// function is called with (webview, tabId, IPCArguements)

function bindWebviewIPC (name, fn) {
  webviewIPC.push({
    name: name,
    fn: fn
  })
}

// the permissionRequestHandler used for webviews
function pagePermissionRequestHandler (webContents, permission, callback) {
  if (permission === 'notifications' || permission === 'fullscreen') {
    callback(true)
  } else {
    callback(false)
  }
}

// called whenever the page url changes

function onPageLoad (e) {
  var tab = this.getAttribute('data-tab')
  var url = this.getAttribute('src') // src attribute changes whenever a page is loaded

  if (url.indexOf('https://') === 0 || url.indexOf('about:') === 0 || url.indexOf('chrome:') === 0 || url.indexOf('file://') === 0) {
    tabs.update(tab, {
      secure: true,
      url: url
    })
  } else {
    tabs.update(tab, {
      secure: false,
      url: url
    })
  }

  rerenderTabElement(tab)
}

// called when js/webview/textExtractor.js returns the page's text content
bindWebviewIPC('pageData', function (webview, tabId, arguments) {
  var tab = tabs.get(tabId),
      data = arguments[0]

  var isInternalPage = tab.url.indexOf(__dirname) !== -1 && tab.url.indexOf(readerView.readerURL) === -1

  // don't save to history if in private mode, or the page is a browser page
  if (tab.private === false && !isInternalPage) {
    bookmarks.updateHistory(tabId, data.pageHTML, data.extractedText, data.metadata)
  }
})

// set the permissionRequestHandler for non-private tabs

remote.session.defaultSession.setPermissionRequestHandler(pagePermissionRequestHandler)

function getWebviewDom (options) {
  var w = document.createElement('webview')
  w.setAttribute('preload', 'dist/webview.min.js')

  if (options.url) {
    w.setAttribute('src', urlParser.parse(options.url))
  }

  w.setAttribute('data-tab', options.tabId)

  // if the tab is private, we want to partition it. See http://electron.atom.io/docs/v0.34.0/api/web-view-tag/#partition
  // since tab IDs are unique, we can use them as partition names
  if (tabs.get(options.tabId).private === true) {
    var partition = options.tabId.toString() // options.tabId is a number, which remote.session.fromPartition won't accept. It must be converted to a string first

    w.setAttribute('partition', partition)

    // register permissionRequestHandler for this tab
    // private tabs use a different session, so the default permissionRequestHandler won't apply

    remote.session.fromPartition(partition).setPermissionRequestHandler(pagePermissionRequestHandler)

    // enable ad/tracker/contentType blocking in this tab if needed

    registerFiltering(partition)
  }

  // webview events

  webviewEvents.forEach(function (i) {
    w.addEventListener(i.event, i.fn)
  })

  w.addEventListener('page-favicon-updated', function (e) {
    var id = this.getAttribute('data-tab')
    updateTabColor(e.favicons, id)
  })

  w.addEventListener('page-title-set', function (e) {
    var tab = this.getAttribute('data-tab')
    tabs.update(tab, {
      title: e.title
    })
    rerenderTabElement(tab)
  })

  w.addEventListener('did-finish-load', onPageLoad)
  w.addEventListener('did-navigate-in-page', onPageLoad)

  /* w.on("did-get-redirect-request", function (e) {
  	console.log(e.originalEvent)
  }); */

  // open links in new tabs

  w.addEventListener('new-window', function (e) {
    var tab = this.getAttribute('data-tab')
    var currentIndex = tabs.getIndex(tabs.getSelected())

    var newTab = tabs.add({
      url: e.url,
      private: tabs.get(tab).private // inherit private status from the current tab
    }, currentIndex + 1)
    addTab(newTab, {
      enterEditMode: false,
      openInBackground: e.disposition === 'background-tab' // possibly open in background based on disposition
    })
  })

  w.addEventListener('close', function (e) {
    closeTab(this.getAttribute('data-tab'))
  })

  // In embedder page. Send the text content to bookmarks when recieved.
  w.addEventListener('ipc-message', function (e) {
    var w = this
    var tab = this.getAttribute('data-tab')

    webviewIPC.forEach(function (item) {
      if (item.name === e.channel) {
        item.fn(w, tab, e.args)
      }
    })

    if (e.channel === 'phishingDetected') {
      // check if the page is on the phishing detection whitelist

      var url = w.getAttribute('src')

      try {
        var hostname = new URL(url).hostname
      } catch (e) {
        var hostname = ''
      }

      settings.get('phishingWhitelist', function (value) {
        if (!value || !hostname || value.indexOf(hostname) === -1) {
          // show the warning page
          navigate(tab, phishingWarningPage + '?url=' + encodeURIComponent(url))
        }
      }, {
        fromCache: false
      })
    }
  })

  w.addEventListener('contextmenu', webviewMenu.show)

  w.addEventListener('crashed', function (e) {
    var tabId = this.getAttribute('data-tab')

    destroyWebview(tabId)
    tabs.update(tabId, {
      url: crashedWebviewPage
    })

    addWebview(tabId)
    switchToWebview(tabId)
  })

  w.addEventListener('did-fail-load', function (e) {
    if (e.errorCode !== -3 && e.validatedURL === e.target.getURL()) {
      navigate(this.getAttribute('data-tab'), errorPage + '?ec=' + encodeURIComponent(e.errorCode) + '&url=' + e.target.getURL())
    }
  })

  w.addEventListener('enter-html-full-screen', function (e) {
    this.classList.add('fullscreen')
  })

  w.addEventListener('leave-html-full-screen', function (e) {
    this.classList.remove('fullscreen')
  })

  return w
}

/* options: openInBackground: should the webview be opened without switching to it? default is false. */

function addWebview (tabId) {
  var tabData = tabs.get(tabId)

  var webview = getWebviewDom({
    tabId: tabId,
    url: tabData.url
  })

  // this is used to hide the webview while still letting it load in the background
  // webviews are hidden when added - call switchToWebview to show it
  webview.classList.add('hidden')

  webviewBase.appendChild(webview)

  return webview
}

function switchToWebview (id) {
  var webviews = document.getElementsByTagName('webview')
  for (var i = 0; i < webviews.length; i++) {
    webviews[i].hidden = true
  }

  var wv = getWebview(id)

  if (!wv) {
    wv = addWebview(id)
  }

  wv.classList.remove('hidden')
  wv.hidden = false
}

function updateWebview (id, url) {
  getWebview(id).setAttribute('src', urlParser.parse(url))
}

function destroyWebview (id) {
  var w = document.querySelector('webview[data-tab="{id}"]'.replace('{id}', id))
  if (w) {
    w.parentNode.removeChild(w)
  }
}

function getWebview (id) {
  return document.querySelector('webview[data-tab="{id}"]'.replace('{id}', id))
}
;var Menu = remote.Menu
var MenuItem = remote.MenuItem
var clipboard = remote.clipboard

var webviewMenu = {
  cache: {
    event: null,
    webview: null
  },
  loadFromContextData: function (IPCdata) {
    var tab = tabs.get(tabs.getSelected())

    var event = webviewMenu.cache.event

    var menu = new Menu()

    // if we have a link (an image source or an href)
    if (IPCdata.src && !isFocusMode) { // new tabs can't be created in focus mode
      // show what the item is

      if (IPCdata.src.length > 60) {
        var caption = IPCdata.src.substring(0, 60) + '...'
      } else {
        var caption = IPCdata.src
      }

      menu.append(new MenuItem({
        label: caption,
        enabled: false
      }))
      menu.append(new MenuItem({
        label: 'Open in New Tab',
        click: function () {
          var newTab = tabs.add({
            url: IPCdata.src,
            private: tab.private
          }, tabs.getIndex(tabs.getSelected()) + 1)

          addTab(newTab, {
            enterEditMode: false
          })

          getWebview(newTab).focus()
        }
      }))

      // if the current tab isn't private, we want to provide an option to open the link in a private tab

      if (!tab.private) {
        menu.append(new MenuItem({
          label: 'Open in New Private Tab',
          click: function () {
            var newTab = tabs.add({
              url: IPCdata.src,
              private: true
            }, tabs.getIndex(tabs.getSelected()) + 1)
            addTab(newTab, {
              enterEditMode: false
            })

            getWebview(newTab).focus()
          }
        }))
      }

      if (!IPCdata.image) {
        menu.append(new MenuItem({
          type: 'separator'
        }))

        menu.append(new MenuItem({
          label: 'Save Link As...',
          click: function () {
            remote.getCurrentWebContents().downloadURL(IPCdata.src)
          }
        }))
      }

      menu.append(new MenuItem({
        type: 'separator'
      }))

      menu.append(new MenuItem({
        label: 'Copy link',
        click: function () {
          clipboard.writeText(IPCdata.src)
        }
      }))
    }

    if (IPCdata.selection) {
      menu.append(new MenuItem({
        label: 'Copy',
        click: function () {
          clipboard.writeText(IPCdata.selection)
        }
      }))

      menu.append(new MenuItem({
        type: 'separator'
      }))

      menu.append(new MenuItem({
        label: 'Search with ' + currentSearchEngine.name,
        click: function () {
          var newTab = tabs.add({
            url: currentSearchEngine.searchURL.replace('%s', encodeURIComponent(IPCdata.selection)),
            private: tab.private
          })
          addTab(newTab, {
            enterEditMode: false
          })

          getWebview(newTab).focus()
        }
      }))
    }

    if (IPCdata.image) {
      menu.append(new MenuItem({
        label: 'View image',
        click: function () {
          navigate(webviewMenu.cache.tab, IPCdata.image)
        }
      }))
      menu.append(new MenuItem({
        label: 'Save image',
        click: function () {
          remote.getCurrentWebContents().downloadURL(IPCdata.image)
        }
      }))
    }

    menu.append(new MenuItem({
      label: 'Inspect Element',
      click: function () {
        webviewMenu.cache.webview.inspectElement(event.x, event.y)
      }
    }))

    menu.popup(remote.getCurrentWindow())
  },
  /* cxevent: a contextmenu event. Can be a jquery event or a regular event. */
  show: function (cxevent) {
    var event = cxevent.originalEvent || cxevent
    webviewMenu.cache.event = event

    var currentTab = tabs.getSelected()
    var webview = getWebview(currentTab)

    webviewMenu.cache.tab = currentTab
    webviewMenu.cache.webview = webview

    webview.send('getContextData', {
      x: event.offsetX,
      y: event.offsetY
    }) // some menu items require recieving data from the page
  }
}

bindWebviewIPC('contextData', function (webview, tabId, arguements) {
  webviewMenu.loadFromContextData(arguements[0])
})
;var bookmarks = {
  updateHistory: function (tabId, pageHTML, extractedText, metadata) {
    /* this prevents pages that are immediately left from being saved to history, and also gives the page-favicon-updated event time to fire (so the colors saved to history are correct). */
    setTimeout(function () {
      var tab = tabs.get(tabId)
      if (tab) {
        var data = {
          url: tab.url,
          title: tab.title,
          color: tab.backgroundColor,
          pageHTML: pageHTML || '',
          extractedText: extractedText,
          metadata: metadata
        }

        bookmarks.worker.postMessage({
          action: 'updateHistory',
          pageData: data
        })
      }
    }, 500)
  },
  callbacks: [],
  addWorkerCallback: function (callback) {
    var callbackId = Date.now()
    bookmarks.callbacks.push({id: callbackId, fn: callback})
    return callbackId
  },
  runWorkerCallback: function (id, data) {
    for (var i = 0; i < bookmarks.callbacks.length; i++) {
      if (bookmarks.callbacks[i].id == id) {
        bookmarks.callbacks[i].fn(data)
        bookmarks.callbacks.splice(i, 1)
      }
    }
  },
  deleteHistory: function (url) {
    bookmarks.worker.postMessage({
      action: 'deleteHistory',
      pageData: {
        url: url
      }
    })
  },
  searchPlaces: function (text, callback) {
    var callbackId = bookmarks.addWorkerCallback(callback)
    bookmarks.worker.postMessage({
      action: 'searchPlaces',
      text: text,
      callbackId: callbackId
    })
  },
  searchPlacesFullText: function (text, callback) {
    var callbackId = bookmarks.addWorkerCallback(callback)
    bookmarks.worker.postMessage({
      action: 'searchPlacesFullText',
      text: text,
      callbackId: callbackId
    })
  },
  getPlaceSuggestions: function (url, callback) {
    var callbackId = bookmarks.addWorkerCallback(callback)
    bookmarks.worker.postMessage({
      action: 'getPlaceSuggestions',
      text: url,
      callbackId: callbackId
    })
  },
  onMessage: function (e) { // assumes this is from a search operation
    bookmarks.runWorkerCallback(e.data.callbackId, e.data.result)
  },
  updateBookmarkState: function (tabId, shouldBeBookmarked) {
    var url = tabs.get(tabId).url
    db.places.where('url').equals(url).first(function (item) {
      // a history item already exists, update it
      if (item) {
        db.places.where('url').equals(url).modify({isBookmarked: shouldBeBookmarked})
      } else {
        // create a new history item
        // this should only happen if the page hasn't finished loading yet
        db.places.add({
          url: url,
          title: url,
          color: '',
          visitCount: 1,
          lastVisit: Date.now(),
          pageHTML: '',
          extractedText: '',
          searchIndex: [],
          isBookmarked: shouldBeBookmarked,
          metadata: {}
        })
      }
    })
  },
  bookmark: function (tabId) {
    bookmarks.updateBookmarkState(tabId, true)
  },
  deleteBookmark: function (tabId) {
    bookmarks.updateBookmarkState(tabId, false)
  },
  toggleBookmarked: function (tabId) { // toggles a bookmark. If it is bookmarked, delete the bookmark. Otherwise, add it.
    var url = tabs.get(tabId).url

    db.places.where('url').equals(url).first(function (item) {
      if (item && item.isBookmarked) {
        bookmarks.deleteBookmark(tabId)
      } else {
        bookmarks.bookmark(tabId)
      }
    })
  },
  handleStarClick: function (star) {
    star.classList.toggle('fa-star')
    star.classList.toggle('fa-star-o')

    bookmarks.toggleBookmarked(star.getAttribute('data-tab'))
  },
  getStar: function (tabId) {
    var star = document.createElement('i')
    star.setAttribute('data-tab', tabId)
    star.className = 'fa fa-star-o bookmarks-button' // alternative icon is fa-bookmark

    star.addEventListener('click', function (e) {
      bookmarks.handleStarClick(e.target)
    })

    return bookmarks.renderStar(tabId, star)
  },
  renderStar: function (tabId, star) { // star is optional
    star = star || document.querySelector('.bookmarks-button[data-tab="{id}"]'.replace('{id}', tabId))

    var currentURL = tabs.get(tabId).url

    if (!currentURL || currentURL === 'about:blank') { // no url, can't be bookmarked
      star.hidden = true
      return star
    } else {
      star.hidden = false
    }

    // check if the page is bookmarked or not, and update the star to match

    db.places.where('url').equals(currentURL).first(function (item) {
      if (item && item.isBookmarked) {
        star.classList.remove('fa-star-o')
        star.classList.add('fa-star')
      } else {
        star.classList.remove('fa-star')
        star.classList.add('fa-star-o')
      }
    })
    return star
  },
  init: function () {
    bookmarks.worker = new Worker('js/bookmarksHistory/placesWorker.js')
    bookmarks.worker.onmessage = bookmarks.onMessage
  }
}

bookmarks.init()
;/* common to webview, tabrenderer, etc */

function navigate (tabId, newURL) {
  // go to URL - hide bookmarks
  var lander = document.getElementById('app')
  console.log(lander)
  lander.setAttribute('style', 'display: none')
  
  newURL = urlParser.parse(newURL)

  tabs.update(tabId, {
    url: newURL
  })

  updateWebview(tabId, newURL)

  leaveTabEditMode({
    blur: true
  })
}

function destroyTask (id) {
  var task = tasks.get(id)

  task.tabs.forEach(function (tab) {
    destroyWebview(tab.id)
  })

  tasks.destroy(id)
}

// destroys the webview and tab element for a tab
function destroyTab (id) {
  var tabEl = getTabElement(id)
  tabEl.parentNode.removeChild(tabEl)

  var t = tabs.destroy(id) // remove from state - returns the index of the destroyed tab
  destroyWebview(id) // remove the webview
}

// destroys a tab, and either switches to the next tab or creates a new one
function closeTab (tabId) {
  /* disabled in focus mode */
  if (isFocusMode) {
    showFocusModeError()
    return
  }

  if (tabId === tabs.getSelected()) {
    var currentIndex = tabs.getIndex(tabs.getSelected())
    var nextTab = tabs.getAtIndex(currentIndex - 1) || tabs.getAtIndex(currentIndex + 1)

    destroyTab(tabId)

    if (nextTab) {
      switchToTab(nextTab.id)
    } else {
      addTab()
    }
  } else {
    destroyTab(tabId)
  }
}

function switchToTask (id) {
  tasks.setSelected(id)

  rerenderTabstrip()

  var taskData = tasks.get(id)

  if (taskData.tabs.length > 0) {
    var selectedTab = taskData.tabs.getSelected()

    // if the task has no tab that is selected, switch to the most recent one

    if (!selectedTab) {
      selectedTab = taskData.tabs.get().sort(function (a, b) {
        return b.lastActivity - a.lastActivity
      })[0].id
    }

    switchToTab(selectedTab)
  } else {
    addTab()
  }
}

/* switches to a tab - update the webview, state, tabstrip, etc. */

function switchToTab (id, options) {
  options = options || {}

  /* tab switching disabled in focus mode */
  if (isFocusMode) {
    showFocusModeError()
    return
  }

  leaveTabEditMode()

  tabs.setSelected(id)
  setActiveTabElement(id)
  switchToWebview(id)

  if (options.focusWebview !== false) {
    getWebview(id).focus()
  }

  var tabData = tabs.get(id)
  setColor(tabData.backgroundColor, tabData.foregroundColor)

  // we only want to mark the tab as active if someone actually interacts with it. If it is clicked on and then quickly clicked away from, it should still be marked as inactive

  setTimeout(function () {
    if (tabs.get(id) && tabs.getSelected() === id) {
      tabs.update(id, {
        lastActivity: Date.now()
      })
      tabActivity.refresh()
    }
  }, 2500)

  sessionRestore.save()
}
;// common regex's

var trailingSlashRegex = /\/$/g
var plusRegex = /\+/g

// https://remysharp.com/2010/07/21/throttling-function-calls#

function throttle (fn, threshhold, scope) {
  threshhold || (threshhold = 250)
  var last,
    deferTimer
  return function () {
    var context = scope || this

    var now = new Date()
    var args = arguments
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer)
      deferTimer = setTimeout(function () {
        last = now
        fn.apply(context, args)
      }, threshhold)
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}

function debounce (fn, delay) {
  var timer = null
  return function () {
    var context = this
    var args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

function empty (node) {
  var n
  while (n = node.firstElementChild) {
    node.removeChild(n)
  }
}

function removeTags (text) {
  return text.replace(/<.*?>/g, '')
}

function openURLInBackground (url) { // used to open a url in the background, without leaving the searchbar
  var newTab = tabs.add({
    url: url,
    private: tabs.get(tabs.getSelected()).private
  }, tabs.getIndex(tabs.getSelected()) + 1)
  addTab(newTab, {
    enterEditMode: false,
    openInBackground: true,
    leaveEditMode: false
  })

  var i = searchbar.querySelector('.searchbar-item:focus')
  if (i) { // remove the highlight from an awesomebar result item, if there is one
    i.blur()
  }
}
// when clicking on a result item, this function should be called to open the URL

function openURLFromsearchbar (event, url) {

  // TODO decide if this should go somewhere else

  // if the url is a !bang search
  if (url.indexOf('!') === 0) {
    var selectedBang = url.split(' ')[0]

    // get all of the !bangs that could match
    var bangs = searchCustomBangs(selectedBang)

    // if there are !bangs that possibly match
    if (bangs.length !== 0) {

      // find the ones that are an exact match, and run them
      for (var i = 0; i < bangs.length; i++) {
        if (bangs[i].phrase === selectedBang) {
          leaveTabEditMode()
          if (url.indexOf(selectedBang + ' ') === -1) {
            var text = url.replace(selectedBang, '')
          } else {
            var text = url.replace(selectedBang + ' ', '')
          }
          bangs[i].fn(text)
          // don't open the URL
          return
        }
      }
    }
  }

  if (event.metaKey) {
    openURLInBackground(url)
    return true
  } else {
    navigate(tabs.getSelected(), url)

    if (!tabs.get(tabs.getSelected()).private) {
      /*
      //show the color and title of the new page immediately, to make the page load time seem faster
      currentHistoryResults.forEach(function (res) {
      	if (res.url == url) {
      		setColor(res.color, getTextColor(getRGBObject(res.color)))
      		tabs.update(tabs.getSelected(), {
      			title: res.title,
      		})
      		rerenderTabElement(tabs.getSelected())
      	}
      })
      */
    }

    return false
  }
}

// attempts to shorten a page title, removing useless text like the site name

function getRealTitle (text) {
  // don't try to parse URL's
  if (urlParser.isURL(text)) {
    return text
  }

  var possibleCharacters = ['|', ':', ' - ', ' — ']

  for (var i = 0; i < possibleCharacters.length; i++) {
    var char = possibleCharacters[i]
    // match url's of pattern: title | website name
    var titleChunks = text.split(char)

    if (titleChunks.length >= 2) {
      titleChunks[0] = titleChunks[0].trim()
      titleChunks[1] = titleChunks[1].trim()

      if (titleChunks[1].length < 5 || titleChunks[1].length / titleChunks[0].length <= 0.5) {
        return titleChunks[0]
      }
    }
  }

  // fallback to the regular title

  return text
}

// swipe left on history items to delete them

var lastItemDeletion = Date.now()

// creates a result item

/*
data:

title: string - the title of the item
secondaryText: string - the item's secondary text
url: string - the item's url (if there is one).
icon: string - the name of a font awesome icon.
image: string - the URL of an image to show
iconImage: string - the URL of an image to show as an icon
descriptionBlock: string - the text in the description block,
attribution: string - attribution text to display when the item is focused
delete: function - a function to call to delete the result item when a left swipe is detected
classList: array - a list of classes to add to the item
*/

function createSearchbarItem (data) {
  var item = document.createElement('div')
  item.classList.add('searchbar-item')

  item.setAttribute('tabindex', '-1')

  if (data.classList) {
    for (var i = 0; i < data.classList.length; i++) {
      item.classList.add(data.classList[i])
    }
  }

  if (data.icon) {
    var i = document.createElement('i')
    i.className = 'fa' + ' ' + data.icon

    item.appendChild(i)
  }

  if (data.title) {
    var title = document.createElement('span')
    title.classList.add('title')

    title.textContent = data.title

    item.appendChild(title)
  }

  if (data.url) {
    item.setAttribute('data-url', data.url)

    item.addEventListener('click', function (e) {
      openURLFromsearchbar(e, data.url)
    })
  }

  if (data.secondaryText) {
    var secondaryText = document.createElement('span')
    secondaryText.classList.add('secondary-text')

    secondaryText.textContent = data.secondaryText

    item.appendChild(secondaryText)
  }

  if (data.image) {
    var image = document.createElement('img')
    image.className = 'image low-priority-image'
    image.src = data.image

    item.insertBefore(image, item.childNodes[0])
  }

  if (data.iconImage) {
    var iconImage = document.createElement('img')
    iconImage.className = 'icon-image low-priority-image'
    iconImage.src = data.iconImage

    item.insertBefore(iconImage, item.childNodes[0])
  }

  if (data.descriptionBlock) {
    var dBlock = document.createElement('span')
    dBlock.classList.add('description-block')

    dBlock.textContent = data.descriptionBlock
    item.appendChild(dBlock)
  }

  if (data.attribution) {
    var attrBlock = document.createElement('span')
    attrBlock.classList.add('attribution')

    attrBlock.textContent = data.attribution
    item.appendChild(attrBlock)
  }

  if (data.delete) {
    item.addEventListener('mousewheel', function (e) {
      var self = this
      if (e.deltaX > 50 && e.deltaY < 3 && Date.now() - lastItemDeletion > 700) {
        lastItemDeletion = Date.now()

        self.style.opacity = '0'
        self.style.transform = 'translateX(-100%)'

        setTimeout(function () {
          data.delete(self)
          self.parentNode.removeChild(self)
          lastItemDeletion = Date.now()
        }, 200)
      }
    })
  }

  return item
}

var searchbar = document.getElementById('searchbar')

function showSearchbar (triggerInput) {
  searchbar.hidden = false

  currentSearchbarInput = triggerInput
}

// gets the typed text in an input, ignoring highlighted suggestions

function getValue (input) {
  var text = input.value
  return text.replace(text.substring(input.selectionStart, input.selectionEnd), '')
}

function hidesearchbar () {
  currentSearchbarInput = null
  searchbar.hidden = true

  clearSearchbar()
}
var showSearchbarResults = function (text, input, event) {
  // find the real input value, accounting for highlighted suggestions and the key that was just pressed
  // delete key doesn't behave like the others, String.fromCharCode returns an unprintable character (which has a length of one)

  if (event && event.keyCode !== 8) {
    var realText = text.substring(0, input.selectionStart) + String.fromCharCode(event.keyCode) + text.substring(input.selectionEnd, text.length)
  } else {
    var realText = text
  }

  console.log('searchbar: ', realText)

  runPlugins(realText, input, event)
}

function focussearchbarItem (options) {
  options = options || {} // fallback if options is null
  var previous = options.focusPrevious

  var allItems = [].slice.call(searchbar.querySelectorAll('.searchbar-item:not(.unfocusable)'))
  var currentItem = searchbar.querySelector('.searchbar-item:focus, .searchbar-item.fakefocus')

  var index = allItems.indexOf(currentItem)
  var logicalNextItem = allItems[(previous) ? index - 1 : index + 1]

  // clear previously focused items
  var fakefocus = searchbar.querySelector('.fakefocus')
  if (fakefocus) {
    fakefocus.classList.remove('fakefocus')
  }

  if (currentItem && logicalNextItem) { // an item is focused and there is another item after it, move onto the next one
    logicalNextItem.focus()
  } else if (currentItem) { // the last item is focused, focus the searchbar again
    getTabInput(tabs.getSelected()).focus()
    return
  } else { // no item is focused.
    allItems[0].focus()
  }

  var focusedItem = logicalNextItem || allItems[0]

  if (focusedItem.classList.contains('iadata-onfocus')) {
    setTimeout(function () {
      if (document.activeElement === focusedItem) {
        var itext = focusedItem.querySelector('.title').textContent

        showSearchbarInstantAnswers(itext, currentSearchbarInput, null, getSearchbarContainer('instantAnswers'))
      }
    }, 300)
  }
}

// return key on result items should trigger click
// tab key or arrowdown key should focus next item
// arrowup key should focus previous item

searchbar.addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    e.target.click()
  } else if (e.keyCode === 9 || e.keyCode === 40) { // tab or arrowdown key
    e.preventDefault()
    focussearchbarItem()
  } else if (e.keyCode === 38) {
    e.preventDefault()
    focussearchbarItem({
      focusPrevious: true
    })
  }
})

// when we get keywords data from the page, we show those results in the searchbar

bindWebviewIPC('keywordsData', function (webview, tabId, arguements) {
  var data = arguements[0]

  var itemsCt = 0

  var itemsShown = []

  var container = getSearchbarContainer('searchSuggestions')

  data.entities.forEach(function (item, index) {
    // ignore one-word items, they're usually useless
    if (!/\s/g.test(item.trim())) {
      return
    }

    if (itemsCt >= 5 || itemsShown.indexOf(item.trim()) !== -1) {
      return
    }

    var div = createSearchbarItem({
      icon: 'fa-search',
      title: item,
      classList: ['iadata-onfocus']
    })

    div.addEventListener('click', function (e) {
      if (e.metaKey) {
        openURLInBackground(item)
      } else {
        navigate(tabs.getSelected(), item)
      }
    })

    container.appendChild(div)

    itemsCt++
    itemsShown.push(item.trim())
  })
})
;var searchbarPlugins = [] // format is {name, container, trigger, showResults}
var searchbarResultCount = 0
var hasAutocompleted = false
var topAnswerArea = searchbar.querySelector('.top-answer-area')

// empties all containers in the searchbar
function clearSearchbar () {
  empty(topAnswerArea)
  for (var i = 0; i < searchbarPlugins.length; i++) {
    empty(searchbarPlugins[i].container)
  }
}

function setTopAnswer (pluginName, item) {
  empty(topAnswerArea)
  if (item) {
    item.setAttribute('data-plugin', pluginName)
    topAnswerArea.appendChild(item)
  }
}

function getSearchbarContainer (pluginName) {
  for (var i = 0; i < searchbarPlugins.length; i++) {
    if (searchbarPlugins[i].name === pluginName) {
      return searchbarPlugins[i].container
    }
  }
  return null
}

function getTopAnswer (pluginName) {
  if (pluginName) {
    // TODO a template string would be useful here, but UglifyJS doesn't support them yet
    return topAnswerArea.querySelector('[data-plugin={plugin}]'.replace('{plugin}', pluginName))
  } else {
    return topAnswerArea.firstChild
  }
}

function registerSearchbarPlugin (name, object) {
  // add the container
  var container = document.createElement('div')
  container.classList.add('searchbar-plugin-container')
  container.setAttribute('data-plugin', name)
  searchbar.insertBefore(container, searchbar.childNodes[object.index + 1])

  searchbarPlugins.push({
    name: name,
    container: container,
    trigger: object.trigger,
    showResults: object.showResults
  })
}

function runPlugins (text, input, event) {
  searchbarResultCount = 0
  hasAutocompleted = false

  for (var i = 0; i < searchbarPlugins.length; i++) {
    if ((!searchbarPlugins[i].trigger || searchbarPlugins[i].trigger(text))) {
      searchbarPlugins[i].showResults(text, input, event, searchbarPlugins[i].container)
    } else {
      empty(searchbarPlugins[i].container)

      // if the plugin is not triggered, remove a previously created top answer
      var associatedTopAnswer = getTopAnswer(searchbarPlugins[i].name)

      if (associatedTopAnswer) {
        associatedTopAnswer.remove()
      }
    }
  }
}
;function autocomplete (input, text, strings) {
  for (var i = 0; i < strings.length; i++) {
    // check if the item can be autocompleted
    if (strings[i].toLowerCase().indexOf(text.toLowerCase()) === 0) {
      input.value = strings[i]
      input.setSelectionRange(text.length, strings[i].length)

      return {
        valid: true,
        matchIndex: i
      }
    }
  }
  return {
    valid: false
  }
}

// autocompletes based on a result item
// returns: 1 - the exact URL was autocompleted, 0 - the domain was autocompleted, -1: nothing was autocompleted
function autocompleteURL (item, input) {
  var text = getValue(input)

  var url = new URL(item.url)
  var hostname = url.hostname

  // the different variations of the URL we can autocomplete
  var possibleAutocompletions = [
    // we start with the domain
    hostname,
    // if that doesn't match, try the hostname without the www instead. The regex requires a slash at the end, so we add one, run the regex, and then remove it
    (hostname + '/').replace(urlParser.startingWWWRegex, '$1').replace('/', ''),
    // then try the whole URL
    urlParser.prettyURL(item.url),
    // then try the URL with querystring
    urlParser.removeProtocol(item.url),
    // then just try the URL with protocol
    item.url
  ]

  var autocompleteResult = autocomplete(input, text, possibleAutocompletions)

  if (!autocompleteResult.valid) {
    return -1
  } else if (autocompleteResult.matchIndex < 2 && url.pathname !== '/') {
    return 0
  } else {
    return 1
  }
}
;var currentResponseSent = 0

function showSearchbarPlaceResults (text, input, event, container, options) {
  var responseSent = Date.now()

  // this function is used for both regular and full-text searching, which are two separate plugins
  var pluginName = container.getAttribute('data-plugin')

  if (options && options.fullText) {
    var searchFn = bookmarks.searchPlacesFullText
  } else {
    var searchFn = bookmarks.searchPlaces
  }

  searchFn(text, function (results) {

    // prevent responses from returning out of order
    if (responseSent < currentResponseSent) {
      return
    }

    currentResponseSent = responseSent

    // remove a previous top answer

    var placesTopAnswer = getTopAnswer(pluginName)

    if (placesTopAnswer && !hasAutocompleted) {
      placesTopAnswer.remove()
    }

    // clear previous results
    empty(container)

    results.slice(0, 4).forEach(function (result) {
      // only autocomplete an item if the delete key wasn't pressed, and nothing has been autocompleted already
      if (event.keyCode !== 8 && !hasAutocompleted) {
        var autocompletionType = autocompleteURL(result, input)

        if (autocompletionType !== -1) {
          hasAutocompleted = true
        }

        if (autocompletionType === 0) { // the domain was autocompleted, show a domain result item
          var domain = new URL(result.url).hostname

          setTopAnswer(pluginName, createSearchbarItem({
            title: domain,
            url: domain,
            classList: ['fakefocus']
          }))
        }
      }

      var data = {
        title: urlParser.prettyURL(result.url),
        secondaryText: getRealTitle(result.title),
        url: result.url,
        delete: function () {
          bookmarks.deleteHistory(result.url)
        }
      }

      // show a star for bookmarked items
      if (result.isBookmarked) {
        data.icon = 'fa-star'
      }

      // create the item

      var item = createSearchbarItem(data)

      // show the metadata for the item

      if (result.metadata) {
        var secondaryText = item.querySelector('.secondary-text')

        for (var md in result.metadata) {
          var span = document.createElement('span')

          span.className = 'md-info'
          span.textContent = result.metadata[md]

          secondaryText.insertBefore(span, secondaryText.firstChild)
        }
      }

      if (autocompletionType === 1) { // if this exact URL was autocompleted, show the item as the top answer
        item.classList.add('fakefocus')
        setTopAnswer(pluginName, item)
      } else {
        container.appendChild(item)
      }
    })

    searchbarResultCount += Math.min(results.length, 4) // add the number of results that were displayed
  })
}

registerSearchbarPlugin('places', {
  index: 1,
  trigger: function (text) {
    return !!text && text.indexOf('!') !== 0
  },
  showResults: throttle(showSearchbarPlaceResults, 50)
})

registerSearchbarPlugin('fullTextPlaces', {
  index: 2, 
  trigger: function (text) {
    return !!text && text.indexOf('!') !== 0
  },
  showResults: debounce(function () {
    if (searchbarResultCount < 4 && currentSearchbarInput) {
      showSearchbarPlaceResults.apply(this, Array.from(arguments).concat({fullText: true}))
    }
  }, 200)
})
;function showSearchbarInstantAnswers (text, input, event, container) {
  // only make requests to the DDG api if DDG is set as the search engine
  if (currentSearchEngine.name !== 'DuckDuckGo') {
    return
  }

  // don't make a request if the searchbar has already closed

  if (!currentSearchbarInput) {
    return
  }

  fetch('https://api.duckduckgo.com/?t=min&skip_disambig=1&no_redirect=1&format=json&q=' + encodeURIComponent(text)).then(function (data) {
    return data.json()
  }).then(function (res) {
    empty(container)

    // if there is a custom format for the answer, use that
    if (instantAnswers[res.AnswerType]) {
      var item = instantAnswers[res.AnswerType](text, res.Answer)

    // use the default format
    } else if (res.Abstract || res.Answer) {
      var data = {
        title: removeTags(res.Answer || res.Heading),
        descriptionBlock: res.Abstract || 'Answer',
        attribution: ddgAttribution,
        url: res.AbstractURL || text
      }

      if (res.Image && !res.ImageIsLogo) {
        data.image = res.Image
      }

      var item = createSearchbarItem(data)

    // show a disambiguation
    } else if (res.RelatedTopics) {
      res.RelatedTopics.slice(0, 3).forEach(function (item) {
        // the DDG api returns the entity name inside an <a> tag
        var entityName = item.Result.replace(/.*>(.+?)<.*/g, '$1')

        // the text starts with the entity name, remove it
        var desc = item.Text.replace(entityName, '')

        var item = createSearchbarItem({
          title: entityName,
          descriptionBlock: desc,
          url: item.FirstURL
        })

        container.appendChild(item)
      })

      searchbarResultCount += Math.min(res.RelatedTopics.length, 3)
    }

    if (item) {
      // answers are more relevant, they should be displayed at the top
      if (res.Answer) {
        setTopAnswer('instantAnswers', item)
      } else {
        container.appendChild(item)
      }
    }

    // suggested site links
    if (searchbarResultCount < 4 && res.Results && res.Results[0] && res.Results[0].FirstURL) {
      var url = res.Results[0].FirstURL

      var data = {
        icon: 'fa-globe',
        title: urlParser.removeProtocol(url).replace(trailingSlashRegex, ''),
        secondaryText: 'Suggested site',
        url: url,
        classList: ['ddg-answer']
      }

      var item = createSearchbarItem(data)

      container.appendChild(item)
    }

    // if we're showing a location, show a "Search on OpenStreetMap" link

    var entitiesWithLocations = ['location', 'country', 'u.s. state', 'protected area']

    if (entitiesWithLocations.indexOf(res.Entity) !== -1) {
      var item = createSearchbarItem({
        icon: 'fa-search',
        title: res.Heading,
        secondaryText: 'Search on OpenStreetMap',
        classList: ['ddg-answer'],
        url: 'https://www.openstreetmap.org/search?query=' + encodeURIComponent(res.Heading)
      })

      container.insertBefore(item, container.firstChild)
    }
  }).catch(function (e) {
    console.error(e)
  })
}

registerSearchbarPlugin('instantAnswers', {
  index: 3,
  trigger: function (text) {
    return text.length > 3 && !urlParser.isURLMissingProtocol(text) && !tabs.get(tabs.getSelected()).private
  },
  showResults: debounce(showSearchbarInstantAnswers, 400)
})

// custom instant answers

var instantAnswers = {
  color_code: function (searchText, answer) {
    var alternateFormats = [answer.data.rgb, answer.data.hslc, answer.data.cmyb]

    if (!searchText.startsWith('#')) { // if the search is not a hex code, show the hex code as an alternate format
      alternateFormats.unshift(answer.data.hexc)
    }

    var item = createSearchbarItem({
      title: searchText,
      descriptionBlock: alternateFormats.join(' · '),
      attribution: ddgAttribution
    })

    var colorCircle = document.createElement('div')
    colorCircle.className = 'image color-circle'
    colorCircle.style.backgroundColor = '#' + answer.data.hex_code

    item.insertBefore(colorCircle, item.firstChild)

    return item
  },
  minecraft: function (searchText, answer) {
    var item = createSearchbarItem({
      title: answer.data.title,
      image: answer.data.image,
      descriptionBlock: answer.data.description + ' ' + answer.data.subtitle,
      attribution: ddgAttribution
    })

    return item
  },
  figlet: function (searchText, answer) {
    var formattedAnswer = removeTags(answer).replace('Font: standard', '')

    var item = createSearchbarItem({
      descriptionBlock: formattedAnswer,
      attribution: ddgAttribution
    })

    var block = item.querySelector('.description-block')

    // display the data correctly
    block.style.whiteSpace = 'pre-wrap'
    block.style.fontFamily = 'monospace'
    block.style.maxHeight = '10em'
    block.style.webkitUserSelect = 'auto'

    return item
  },
  currency_in: function (searchText, answer) {
    var title = ''
    if (typeof answer === 'string') { // there is only one currency
      title = answer
    } else { // multiple currencies
      var currencyArr = []
      for (var countryCode in answer.data.record_data) {
        currencyArr.push(answer.data.record_data[countryCode] + ' (' + countryCode + ')')
      }

      title = currencyArr.join(', ')
    }

    if (answer.data) {
      var descriptionBlock = answer.data.title
    } else {
      var descriptionBlock = 'Answer'
    }

    var item = createSearchbarItem({
      title: title,
      descriptionBlock: descriptionBlock,
      attribution: ddgAttribution
    })

    return item
  }
}

var searchOpenTabs = function (text, input, event, container) {
  empty(container)

  var matches = []
  var selTab = tabs.getSelected()

  tabs.get().forEach(function (item) {
    if (item.id === selTab || !item.title || item.url === 'about:blank') {
      return
    }

    var itemUrl = urlParser.removeProtocol(item.url) // don't search protocols

    var exactMatch = item.title.indexOf(text) !== -1 || itemUrl.indexOf(text) !== -1
    var fuzzyMatch = item.title.substring(0, 50).score(text, 0.5) > 0.4 || itemUrl.score(text, 0.5) > 0.4

    if (exactMatch || fuzzyMatch) {
      matches.push(item)
    }
  })

  if (matches.length === 0) {
    return
  }

  var finalMatches = matches.splice(0, 2).sort(function (a, b) {
    return b.title.score(text, 0.5) - a.title.score(text, 0.5)
  })

  finalMatches.forEach(function (tab) {
    var data = {
      icon: 'fa-external-link-square',
      title: tab.title,
      secondaryText: urlParser.removeProtocol(tab.url).replace(trailingSlashRegex, '')
    }

    var item = createSearchbarItem(data)

    item.addEventListener('click', function () {
      // if we created a new tab but are switching away from it, destroy the current (empty) tab
      var currentTabUrl = tabs.get(tabs.getSelected()).url
      if (!currentTabUrl || currentTabUrl === 'about:blank') {
        destroyTab(tabs.getSelected(), {
          switchToTab: false
        })
      }
      switchToTab(tab.id)
    })

    container.appendChild(item)
  })

  searchbarResultCount += finalMatches.length
}

registerSearchbarPlugin('openTabs', {
  index: 4,
  trigger: function (text) {
    return text.length > 2
  },
  showResults: searchOpenTabs
})
;// format is {phrase, snippet, score, icon, fn, isCustom, isAction} to match https://ac.duckduckgo.com/ac?q=!

// isAction describes whether the !bang is an action (like "open preferences"), or a place to search (like "search reading list items")

var customBangs = []

function registerCustomBang (data) {
  customBangs.push({
    phrase: data.phrase,
    snippet: data.snippet,
    score: data.score || 500000, // half of the default score
    icon: data.icon || 'fa-terminal',
    fn: data.fn,
    isCustom: true,
    isAction: data.isAction || false
  })
}

function searchCustomBangs (text) {
  return customBangs.filter(function (item) {
    return item.phrase.indexOf(text) === 0
  })
}

// format is {bang: count}
var bangUseCounts = JSON.parse(localStorage.getItem('bangUseCounts') || '{}')

function incrementBangCount (bang) {
  // increment bangUseCounts

  if (bangUseCounts[bang]) {
    bangUseCounts[bang]++
  } else {
    bangUseCounts[bang] = 1
  }

  // prevent the data from getting too big

  if (bangUseCounts[bang] > 1000) {
    for (var bang in bangUseCounts) {
      bangUseCounts[bang] = Math.floor(bangUseCounts[bang] * 0.9)

      if (bangUseCounts[bang] < 2) {
        delete bangUseCounts[bang]
      }
    }
  }
}

var saveBangUseCounts = debounce(function () {
  localStorage.setItem('bangUseCounts', JSON.stringify(bangUseCounts))
}, 10000)

// results is an array of {phrase, snippet, image}
function showBangSearchResults (results, input, event, container) {
  empty(container)

  results.sort(function (a, b) {
    var aScore = a.score || 1
    var bScore = b.score || 1
    if (bangUseCounts[a.phrase]) {
      aScore *= bangUseCounts[a.phrase]
    }
    if (bangUseCounts[b.phrase]) {
      bScore *= bangUseCounts[b.phrase]
    }

    return bScore - aScore
  })

  results.slice(0, 5).forEach(function (result) {

    // autocomplete the bang, but allow the user to keep typing

    var data = {
      icon: result.icon,
      iconImage: result.image,
      title: result.snippet,
      secondaryText: result.phrase
    }

    var item = createSearchbarItem(data)

    item.addEventListener('click', function (e) {

      // if the item is an action, clicking on it should immediately trigger it instead of prompting for additional text
      if (result.isAction && result.fn) {
        openURLFromsearchbar(e, result.phrase)
        return
      }

      setTimeout(function () {
        incrementBangCount(result.phrase)
        saveBangUseCounts()

        input.value = result.phrase + ' '
        input.focus()
      }, 66)
    })

    container.appendChild(item)
  })
}

function getBangSearchResults (text, input, event, container) {

  // get results from DuckDuckGo if it is a search engine, and the current tab is not a private tab
  if (currentSearchEngine.name === 'DuckDuckGo' && !tabs.get(tabs.getSelected()).private) {
    fetch('https://ac.duckduckgo.com/ac/?t=min&q=' + encodeURIComponent(text), {
      cache: 'force-cache'
    })
      .then(function (response) {
        return response.json()
      })
      .then(function (results) {
        // show the DuckDuckGo results, combined with the custom !bangs
        showBangSearchResults(results.concat(searchCustomBangs(text)), input, event, container)
      })
  } else {
    // otherwise, only show custom !bangs
    showBangSearchResults(searchCustomBangs(text), input, event, container)
  }
}

registerSearchbarPlugin('bangs', {
  index: 1,
  trigger: function (text) {
    return !!text && text.indexOf('!') === 0 && text.indexOf(' ') === -1
  },
  showResults: debounce(getBangSearchResults, 100)
})
;/* list of the available custom !bangs */

registerCustomBang({
  phrase: '!settings',
  snippet: 'View Settings',
  isAction: true,
  fn: function (text) {
    navigate(tabs.getSelected(), 'file://' + __dirname + '/pages/settings/index.html')
  }
})

registerCustomBang({
  phrase: '!back',
  snippet: 'Go Back',
  isAction: true,
  fn: function (text) {
    try {
      getWebview(tabs.getSelected()).goBack()
    } catch(e) {}
  }
})

registerCustomBang({
  phrase: '!forward',
  snippet: 'Go Forward',
  isAction: true,
  fn: function (text) {
    try {
      getWebview(tabs.getSelected()).goForward()
    } catch(e) {}
  }
})

registerCustomBang({
  phrase: '!screenshot',
  snippet: 'Take a Screenshot',
  isAction: true,
  fn: function (text) {
    setTimeout(function () { // wait until the next frame so that the searchbar is hidden
      var rect = getWebview(tabs.getSelected()).getBoundingClientRect()

      var imageRect = {
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      }

      remote.getCurrentWindow().capturePage(imageRect, function (image) {
        remote.getCurrentWebContents().downloadURL(image.toDataURL())
      })
    }, 16)
  }
})

registerCustomBang({
  phrase: '!clearhistory',
  snippet: 'Clear All History',
  isAction: true,
  fn: function (text) {
    db.places.filter(function (item) {
      return item.isBookmarked === false
    }).delete()

    // restart the workers
    bookmarks.init()
  }
})

// returns a task with the same name or index ("1" returns the first task, etc.)
function getTaskByNameOrNumber (text) {
  var taskSet = tasks.get()

  var textAsNumber = parseInt(text)

  for (var i = 0; i < taskSet.length; i++) {
    if ((taskSet[i].name && taskSet[i].name.toLowerCase() === text) || i + 1 === textAsNumber) {
      return taskSet[i]
    }
  }
  return null
}

registerCustomBang({
  phrase: '!task',
  snippet: 'Switch to Task',
  isAction: false,
  fn: function (text) {

    /* disabled in focus mode */
    if (isFocusMode) {
      showFocusModeError()
      return
    }

    text = text.toLowerCase()

    // no task was specified, show all of the tasks
    if (!text) {
      taskOverlay.show()
      return
    }

    var task = getTaskByNameOrNumber(text)

    if (task) {
      switchToTask(task.id)
    }
  }
})

registerCustomBang({
  phrase: '!newtask',
  snippet: 'Create a task',
  isAction: true,
  fn: function (text) {

    /* disabled in focus mode */
    if (isFocusMode) {
      showFocusModeError()
      return
    }

    taskOverlay.show()

    setTimeout(function () {
      addTaskFromOverlay()
      if (text) {
        currentTask.name = text
      }
    }, 600)
  }
})

registerCustomBang({
  phrase: '!movetotask',
  snippet: 'Move this tab to a task',
  isAction: false,
  fn: function (text) {

    /* disabled in focus mode */
    if (isFocusMode) {
      showFocusModeError()
      return
    }

    // remove the tab from the current task

    var currentTab = tabs.get(tabs.getSelected())
    tabs.destroy(currentTab.id)

    // make sure the task has at least one tab in it
    if (tabs.get().length === 0) {
      tabs.add()
    }

    var newTask = getTaskByNameOrNumber(text)

    if (newTask) {
      newTask.tabs.add(currentTab)
    } else {
      // create a new task with the given name
      var newTask = tasks.get(tasks.add())
      newTask.name = text

      newTask.tabs.add(currentTab)
    }

    taskOverlay.show()
    switchToTask(newTask.id)
    switchToTab(currentTab.id)

    setTimeout(function () {
      taskOverlay.hide()
    }, 600)
  }
})
;var ddgAttribution = 'Results from DuckDuckGo'

function showSearchSuggestions (text, input, event, container) {
  // TODO support search suggestions for other search engines
  if (currentSearchEngine.name !== 'DuckDuckGo') {
    return
  }

  if (searchbarResultCount > 3) {
    empty(container)
    return
  }

  fetch('https://ac.duckduckgo.com/ac/?t=min&q=' + encodeURIComponent(text), {
    cache: 'force-cache'
  })
    .then(function (response) {
      return response.json()
    })
    .then(function (results) {
      empty(container)

      if (results) {
        results.slice(0, 3).forEach(function (result) {
          var data = {
            title: result.phrase
          }

          if (urlParser.isURL(result.phrase) || urlParser.isURLMissingProtocol(result.phrase)) { // website suggestions
            data.icon = 'fa-globe'
          } else { // regular search results
            data.icon = 'fa-search'
          }

          var item = createSearchbarItem(data)

          item.addEventListener('click', function (e) {
            openURLFromsearchbar(e, result.phrase)
          })

          container.appendChild(item)
        })
      }
      searchbarResultCount += results.length
    })
}

registerSearchbarPlugin('searchSuggestions', {
  index: 4,
  trigger: function (text) {
    return !!text && !(text.indexOf('!') === 0 && text.indexOf(' ') === -1) && !tabs.get(tabs.getSelected()).private
  },
  showResults: debounce(showSearchSuggestions, 200)
})
;function showPlaceSuggestions (text, input, event, container) {
  // use the current tab's url for history suggestions, or the previous tab if the current tab is empty
  var url = tabs.get(tabs.getSelected()).url

  if (!url || url === 'about:blank') {
    var previousTab = tabs.getAtIndex(tabs.getIndex(tabs.getSelected()) - 1)
    if (previousTab) {
      url = previousTab.url
    }
  }

  bookmarks.getPlaceSuggestions(url, function (results) {
    empty(container)

    var tabList = tabs.get().map(function (tab) {
      return tab.url
    })

    results = results.filter(function (item) {
      return tabList.indexOf(item.url) === -1
    })

    results.slice(0, 4).forEach(function (result) {
      var item = createSearchbarItem({
        title: urlParser.prettyURL(result.url),
        secondaryText: getRealTitle(result.title),
        url: result.url,
        delete: function () {
          bookmarks.deleteHistory(result.url)
        }
      })

      container.appendChild(item)
    })
  })
}

registerSearchbarPlugin('placeSuggestions', {
  index: 1,
  trigger: function (text) {
    return !text
  },
  showResults: showPlaceSuggestions
})
;// hosts are parsed in util/urlParser

function showHostsSuggestions (text, input, event, container) {
  empty(container)

  var results = hosts.filter(function (host) {
    // only match start of host string
    return host.indexOf(text) === 0
  })

  results.slice(0, 4).forEach(function (result) {
    var item = createSearchbarItem({
      title: result,
      secondaryText: 'Hosts file entry',
      url: 'http://' + result
    })

    container.appendChild(item)
  })
}

registerSearchbarPlugin('hostsSuggestions', {
  index: 1,
  trigger: function (text) {
    return (hosts.length && typeof text === 'string' && text.length > 2)
  },
  showResults: showHostsSuggestions
})
;var readerView = {
  readerURL: 'file://' + __dirname + '/reader/index.html',
  getReaderURL: function (url) {
    return readerView.readerURL + '?url=' + url
  },
  getButton: function (tabId) {
    // TODO better icon
    var item = document.createElement('i')
    item.className = 'fa fa-align-left reader-button'

    item.setAttribute('data-tab', tabId)
    item.setAttribute('title', 'Enter reader view')

    item.addEventListener('click', function (e) {
      var tabId = this.getAttribute('data-tab')
      var tab = tabs.get(tabId)

      e.stopPropagation()

      if (tab.isReaderView) {
        readerView.exit(tabId)
      } else {
        readerView.enter(tabId)
      }
    })

    return item
  },
  updateButton: function (tabId) {
    var button = document.querySelector('.reader-button[data-tab="{id}"]'.replace('{id}', tabId))
    var tab = tabs.get(tabId)

    if (tab.isReaderView) {
      button.classList.add('is-reader')
      button.setAttribute('title', 'Exit reader view')
      return
    } else {
      button.classList.remove('is-reader')
      button.setAttribute('title', 'Enter reader view')
    }

    if (tab.readerable) {
      button.classList.add('can-reader')
    } else {
      button.classList.remove('can-reader')
    }
  },
  enter: function (tabId) {
    navigate(tabId, readerView.readerURL + '?url=' + tabs.get(tabId).url)
    tabs.update(tabId, {
      isReaderView: true
    })
  },
  exit: function (tabId) {
    navigate(tabId, tabs.get(tabId).url.split('?url=')[1])
    tabs.update(tabId, {
      isReaderView: false
    })
  },
  showReadingList: function (options) {
    showSearchbar(getTabInput(tabs.getSelected()))

    var articlesShown = 0
    var moreArticlesAvailable = false

    var container = getSearchbarContainer('readingList')

    db.readingList.orderBy('time').reverse().each(function (article) {
      if (!article.article) {
        return
      }
      if (options && options.limitResults && articlesShown > 3) {
        moreArticlesAvailable = true
        return
      }

      if (articlesShown === 0) {
        clearSearchbar()
      }

      var item = createSearchbarItem({
        title: article.article.title,
        descriptionBlock: article.article.excerpt,
        url: article.url,
        delete: function (el) {
          db.readingList.where('url').equals(el.getAttribute('data-url')).delete()
        }
      })

      item.addEventListener('click', function (e) {
        openURLFromsearchbar(e, readerView.getReaderURL(article.url))
      })

      if (article.visitCount > 5 || (article.extraData.scrollPosition > 0 && article.extraData.articleScrollLength - article.extraData.scrollPosition < 1000)) { // the article has been visited frequently, or the scroll position is at the bottom
        item.style.opacity = 0.65
      }

      container.appendChild(item)

      articlesShown++
    }).then(function () {
      if (articlesShown === 0) {
        var item = createSearchbarItem({
          title: 'Your reading list is empty.',
          descriptionBlock: 'Articles you open in reader view are listed here, and are saved offline for 30 days.'
        })

        container.appendChild(item)
        return
      }

      if (moreArticlesAvailable) {
        var seeMoreLink = createSearchbarItem({
          title: 'More articles'
        })

        seeMoreLink.style.opacity = 0.5

        seeMoreLink.addEventListener('click', function (e) {
          clearSearchbar()
          readerView.showReadingList({
            limitResults: false
          })
        })

        container.appendChild(seeMoreLink)
      }
    })
  }
}

// create a searchbar container to show reading list articles

registerSearchbarPlugin('readingList', {
  index: 9,
  // the plugin is only used when triggered from the menubar
  trigger: function () {
    return false
  },
  showResults: null
})

// update the reader button on page load

bindWebviewEvent('did-finish-load', function (e) {
  var tab = this.getAttribute('data-tab')
  var url = this.getAttribute('src')

  if (url.indexOf(readerView.readerURL) === 0) {
    tabs.update(tab, {
      isReaderView: true,
      readerable: false // assume the new page can't be readered, we'll get another message if it can
    })
  } else {
    tabs.update(tab, {
      isReaderView: false,
      readerable: false
    })
  }

  readerView.updateButton(tab)
})

bindWebviewIPC('canReader', function (webview, tab) {
  tabs.update(tab, {
    readerable: true
  })
  readerView.updateButton(tab)
})
;/* fades out tabs that are inactive */

var tabActivity = {
  minFadeAge: 330000,
  refresh: function () {
    requestAnimationFrame(function () {
      var tabSet = tabs.get()
      var selected = tabs.getSelected()
      var time = Date.now()

      tabSet.forEach(function (tab) {
        if (selected === tab.id) { // never fade the current tab
          getTabElement(tab.id).classList.remove('fade')
          return
        }
        if (time - tab.lastActivity > tabActivity.minFadeAge) { // the tab has been inactive for greater than minActivity, and it is not currently selected
          getTabElement(tab.id).classList.add('fade')
        } else {
          getTabElement(tab.id).classList.remove('fade')
        }
      })
    })
  },
  init: function () {
    setInterval(tabActivity.refresh, 7500)
  }
}
tabActivity.init()
;var colorExtractorCanvas = document.createElement('canvas')
var colorExtractorContext = colorExtractorCanvas.getContext('2d')

function getColor (url, callback) {
  colorExtractorImage.onload = function (e) {
    var w = colorExtractorImage.width
    var h = colorExtractorImage.height
    colorExtractorCanvas.width = w
    colorExtractorCanvas.height = h

    var offset = Math.max(1, Math.round(0.00032 * w * h))

    colorExtractorContext.drawImage(colorExtractorImage, 0, 0, w, h)

    var data = colorExtractorContext.getImageData(0, 0, w, h).data

    var pixels = {}

    var d, add, sum

    for (var i = 0; i < data.length; i += 4 * offset) {
      d = Math.round(data[i] / 5) * 5 + ',' + Math.round(data[i + 1] / 5) * 5 + ',' + Math.round(data[i + 2] / 5) * 5

      add = 1
      sum = data[i] + data[i + 1] + data[i + 2]

      // very dark or light pixels shouldn't be counted as heavily
      if (sum < 310) {
        add = 0.35
      }

      if (sum < 50) {
        add = 0.01
      }

      if (data[i] > 210 || data[i + 1] > 210 || data[i + 2] > 210) {
        add = 0.5 - (0.0001 * sum)
      }

      if (pixels[d]) {
        pixels[d] = pixels[d] + add
      } else {
        pixels[d] = add
      }
    }

    // find the largest pixel set
    var largestPixelSet = null
    var ct = 0

    for (var k in pixels) {
      if (k === '255,255,255' || k === '0,0,0') {
        pixels[k] *= 0.05
      }
      if (pixels[k] > ct) {
        largestPixelSet = k
        ct = pixels[k]
      }
    }

    var res = largestPixelSet.split(',')

    for (var i = 0; i < res.length; i++) {
      res[i] = parseInt(res[i])
    }

    callback(res)
  }

  colorExtractorImage.src = url
}

var colorExtractorImage = document.createElement('img')

const defaultColors = {
  private: ['rgb(58, 44, 99)', 'white'],
  regular: ['rgb(255, 255, 255)', 'black']
}

var hours = new Date().getHours() + (new Date().getMinutes() / 60)

// we cache the hours so we don't have to query every time we change the color

setInterval(function () {
  var d = new Date()
  hours = d.getHours() + (d.getMinutes() / 60)
}, 4 * 60 * 1000)

function updateTabColor (favicons, tabId) {
  // special color scheme for private tabs
  if (tabs.get(tabId).private === true) {
    tabs.update(tabId, {
      backgroundColor: '#3a2c63',
      foregroundColor: 'white'
    })

    if (tabId === tabs.getSelected()) {
      setColor('#3a2c63', 'white')
    }
    return
  }
  requestIdleCallback(function () {
    getColor(favicons[0], function (c) {
      // dim the colors late at night or early in the morning, or when dark mode is enabled
      var colorChange = 1
      if (hours > 20) {
        colorChange -= 0.015 * Math.pow(2.75, hours - 20)
      } else if (hours < 6.5) {
        colorChange -= -0.15 * Math.pow(1.36, hours) + 1.15
      }

      if (window.isDarkMode) {
        colorChange = Math.min(colorChange, 0.66)
      }

      c[0] = Math.round(c[0] * colorChange)
      c[1] = Math.round(c[1] * colorChange)
      c[2] = Math.round(c[2] * colorChange)

      var cr = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'

      var obj = {
        r: c[0] / 255,
        g: c[1] / 255,
        b: c[2] / 255
      }

      var textclr = getTextColor(obj)

      tabs.update(tabId, {
        backgroundColor: cr,
        foregroundColor: textclr
      })

      if (tabId === tabs.getSelected()) {
        setColor(cr, textclr)
      }
      return
    })
  }, {
    timeout: 1000
  })
}

// generated using http://harthur.github.io/brain/
var getTextColor = function (bgColor) {
  var output = runNetwork(bgColor)
  if (output.black > 0.5) {
    return 'black'
  }
  return 'white'
}

var runNetwork = function anonymous (input) {
  var net = {
    'layers': [{
      'r': {},
      'g': {},
      'b': {}
    }, {
      '0': {
        'bias': 14.176907520571566,
        'weights': {
          'r': -3.2764240497480652,
          'g': -16.90247884718719,
          'b': -2.9976364179397814
        }
      },
      '1': {
        'bias': 9.086071102351246,
        'weights': {
          'r': -4.327474143397604,
          'g': -15.780660155750773,
          'b': 2.879230202567851
        }
      },
      '2': {
        'bias': 22.274487339773476,
        'weights': {
          'r': -3.5830205067960965,
          'g': -25.498384261673618,
          'b': -6.998329189107962
        }
      }
    }, {
      'black': {
        'bias': 17.873962570788997,
        'weights': {
          '0': -15.542217788633987,
          '1': -13.377152708685674,
          '2': -24.52215186113144
        }
      }
    }],
    'outputLookup': true,
    'inputLookup': true
  }

  for (var i = 1; i < net.layers.length; i++) {
    var layer = net.layers[i]
    var output = {}

    for (var id in layer) {
      var node = layer[id]
      var sum = node.bias

      for (var iid in node.weights) {
        sum += node.weights[iid] * input[iid]
      }
      output[id] = (1 / (1 + Math.exp(-sum)))
    }
    input = output
  }
  return output
}

function setColor (bg, fg) {
  var background = document.getElementsByClassName('theme-background-color')
  var textcolor = document.getElementsByClassName('theme-text-color')

  for (var i = 0; i < background.length; i++) {
    background[i].style.backgroundColor = bg
  }

  for (var i = 0; i < textcolor.length; i++) {
    textcolor[i].style.color = fg
  }

  if (fg === 'white') {
    document.body.classList.add('dark-theme')
  } else {
    document.body.classList.remove('dark-theme')
  }
}

/* converts a color string into an object that can be used with getTextColor */

function getRGBObject (cssColor) {
  var c = cssColor.split('(')[1].split(')')[0]
  var c2 = c.split(',')

  var obj = {
    r: parseInt(c2[0]) / 255,
    g: parseInt(c2[1]) / 255,
    b: parseInt(c2[2]) / 255
  }

  return obj
}
;var tabContainer = document.getElementsByClassName('tab-group')[0]
var tabGroup = tabContainer.querySelector('#tabs') // TODO these names are confusing

/* tab events */

var lastTabDeletion = 0

/* draws tabs and manages tab events */

function getTabInput (tabId) {
  return document.querySelector('.tab-item[data-tab="{id}"] .tab-input'.replace('{id}', tabId))
}

function getTabElement (id) { // gets the DOM element for a tab
  return document.querySelector('.tab-item[data-tab="{id}"]'.replace('{id}', id))
}

function setActiveTabElement (tabId) {
  var activeTab = document.querySelector('.tab-item.active')

  if (activeTab) {
    activeTab.classList.remove('active')
  }

  var el = getTabElement(tabId)
  el.classList.add('active')

  requestIdleCallback(function () {
    requestAnimationFrame(function () {
      el.scrollIntoView({
        behavior: 'smooth'
      })
    })
  }, {
    timeout: 1500
  })
}

function leaveTabEditMode (options) {
  var selTab = document.querySelector('.tab-item.selected')
  if (selTab) {
    selTab.classList.remove('selected')
  }
  if (options && options.blur) {
    var input = document.querySelector('.tab-item .tab-input:focus')
    if (input) {
      input.blur()
    }
  }

  document.body.classList.remove('is-edit-mode')
  hidesearchbar()
}

function enterEditMode (tabId) {
  taskOverlay.hide()

  var tabEl = getTabElement(tabId)
  var webview = getWebview(tabId)

  var currentURL = tabs.get(tabId).url

  if (currentURL === 'about:blank') {
    currentURL = ''
  }

  var input = getTabInput(tabId)

  document.body.classList.add('is-edit-mode')
  tabEl.classList.add('selected')

  input.value = currentURL
  input.focus()
  input.select()

  showSearchbar(input)
  showSearchbarResults('', input, null)

  // show keyword suggestions in the searchbar

  if (webview.send) { // before first webview navigation, this will be undefined
    webview.send('getKeywordsData')
  }
}

// redraws all of the tabs in the tabstrip
function rerenderTabstrip () {
  empty(tabGroup)
  for (var i = 0; i < tabs.length; i++) {
    tabGroup.appendChild(createTabElement(tabs[i]))
  }
}

function rerenderTabElement (tabId) {
  var tabEl = getTabElement(tabId)
  var tabData = tabs.get(tabId)

  var tabTitle = tabData.title || 'New Tab'
  var title = tabEl.querySelector('.tab-view-contents .title')

  title.textContent = tabTitle
  title.title = tabTitle

  var secIcon = tabEl.getElementsByClassName('icon-tab-not-secure')[0]

  if (tabData.secure === false) {
    if (!secIcon) {
      var iconArea = tabEl.querySelector('.tab-icon-area')
      iconArea.insertAdjacentHTML('beforeend', "<i class='fa fa-unlock icon-tab-not-secure tab-info-icon' title='Your connection to this website is not secure.'></i>")
    }
  } else if (secIcon) {
    secIcon.parentNode.removeChild(secIcon)
  }

  // update the star to reflect whether the page is bookmarked or not
  bookmarks.renderStar(tabId)
}

function createTabElement (data) {
  // new tab opened - show bookmarks
  var lander = document.getElementById('app')
  console.log(lander)
  lander.setAttribute('style', 'display: block')
  
  var url = urlParser.parse(data.url)

  var tabEl = document.createElement('div')
  tabEl.className = 'tab-item'
  tabEl.setAttribute('data-tab', data.id)

  /* css :hover selectors are buggy when a webview is focused */
  tabEl.addEventListener('mouseenter', function (e) {
    this.classList.add('jshover')
  })

  tabEl.addEventListener('mouseleave', function (e) {
    this.classList.remove('jshover')
  })

  var ec = document.createElement('div')
  ec.className = 'tab-edit-contents'

  var input = document.createElement('input')
  input.className = 'tab-input mousetrap'
  input.setAttribute('placeholder', 'Search or enter address')
  input.value = url

  ec.appendChild(input)
  ec.appendChild(bookmarks.getStar(data.id))

  tabEl.appendChild(ec)

  var vc = document.createElement('div')
  vc.className = 'tab-view-contents'
  vc.appendChild(readerView.getButton(data.id))

  // icons

  var iconArea = document.createElement('span')
  iconArea.className = 'tab-icon-area'

  var closeTabButton = document.createElement('i')
  closeTabButton.classList.add('tab-close-button')
  closeTabButton.classList.add('fa')
  closeTabButton.classList.add('fa-times-circle')

  closeTabButton.addEventListener('click', function (e) {
    closeTab(data.id)

    // prevent the searchbar from being opened
    e.stopPropagation()
  })

  iconArea.appendChild(closeTabButton)

  if (data.private) {
    iconArea.insertAdjacentHTML('afterbegin', "<i class='fa fa-eye-slash icon-tab-is-private tab-info-icon'></i>")
    vc.setAttribute('title', 'Private tab')
  }

  vc.appendChild(iconArea)

  // title

  var title = document.createElement('span')
  title.className = 'title'
  title.textContent = data.title || 'New Tab'

  vc.appendChild(title)

  tabEl.appendChild(vc)

  /* events */

  input.addEventListener('keydown', function (e) {
    if (e.keyCode === 9 || e.keyCode === 40) { // if the tab or arrow down key was pressed
      focussearchbarItem()
      e.preventDefault()
    }
  })

  // keypress doesn't fire on delete key - use keyup instead
  input.addEventListener('keyup', function (e) {
    if (e.keyCode === 8) {
      showSearchbarResults(this.value, this, e)
    }
  })

  input.addEventListener('keypress', function (e) {
    if (e.keyCode === 13) { // return key pressed; update the url
      openURLFromsearchbar(e, this.value)

      // focus the webview, so that autofocus inputs on the page work
      getWebview(tabs.getSelected()).focus()
    } else if (e.keyCode === 9) {
      return
    // tab key, do nothing - in keydown listener
    } else if (e.keyCode === 16) {
      return
    // shift key, do nothing
    } else if (e.keyCode === 8) {
      return
    // delete key is handled in keyUp
    } else { // show the searchbar
      showSearchbarResults(this.value, this, e)
    }

    // on keydown, if the autocomplete result doesn't change, we move the selection instead of regenerating it to avoid race conditions with typing. Adapted from https://github.com/patrickburke/jquery.inlineComplete

    var v = String.fromCharCode(e.keyCode).toLowerCase()
    var sel = this.value.substring(this.selectionStart, this.selectionEnd).indexOf(v)

    if (v && sel === 0) {
      this.selectionStart += 1
      e.preventDefault()
    }
  })

  // prevent clicking in the input from re-entering edit-tab mode

  input.addEventListener('click', function (e) {
    e.stopPropagation()
  })

  // click to enter edit mode or switch to a tab
  tabEl.addEventListener('click', function (e) {
    if (e.which === 2) { // if mouse middle click -> close tab
      closeTab(data.id)
    } else if (tabs.getSelected() !== data.id) { // else switch to tab if it isn't focused
      switchToTab(data.id)
    } else { // the tab is focused, edit tab instead
      enterEditMode(data.id)
    }
  })

  tabEl.addEventListener('mousewheel', function (e) {
    if (e.deltaY > 65 && e.deltaX < 10 && Date.now() - lastTabDeletion > 650) { // swipe up to delete tabs
      lastTabDeletion = Date.now()

      /* tab deletion is disabled in focus mode */
      if (isFocusMode) {
        showFocusModeError()
        return
      }

      var tab = this.getAttribute('data-tab')
      this.style.transform = 'translateY(-100%)'

      setTimeout(function () {
        closeTab(tab)
      }, 150) // wait until the animation has completed
    }
  })

  return tabEl
}

function addTab (tabId, options) {
  /*
  options

    options.focus - whether to enter editing mode when the tab is created. Defaults to true.
    options.openInBackground - whether to open the tab without switching to it. Defaults to false.
    options.leaveEditMode - whether to hide the searchbar when creating the tab
  */

  options = options || {}

  if (options.leaveEditMode !== false) {
    leaveTabEditMode() // if a tab is in edit-mode, we want to exit it
  }

  tabId = tabId || tabs.add()

  var tab = tabs.get(tabId)

  // use the correct new tab colors

  if (tab.private && !tab.backgroundColor) {
    tabs.update(tabId, {
      backgroundColor: defaultColors.private[0],
      foregroundColor: defaultColors.private[1]
    })
  } else if (!tab.backgroundColor) {
    tabs.update(tabId, {
      backgroundColor: defaultColors.regular[0],
      foregroundColor: defaultColors.regular[1]
    })
  }

  findinpage.end()

  var index = tabs.getIndex(tabId)

  var tabEl = createTabElement(tab)

  tabGroup.insertBefore(tabEl, tabGroup.childNodes[index])

  addWebview(tabId)

  // open in background - we don't want to enter edit mode or switch to tab

  if (options.openInBackground) {
    return
  }

  switchToTab(tabId, {
    focusWebview: false
  })

  if (options.enterEditMode !== false) {
    enterEditMode(tabId)
  }
}

// startup state is created in sessionRestore.js

// when we click outside the navbar, we leave editing mode

bindWebviewEvent('focus', function () {
  leaveTabEditMode()
  findinpage.end()
})
;function addTaskFromOverlay () {
  tasks.setSelected(tasks.add())
  taskOverlay.hide()

  rerenderTabstrip()
  addTab()
}

var overlay = document.getElementById('task-overlay')
var taskContainer = document.getElementById('task-area')
var taskSwitcherButton = document.getElementById('switch-task-button')
var addTaskButton = document.getElementById('add-task')
var navbar = document.getElementById('task-overlay-navbar')

taskSwitcherButton.addEventListener('click', function () {
  taskOverlay.toggle()
})

addTaskButton.addEventListener('click', function (e) {
  switchToTask(tasks.add())
  taskOverlay.hide()
})

navbar.addEventListener('click', function () {
  taskOverlay.hide()
})

function getTaskOverlayTabElement (tab, task) {
  var item = createSearchbarItem({
    title: tab.title || 'New Tab',
    secondaryText: urlParser.removeProtocol(tab.url),
    classList: ['task-tab-item'],
    delete: function () {
      task.tabs.destroy(tab.id)
      destroyWebview(tab.id)

      // if there are no tabs left, remove the task

      if (task.tabs.count() === 0) {
        destroyTask(task.id)
        if (tasks.get().length === 0) {
          addTaskFromOverlay()
        } else {
          // re-render the overlay to remove the task element
          getTaskContainer(task.id).remove()
        }
      }
    }
  })

  item.setAttribute('data-tab', tab.id)
  item.setAttribute('data-task', task.id)

  return item
}

function getTaskElement (task, taskIndex) {
  var container = document.createElement('div')
  container.className = 'task-container'

  container.setAttribute('data-task', task.id)

  var taskActionContainer = document.createElement('div')
  taskActionContainer.className = 'task-action-container'

  // add the input for the task name

  var input = document.createElement('input')
  input.classList.add('task-name')

  input.placeholder = 'Task ' + (taskIndex + 1)

  input.value = task.name || 'Task ' + (taskIndex + 1)

  input.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
      this.blur()
    }

    tasks.update(task.id, {name: this.value})
  })

  input.addEventListener('focus', function () {
    this.select()
  })

  taskActionContainer.appendChild(input)

  // delete button

  var deleteButton = document.createElement('i')
  deleteButton.className = 'fa fa-trash-o'

  deleteButton.addEventListener('click', function (e) {
    destroyTask(task.id)
    container.remove()

    if (tasks.get().length === 0) { // create a new task
      addTaskFromOverlay()
    }
  })

  taskActionContainer.appendChild(deleteButton)

  container.appendChild(taskActionContainer)

  var tabContainer = document.createElement('div')
  tabContainer.className = 'task-tabs-container'

  if (task.tabs) {
    for (var i = 0; i < task.tabs.length; i++) {
      var el = getTaskOverlayTabElement(task.tabs[i], task)

      el.addEventListener('click', function (e) {
        switchToTask(this.getAttribute('data-task'))
        switchToTab(this.getAttribute('data-tab'))

        taskOverlay.hide()
      })

      tabContainer.appendChild(el)
    }
  }

  container.appendChild(tabContainer)

  return container
}

var taskOverlay = {
  isShown: false,
  dragula: dragula({
    direction: 'vertical'
  }),
  show: function () {
    /* disabled in focus mode */
    if (isFocusMode) {
      showFocusModeError()
      return
    }

    leaveTabEditMode()

    taskOverlay.isShown = true
    taskSwitcherButton.classList.add('active')

    taskOverlay.dragula.containers = []
    empty(taskContainer)

    // show the task elements
    tasks.get().forEach(function (task, index) {
      var el = getTaskElement(task, index)

      taskContainer.appendChild(el)
      taskOverlay.dragula.containers.push(el.getElementsByClassName('task-tabs-container')[0])
    })

    // scroll to the selected element and focus it

    var currentTabElement = document.querySelector('.task-tab-item[data-tab="{id}"]'.replace('{id}', currentTask.tabs.getSelected()))

    if (currentTabElement) {
      currentTabElement.scrollIntoViewIfNeeded()
      currentTabElement.classList.add('fakefocus')
    }

    // un-hide the overlay

    overlay.hidden = false
  },
  hide: function () {
    if (taskOverlay.isShown) {
      taskOverlay.isShown = false
      overlay.hidden = true

      // if the current task has been deleted, switch to the most recent task
      if (!tasks.get(currentTask.id)) {

        // find the last activity of each remaining task
        var recentTaskList = []

        tasks.get().forEach(function (task) {
          recentTaskList.push({id: task.id, lastActivity: tasks.getLastActivity(task.id)})
        })

        // sort the tasks based on how recent they are

        recentTaskList.sort(function (a, b) {
          return b.lastActivity - a.lastActivity
        })

        switchToTask(recentTaskList[0].id)
      }

      taskSwitcherButton.classList.remove('active')
    }
  },
  toggle: function () {
    if (taskOverlay.isShown) {
      taskOverlay.hide()
    } else {
      taskOverlay.show()
    }
  }
}

// swipe down on the tabstrip to show the task overlay
// this was the old expanded mode gesture, so it's remapped to the overlay
tabContainer.addEventListener('mousewheel', function (e) {
  if (e.deltaY < -30 && e.deltaX < 10) {
    taskOverlay.show()
    e.stopImmediatePropagation()
  }
})

function getTaskContainer (id) {
  return document.querySelector('.task-container[data-task="{id}"]'.replace('{id}', id))
}

function syncStateAndOverlay () {

  // get a list of all of the currently open tabs and tasks

  var tabSet = {}
  var taskSet = {}

  tasks.get().forEach(function (task) {
    taskSet[task.id] = task
    task.tabs.get().forEach(function (tab) {
      tabSet[tab.id] = tab
    })
  })

  var selectedTask = currentTask.id

  // destroy the old tasks
  tasks.destroyAll()

  // add the new tasks, in the order that they are listed in the overlay

  var taskElements = taskContainer.getElementsByClassName('task-container')

  for (var i = 0; i < taskElements.length; i++) {
    tasks.add(taskSet[taskElements[i].getAttribute('data-task')])
  }

  tasks.setSelected(selectedTask)

  // loop through each task

  tasks.get().forEach(function (task) {
    var container = getTaskContainer(task.id)

    // if the task still exists, update the tabs
    if (container) {
      // remove all of the old tabs
      task.tabs.destroyAll()

      // add the new tabs
      var newTabs = container.getElementsByClassName('task-tab-item')

      if (newTabs.length !== 0) {
        for (var i = 0; i < newTabs.length; i++) {
          task.tabs.add(tabSet[newTabs[i].getAttribute('data-tab')])
          // update the data-task attribute of the tab element
          newTabs[i].setAttribute('data-task', task.id)
        }
      } else {
        // the task has no tabs, remove it

        destroyTask(task.id)
        container.remove()
      }
    } else {
      // the task no longer exists, remove it

      destroyTask(task.id)
    }
  })
}

taskOverlay.dragula.on('drop', function () {
  syncStateAndOverlay()
})
;var addTabButton = document.getElementById('add-tab-button')

addTabButton.addEventListener('click', function (e) {
  var newTab = tabs.add({}, tabs.getIndex(tabs.getSelected()) + 1)
  addTab(newTab)
})

// defines keybindings that aren't in the menu (so they aren't defined by menu.js)
// For items in the menu, also handles ipc messages

ipc.on('zoomIn', function () {
  getWebview(tabs.getSelected()).send('zoomIn')
})

ipc.on('zoomOut', function () {
  getWebview(tabs.getSelected()).send('zoomOut')
})

ipc.on('zoomReset', function () {
  getWebview(tabs.getSelected()).send('zoomReset')
})

ipc.on('print', function () {
  getWebview(tabs.getSelected()).print()
})

ipc.on('findInPage', function () {
  findinpage.start()
})

ipc.on('inspectPage', function () {
  getWebview(tabs.getSelected()).openDevTools()
})

ipc.on('showReadingList', function () {
  readerView.showReadingList()
})

ipc.on('addTab', function (e, data) {
  /* new tabs can't be created in focus mode */
  if (isFocusMode) {
    showFocusModeError()
    return
  }

  var newIndex = tabs.getIndex(tabs.getSelected()) + 1
  var newTab = tabs.add({
    url: data.url || ''
  }, newIndex)

  addTab(newTab, {
    enterEditMode: !data.url // only enter edit mode if the new tab is about:blank
  })
})

ipc.on('saveCurrentPage', function () {
  var currentTab = tabs.get(tabs.getSelected())

  // new tabs cannot be saved
  if (!currentTab.url) {
    return
  }

  var savePath = remote.dialog.showSaveDialog(remote.getCurrentWindow(), {})

  // savePath will be undefined if the save dialog is canceled
  if (savePath) {
    if (!savePath.endsWith('.html')) {
      savePath = savePath + '.html'
    }
    getWebview(currentTab.id).getWebContents().savePage(savePath, 'HTMLComplete', function () {})
  }
})

function addPrivateTab () {
  /* new tabs can't be created in focus mode */
  if (isFocusMode) {
    showFocusModeError()
    return
  }

  if (isEmpty(tabs.get())) {
    destroyTab(tabs.getAtIndex(0).id)
  }

  var newIndex = tabs.getIndex(tabs.getSelected()) + 1

  var privateTab = tabs.add({
    url: 'about:blank',
    private: true
  }, newIndex)
  addTab(privateTab)
}

ipc.on('addPrivateTab', addPrivateTab)

ipc.on('addTask', function () {
  /* new tasks can't be created in focus mode */
  if (isFocusMode) {
    showFocusModeError()
    return
  }

  addTaskFromOverlay()
  taskOverlay.show()
  setTimeout(function () {
    taskOverlay.hide()
    enterEditMode(tabs.getSelected())
  }, 600)
})

ipc.on('goBack', function () {
  try {
    getWebview(tabs.getSelected()).goBack()
  } catch (e) {}
})

ipc.on('goForward', function () {
  try {
    getWebview(tabs.getSelected()).goForward()
  } catch (e) {}
})

settings.get('keyMap', function (keyMapSettings) {
  keyMap = userKeyMap(keyMapSettings)

  var Mousetrap = require('mousetrap')

  window.Mousetrap = Mousetrap
  Mousetrap.bind(keyMap.addPrivateTab, addPrivateTab)

  Mousetrap.bind(keyMap.enterEditMode, function (e) {
    enterEditMode(tabs.getSelected())
    return false
  })

  Mousetrap.bind(keyMap.closeTab, function (e) {
    // prevent mod+w from closing the window
    e.preventDefault()
    e.stopImmediatePropagation()

    closeTab(tabs.getSelected())

    return false
  })

  Mousetrap.bind(keyMap.addToFavorites, function (e) {
    bookmarks.handleStarClick(getTabElement(tabs.getSelected()).querySelector('.bookmarks-button'))
    enterEditMode(tabs.getSelected()) // we need to show the bookmarks button, which is only visible in edit mode
  })

  // cmd+x should switch to tab x. Cmd+9 should switch to the last tab

  for (var i = 1; i < 9; i++) {
    (function (i) {
      Mousetrap.bind('mod+' + i, function (e) {
        var currentIndex = tabs.getIndex(tabs.getSelected())
        var newTab = tabs.getAtIndex(currentIndex + i) || tabs.getAtIndex(currentIndex - i)
        if (newTab) {
          switchToTab(newTab.id)
        }
      })

      Mousetrap.bind('shift+mod+' + i, function (e) {
        var currentIndex = tabs.getIndex(tabs.getSelected())
        var newTab = tabs.getAtIndex(currentIndex - i) || tabs.getAtIndex(currentIndex + i)
        if (newTab) {
          switchToTab(newTab.id)
        }
      })
    })(i)
  }

  Mousetrap.bind(keyMap.gotoLastTab, function (e) {
    switchToTab(tabs.getAtIndex(tabs.count() - 1).id)
  })

  Mousetrap.bind(keyMap.gotoFirstTab, function (e) {
    switchToTab(tabs.getAtIndex(0).id)
  })

  Mousetrap.bind('esc', function (e) {
    taskOverlay.hide()

    leaveTabEditMode()
    if (findinpage.isEnabled) {
      findinpage.end() // this also focuses the webview
    } else {
      getWebview(tabs.getSelected()).focus()
    }
  })

  Mousetrap.bind(keyMap.toggleReaderView, function () {
    var tab = tabs.get(tabs.getSelected())

    if (tab.isReaderView) {
      readerView.exit(tab.id)
    } else {
      readerView.enter(tab.id)
    }
  })

  // TODO add help docs for this

  Mousetrap.bind(keyMap.goBack, function (d) {
    getWebview(tabs.getSelected()).goBack()
  })

  Mousetrap.bind(keyMap.goForward, function (d) {
    getWebview(tabs.getSelected()).goForward()
  })

  Mousetrap.bind(keyMap.switchToPreviousTab, function (d) {
    var currentIndex = tabs.getIndex(tabs.getSelected())
    var previousTab = tabs.getAtIndex(currentIndex - 1)

    if (previousTab) {
      switchToTab(previousTab.id)
    } else {
      switchToTab(tabs.getAtIndex(tabs.count() - 1).id)
    }
  })

  Mousetrap.bind(keyMap.switchToNextTab, function (d) {
    var currentIndex = tabs.getIndex(tabs.getSelected())
    var nextTab = tabs.getAtIndex(currentIndex + 1)

    if (nextTab) {
      switchToTab(nextTab.id)
    } else {
      switchToTab(tabs.getAtIndex(0).id)
    }
  })

  Mousetrap.bind(keyMap.closeAllTabs, function (d) { // destroys all current tabs, and creates a new, empty tab. Kind of like creating a new window, except the old window disappears.
    var tset = tabs.get()
    for (var i = 0; i < tset.length; i++) {
      destroyTab(tset[i].id)
    }

    addTab() // create a new, blank tab
  })

  Mousetrap.bind(keyMap.toggleTasks, function () {
    if (taskOverlay.isShown) {
      taskOverlay.hide()
    } else {
      taskOverlay.show()
    }
  })

  var lastReload = 0

  Mousetrap.bind(keyMap.reload, function () {
    var time = Date.now()

    // pressing mod+r twice in a row reloads the whole browser
    if (time - lastReload < 500) {
      window.location.reload()
    } else {
      var w = getWebview(tabs.getSelected())

      if (w.src) { // webview methods aren't available if the webview is blank
        w.reloadIgnoringCache()
      }
    }

    lastReload = time
  })

  // mod+enter navigates to searchbar URL + ".com"
  Mousetrap.bind(keyMap.completeSearchbar, function () {
    if (currentSearchbarInput) { // if the searchbar is open
      var value = currentSearchbarInput.value

      leaveTabEditMode()

      // if the text is already a URL, navigate to that page
      if (urlParser.isURLMissingProtocol(value)) {
        navigate(tabs.getSelected(), value)
      } else {
        navigate(tabs.getSelected(), urlParser.parse(value + '.com'))
      }
    }
  })

  Mousetrap.bind(keyMap.showAndHideMenuBar, function () {
    toggleMenuBar()
  })
}) // end settings.get

// reload the webview when the F5 key is pressed
document.body.addEventListener('keydown', function (e) {
  if (e.keyCode === 116) {
    try {
      getWebview(tabs.getSelected()).reloadIgnoringCache()
    } catch (e) {}
  }
})
;/* handles viewing pdf files using pdf.js. Recieves events from main.js will-download */

var PDFViewerURL = 'file://' + __dirname + '/pdfjs/web/viewer.html?url='

ipc.on('openPDF', function (event, filedata) {
  var PDFurl = PDFViewerURL + filedata.url
  var hasOpenedPDF = false

  // we don't know which tab the event came from, so we loop through each tab to find out.

  tabs.get().forEach(function (tab) {
    if (tab.url === filedata.url) {
      navigate(tab.id, PDFurl)
      hasOpenedPDF = true
    }
  })

  if (!hasOpenedPDF) {
    var newTab = tabs.add({
      url: PDFurl
    }, tabs.getIndex(tabs.getSelected()) + 1)

    addTab(newTab, {
      enterEditMode: false
    })

    getWebview(newTab).focus()
  }
});

// find in page
var findinpage = {
  container: document.getElementById('findinpage-bar'),
  isEnabled: true,
  start: function (options) {
    findinpage.counter.textContent = ''
    findinpage.container.hidden = false
    findinpage.isEnabled = true
    findinpage.input.focus()
    findinpage.input.select()
  },
  end: function (options) {
    if (findinpage.isEnabled) {
      findinpage.container.hidden = true
      findinpage.isEnabled = false

      var webview = getWebview(tabs.getSelected())
      webview.stopFindInPage('keepSelection')
      webview.focus()
    }
  }
}

findinpage.input     = findinpage.container.querySelector('.findinpage-input');
findinpage.previous  = findinpage.container.querySelector('.findinpage-previous-match');
findinpage.next      = findinpage.container.querySelector('.findinpage-next-match');
findinpage.counter   = findinpage.container.querySelector('#findinpage-count');
findinpage.endButton = findinpage.container.querySelector('#findinpage-end');

findinpage.endButton.addEventListener('click', function () {
  findinpage.end();
  console.log("findinpage: ending..");
});

findinpage.input.addEventListener('keyup', function (e) {
  if (this.value) {
    getWebview(tabs.getSelected()).findInPage(this.value)
  }
})

findinpage.previous.addEventListener('click', function (e) {
  getWebview(tabs.getSelected()).findInPage(findinpage.input.value, {
    forward: false,
    findNext: true
  })
  findinpage.input.focus()
})

findinpage.next.addEventListener('click', function (e) {
  getWebview(tabs.getSelected()).findInPage(findinpage.input.value, {
    forward: true,
    findNext: true
  })
  findinpage.input.focus()
})

bindWebviewEvent('found-in-page', function (e) {
  if (e.result.matches !== undefined) {
    if (e.result.matches === 1) {
      var text = ' match'
    } else {
      var text = ' matches'
    }

    findinpage.counter.textContent = e.result.matches + text
  }
});

// session restore
var sessionRestore = {
  save: function () {
    var data = {
      version: 2,
      state: JSON.parse(JSON.stringify(tabState))
    }

    // save all tabs that aren't private

    for (var i = 0; i < data.state.tasks.length; i++) {
      data.state.tasks[i].tabs = data.state.tasks[i].tabs.filter(function (tab) {
        return !tab.private
      })
    }

    localStorage.setItem('sessionrestoredata', JSON.stringify(data))
  },
  restore: function () {
    var data = localStorage.getItem('sessionrestoredata')

    // first run, show the tour
    if (!data) {
      tasks.setSelected(tasks.add()) // create a new task

      var newTab = currentTask.tabs.add({
        url: 'https://palmeral.github.io/min/tour'
      })
      addTab(newTab, {
        enterEditMode: false
      })
      return
    }

    console.log(data)

    data = JSON.parse(data)

    localStorage.setItem('sessionrestoredata', '')

    // the data isn't restorable
    if ((data.version && data.version !== 2) || (data.state && data.state.tasks && data.state.tasks.length === 0)) {
      tasks.setSelected(tasks.add())

      addTab(currentTask.tabs.add(), {
        leaveEditMode: false // we know we aren't in edit mode yet, so we don't have to leave it
      })
      return
    }

    // add the saved tasks

    data.state.tasks.forEach(function (task) {
      // restore the task item
      tasks.add(task)
    })

    // switch to the previously selected tasks

    switchToTask(data.state.selectedTask)

    if (isEmpty(currentTask.tabs)) {
      enterEditMode(currentTask.tabs.getSelected())
    }
  }
}

// TODO make this a preference
sessionRestore.restore();

setInterval(sessionRestore.save, 12500);

var isFocusMode = false;

ipc.on('enterFocusMode', function () {
  isFocusMode = true
  document.body.classList.add('is-focus-mode')

  setTimeout(function () { // wait to show the message until the tabs have been hidden, to make the message less confusing
    electron.remote.dialog.showMessageBox({
      type: 'info',
      buttons: ['OK'],
      message: "You're in focus mode.",
      detail: 'In focus mode, all tabs except the current one are hidden, and you can\'t create new tabs. You can leave focus mode by unchecking "focus mode" from the view menu.'
    })
  }, 16)
})

ipc.on('exitFocusMode', function () {
  isFocusMode = false
  document.body.classList.remove('is-focus-mode')
})

function showFocusModeError () {
  electron.remote.dialog.showMessageBox({
    type: 'info',
    buttons: ['OK'],
    message: "You're in focus mode.",
    detail: 'You can leave focus mode by unchecking "focus mode" in the view menu.'
  })
}

function darkModeEnabled () {
  var hours = new Date().getHours()
  return hours > 21 || hours < 6
}

settings.get('darkMode', function (value) {
  if (value === true || darkModeEnabled()) {
    document.body.classList.add('dark-mode')
    window.isDarkMode = true
  } else {
    setInterval(function () {
      if (darkModeEnabled()) {
        document.body.classList.add('dark-mode')
        window.isDarkMode = true
      } else {
        document.body.classList.remove('dark-mode')
        window.isDarkMode = false
      }
    }, 10000)
  }
})
