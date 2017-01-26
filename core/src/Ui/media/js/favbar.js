const parser	= new DOMParser();
const { shell } = require('electron');

const favbar	= document.querySelector('#favbar');
const clearFavs = document.querySelector('#clear-favs');
const showFavs  = document.querySelector('.show-favs');
const showErrs  = document.querySelector('.show-errors');

// fav submit
favbar.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
	console.log('fav: ' + favbar.value);
	e.preventDefault()
	const url = favbar.value
	
	fetch(url)
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

showFavs.addEventListener('click', (e) => {
  if (e.target.href) {
	e.preventDefault()
	shell.openExternal(e.target.href)
  }
});

clearFavs.addEventListener('click', function clearStorage() {
  localStorage.clear()
  showFavs.innerHTML = ''
});

function clearForm() {
  favbar.value = null
}

function parseResponse(text) {
  return parser.parseFromString(text, 'text/html')
}

function findTitle(nodes) {
  return nodes.querySelector('title').innerText
}

function storeLink(title, url) {
  localStorage.setItem(url, JSON.stringify({ title, url }))
}

function getLinks() {
  return Object.keys(localStorage).map(key => JSON.parse(localStorage.getItem(key)))
}

function convertToElement(link) {
  return `<div class="link"><h3>${link.title}</h3>
		  <p><a href="${link.url}">${link.url}</a></p></div>`
}

function renderLinks() {
  const linkElements = getLinks().map(convertToElement).join('')
  showFavs.innerHTML = linkElements
}

function handleError(error, url) {
  showErrs.innerHTML = `
  There was an issue adding "${url}": ${error.message}
  `.trim()
  setTimeout(() => showErrs.innerText = null, 5000)
}

function validateResponse(response) {
  if (response.ok) return response
  throw new Error(`Status code of ${response.status} ${response.statusText}`)
}

renderLinks();
