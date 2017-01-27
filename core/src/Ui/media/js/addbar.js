
// WORK IN PROGRESS..

const parser	   = new DOMParser();
// const { shell }    = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  
  const webview    = document.getElementById('webview');
  const urlbar     = document.getElementById('urlbar');
  const address    = document.getElementById('address-bar');
  const iframe     = document.getElementById('inner-iframe');
  const reloadBtn  = document.getElementById('reload');
  const forwardBtn = document.getElementById('forward');
  const backBtn    = document.getElementById('back');
  const favBtn     = document.getElementById('fav');
  const favList    = document.getElementById('fav-list');
  const favbar	   = document.getElementById('favbar');
  const clearFavs  = document.getElementById('clear-favs');
  
  const showErrs   = document.querySelector('.show-errors');

 
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
 
  reloadBtn.addEventListener('click', () => {
    webview.reload();
  });
 
  backBtn.addEventListener('click', () => {
    webview.goBack();
  });
  
  forwardBtn.addEventListener('click', () => {
    webview.goForward();
  });
  
  // link click
  favBtn.addEventListener('click', () => {
    const listItem = document.createElement('li');
    listItem.setAttribute('class', "fav-item");
    listItem.setAttribute('data-url', favbar.value);
	listItem.setAttribute('background-color', '#454540');
    listItem.textContent = favbar.value;
    favList.appendChild(listItem);
	
    listItem.addEventListener('click', () => {
      const url = listItem.getAttribute('data-url');
      webview.setAttribute('src', url);
	  address.parentNode.removeChild(address);
	  // iframe.setAttribute('top', '780px');
	  iframe.parentNode.removeChild(iframe);
    });
  });
});

renderLinks();

// fav submit
favbar.addEventListener('keypress', (e) => {
  
  if (e.key === 'Enter') {
	
	console.log('fav: ' + favbar.value);
	
	/*
	
	e.preventDefault()
	const url = favbar.value
	
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.responseType = 'json';

	xhr.onload = function() {
		console.log(xhr.response);
	};

	xhr.onerror = function() {
		console.log("error: 404");
	};

	xhr.send();
	*/
	
	/*
	fetch(url, {
		mode: 'no-cors'
	})
    .then(function(response) {
        if (!response.ok) {
            console.log(response.statusText);
        }
        return response;
    }).then(function(response) {
        console.log("ok");
		console.log(response.text());
    }).catch(function(error) {
        console.log(error);
    });
	*/
	
	/*
	fetch('//google.com', {
		mode: 'no-cors'
	}).then(function(response) {
		console.log(response.type); // "opaque"
	});
	*/
	
	// todo: get url title (403 forbidden)
	fetch(url, {
		mode: 'no-cors'
	})
	.then(validateResponse)
	.then(response => response.text())
	.then(parseResponse)
	.then(findTitle)
	.then(title => storeLink(title, url))
	.then(clearForm)
	.then(renderLinks)
	.catch(error => handleError(error, url))
  }
});

// load fav
favList.addEventListener('click', (e) => {
  if (e.target.href) {
	e.preventDefault();
	webview.setAttribute('src', e.target.href);
	// shell.openExternal(e.target.href);
	address.parentNode.removeChild(address);
	// iframe.setAttribute('top', '780px');
	iframe.parentNode.removeChild(iframe);
  }
});

// clear favs
clearFavs.addEventListener('click', function clearStorage() {
  localStorage.clear();
  favList.innerHTML = '';
});

function renderLinks() {
  const linkElements = getLinks().map(convertToElement).join('');
  if (linkElements) {
	  favList.innerHTML = linkElements;
  }
}

function getLinks() {
  return Object.keys(localStorage).map(key => JSON.parse(localStorage.getItem(key)));
}

function storeLink(title, url) {
  localStorage.setItem(url, JSON.stringify({ title, url }));
}

function clearForm() {
  favbar.value = null;
}

function parseResponse(text) {
  return parser.parseFromString(text, 'text/html');
}

function findTitle(nodes) {
  return nodes.querySelector('title').innerText;
}

function convertToElement(link) {
  return `<div class="link"><h3>${link.title}</h3>
		  <p><a href="${link.url}">${link.url}</a></p></div>`;
}

function handleError(error, url) {
  showErrs.innerHTML = `
  There was an issue adding "${url}": ${error.message}
  `.trim()
  setTimeout(() => showErrs.innerText = null, 5000);
}

function validateResponse(response) {
  if (response.ok) return response
  throw new Error(`Status code of ${response.status} ${response.statusText}`);
}
