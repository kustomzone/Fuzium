// Webview / Zeronet toggle
function toggleState(item) {
  var state   = document.getElementsByClassName(item);
  var toggle  = item.innerHTML.substring(6,11); // temp solution only
  var iframe  = document.getElementById('inner-iframe');
  var webview = document.getElementById('webviews');
  var lander  = document.getElementById('app');
  if (!state.value) { 
    state.value = "off";
  }
  // console.log("state: " + state.value);
  // console.log("html: " + toggle);
  
  // toggle zeronet
  if (toggle == "input") {
   if (state.value == "on") {
	state.value = "off";
	webview.setAttribute('style', 'display: none');
	iframe.setAttribute('style', 'display: block');
	lander.setAttribute('style', 'display: none');
   } else {
	state.value = "on";
	webview.setAttribute('style', 'display: block');
	iframe.setAttribute('style', 'display: none');
	lander.setAttribute('style', 'display: block');
   }
  } else { // toggle bookmarks
	state.value = "off";
	lander.setAttribute('style', 'display: none');
	iframe.setAttribute('style', 'display: none');
	webview.setAttribute('style', 'display: block');
  }
  
}
