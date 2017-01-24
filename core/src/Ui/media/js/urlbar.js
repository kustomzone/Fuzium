document.addEventListener('DOMContentLoaded', () => {
  const webview        = document.getElementById('webview');
  const urlbar         = document.getElementById('urlbar');
  const address        = document.getElementById('address-bar');
  const iframe         = document.getElementById('inner-iframe');
  const reloadButton   = document.getElementById('reload');
  const forwardButton  = document.getElementById('forward');
  const backButton     = document.getElementById('back');
  const favoriteButton = document.getElementById('favorite');
  const favList        = document.getElementById('fav-list');
 
  webview.addEventListener('load-commit', ({ url, isMainFrame }) => {
    if (isMainFrame) { urlbar.value = url; }
  });
 
  urlbar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
	  webview.setAttribute('src', urlbar.value);
	  address.parentNode.removeChild(address);
	  // iframe.setAttribute('top', '780px');
	  iframe.parentNode.removeChild(iframe);
	  // console.log('urlbar.value: ' + urlbar.value);
    }
  });
 
  reloadButton.addEventListener('click', () => {
    webview.reload();
  });
 
  backButton.addEventListener('click', () => {
    webview.goBack();
  });
  
  forwardButton.addEventListener('click', () => {
    webview.goForward();
  });
  
  favoriteButton.addEventListener('click', () => {
    const listItem = document.createElement('li');
    const listContent = document.createElement('p');
    listItem.setAttribute('class', "list-group-item");
    listItem.setAttribute('data-url', urlbar.value);
    listContent.textContent = urlbar.value;
    listItem.appendChild(listContent);
    favList.appendChild(listItem);
    listItem.addEventListener('click', () => {
      const url = listItem.getAttribute('data-url');
      webview.setAttribute('src', url);
    });
  });
});
