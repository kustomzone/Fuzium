
<div align="center">
  <img src="gfx/zero_electron.jpg"><br><br>
</div>

## Fuzium 

Fusion of Electron and Zeronet into something new. 【WIP】


### Why?

 * What could be better than combining our favorite opensource technologies. 
 * The name is a play on Chromium which Electron is built on.


### Todo

- [x] config & debug logging
- [x] saves user windowing config
- [x] user preferences & about screen
- [x] download handler (no gui yet)
- [x] packaged release (pre-alpha)
- [x] addressbar (there is one, but it only hops once :)
- [ ] bookmarks, notes etc
- [ ] view consoles
- [ ] test Chrome extensions
- [ ] test zeronet plugins
- [ ] site creation tools
- [ ] app/zite donation features
- [ ] new app toplist & store (altcoins)
- [ ] cross platform testing


### Bugs (aka todo)

 * URL bar works once, then reload to use again (zeronet wrapper hack)
 * Not resizable. (except fullscreen toggle)
 * Reload (CTRL-R) when booting is just occasional now
 * Some minor redraw glitches.
 * Remove file duplication (dev vs release)

 
### Features

 * add zites using address bar
 * taskbar preferences
 * win32 installer or zip


### Screenshot

 * (soon)


### Install

```
git clone https://github.com/kustomzone/Fuzium.git
cd Fuzium
npm install && npm start
```

### Test Releases

[Fuzium-win32-v0.0.2-installer](https://github.com/kustomzone/Fuzium/releases/tag/v0.0.2-pre-alpha)
[Fuzium-win32-v0.0.3-zip](https://github.com/kustomzone/Fuzium/releases/tag/v0.0.3-pre-alpha)


### OS Platform Status / Notes

| **`Linux`** | **`Mac`** | **`Win`** |
|-------------|-----------|-----------|
| not running | not running | running  |
|  (afaik)    | [issue #4](https://github.com/kustomzone/Fuzium/issues/4) |alt-key for menu|


Report any [issues](https://github.com/kustomzone/Fuzium/issues) you come across, thanks.


#### Thank you!

 - Tamas Kocsis, creator of Zeronet ( https://zeronet.io )
 - Cheng Zhao, creator of Electron ( http://cheng.guru/ )
 - Plus Github and the rest of the team working on Electron


License
-------

- Kustomzone Production, MIT license.
- Contact: fuzium @ kustomzone.com

