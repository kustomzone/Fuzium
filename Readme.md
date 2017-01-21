
<div align="center">
  <img src="app/gfx/zero_electron.jpg"><br><br>
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
- [ ] addressbar & navigation (forward/backward/url)
- [ ] site creation tool (there's a basic one in Zeronet's home menu)
- [ ] app/zite donation features
- [ ] new app toplist & store
- [ ] cross platform testing & packaged releases


### Bugs (aka todo)

 * No navigation. (except zite loading, and Zeronet's home button)
 * Not resizable. (except fullscreen toggle)
 * Have to reload (CTRL-R) when booting if Zeronet not shown.
 * Some minor redraw glitches. (see previous bug)

 
### Features

 * taskbar preferences

 
### Screenshot

 * (soon)


### Install

```
git clone https://github.com/kustomzone/Fuzium.git
cd Fuzium
npm install && npm start
```


### Status / Notes

| **`Linux`** | **`Mac`** | **`Win`** |
|-------------|-----------|-----------|
|             |           |  running  |
|             |           |alt-key for menu|


Report any [issues](https://github.com/kustomzone/Fuzium/issues) you come across, thanks.


#### Thank you!

 - Tamas Kocsis, creator of Zeronet ( https://zeronet.io )
 - Cheng Zhao, creator of Electron ( http://cheng.guru/ )
 - Plus Github and the rest of the team working on Electron

License
--------------------------------------

Fuzium is released under the MIT License.
