// Webview / Zeronet toggle
function toggleState(item) {
  var state   = document.getElementsByClassName(item);
  var iframe  = document.getElementById('inner-iframe');
  var webview = document.getElementById('webviews');
  // console.log("value: " + state.value);
  
  if (state.value == "on") {
	state.value = "off";
	webview.setAttribute('style', 'display: none');
	iframe.setAttribute('style', 'display: block');
  } else {
	state.value = "on";
	webview.setAttribute('style', 'display: block');
	iframe.setAttribute('style', 'display: none');
  }
}
