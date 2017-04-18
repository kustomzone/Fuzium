// Webview / Zeronet toggle
function toggleState(item) {
  var state  = document.getElementsByClassName(item);
  var toggle = item.innerHTML.substring(6,11); // temp solution only
  var iframe = document.getElementById('inner-iframe');
  var wbview = document.getElementById('webviews');
  var lander = document.getElementById('app');
  var navbar = document.getElementById('navbar');
  if (!state.value) { 
    state.value = "off";
  }
  // console.log("state: " + state.value);
  // console.log("html: " + toggle);
  
  // toggle zeronet
  if (toggle == "input") {
   if (state.value == "on") {
	state.value = "off";
	wbview.setAttribute('style', 'display: none');
	iframe.setAttribute('style', 'display: block');
	lander.setAttribute('style', 'display: none');
	navbar.setAttribute('style', 'display: none');
   } else {
	state.value = "on";
	wbview.setAttribute('style', 'display: block');
	iframe.setAttribute('style', 'display: none');
	lander.setAttribute('style', 'display: block');
	navbar.setAttribute('style', 'display: flex');
   }
  } else { // toggle bookmarks
	state.value = "off";
	wbview.setAttribute('style', 'display: block');
	iframe.setAttribute('style', 'display: none');
	lander.setAttribute('style', 'display: none');
	navbar.setAttribute('style', 'display: none');
  }
}
