
<div align="center">
  <img src="gfx/zero_electron.jpg"><br><br>
</div>

## Fuzium 

A fusion of Electron and Zeronet, with more goodness to come.


### Why?

 * What could be better than combining our favorite opensource technologies. 
 * The name is a play on Chromium which Electron is built on.

 
### What's new?

- (Feb 1, 2017) Merged in [Min Browser](https://github.com/minbrowser/min) which uses [DuckDuckGo](https://duckduckgo.com/)
  for extra privacy and instant answers.
  <br>
  It's a ['smarter, faster'](https://minbrowser.github.io/min/) address bar which suits
  this project perfectly. :surfing_man:
  <br>
- (Feb 11) Merged in bookmarking with [Vue.js](https://github.com/coligo-io/bookmarking-app-electron-vuejs-firebase)
  <br>
- (March 11) Lander Apps homepage allowing users to add their own content to the store. 
  <br> (..edit and delete option pending)

### Todo

- [x] config & debug logging
- [x] saves user windowing config
- [x] user preferences & about screen
- [x] download handler (no gui yet)
- [x] packaged releases (pre-alpha)
- [x] addressbar (surf's up! :)
- [x] a newly designed homepage
- [x] bookmark manager & tasklist
- [x] homepage featured appstore (todo: rating, etc)
- [ ] other templated zites on tabbar
- [ ] altcoin plugin intergration
- [ ] user content management (apps and themes)
- [ ] test Chrome extensions & zeronet plugins
- [ ] site creation tools & widgets
- [ ] view console info as sub-windows
- [ ] cross platform testing


### Bugs (v0.0.7)

 * To hide bookmarks the header icon is a temp toggle switch.
 * Opening a zite in the address bar creates additional toggle switches and sidebar buttons.
 * Need to reload (CTRL-R) occasionally after starting if zeronet boots up late.
 * A few display bugs with Zeronet 0.5.3 (toggle On/Off for sidebar)

 
### Features

 * [Min browser's](https://minbrowser.github.io/min/) 'instant answers' address bar with DuckDuckGo integration.
 * taskbar preferences
 * win32 installer or zip
 * tabbed addressbar with instant search and tasklist
 * bookmarking manager
 * homepage appstore


### Test Releases


 - (Mar 11) [Fuzium-v0.0.7-win32-installer](https://github.com/kustomzone/Fuzium/releases/tag/v0.0.7-pre-alpha) with Zeronet 0.5.3
 <br>
 - (Feb 13) [Fuzium-v0.0.6-win32-installer](https://github.com/kustomzone/Fuzium/releases/tag/v0.0.6-pre-alpha) with Zeronet 0.5.2
 <br>
 - (Jan 25) [Fuzium-v0.0.3-win32-zip](https://github.com/kustomzone/Fuzium/releases/tag/v0.0.3-pre-alpha)


### OS Platform Status / Notes

| **`Linux`** | **`Mac`** | **`Win`** |
|-------------|-----------|-----------|
| not running | not running | running  |
| (untested)  | [issue #4](https://github.com/kustomzone/Fuzium/issues/4) |Ctrl-R to reload|


Report any [issues](https://github.com/kustomzone/Fuzium/issues) you come across, thanks.


### Sample

 
 <div align="center">
  <img src="gfx/fuzium-screeny2.jpg"><br><br>
 </div>


### Install

```
git clone https://github.com/kustomzone/Fuzium.git
cd Fuzium
npm install && npm start
```

#### Thank you!


 - [Freeload](https://github.com/MagicInventor/FreeLoad) homepage layout.
 - [PalmerAL](https://github.com/PalmerAL) for the [Min Browser](https://github.com/minbrowser) components.
 - Tamas Kocsis, creator of Zeronet ( https://zeronet.io )
 - Cheng Zhao, creator of Electron ( http://cheng.guru/ )
 - Plus Github and the rest of the team working on Electron


License
-------

- Kustomzone Production, MIT license.
- Contact: fuzium @ kustomzone.com

