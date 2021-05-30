function escapeHtml(unsafe) {
	return unsafe.toString()
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

/**
 * Replace a key inside a element
 */
function replace(element, key, value) {
	let html = element.innerHTML
	html = html.replaceAll(key, value);
	element.innerHTML = html;
}


var td_template = document.getElementById('td-func-template');
function createTabledata() {
    let elm = td_template.cloneNode(true);
    elm.removeAttribute('id');
    return elm;
}

var ud_template = document.getElementById('ud-func-template');
function createUserdata() {
    let elm = ud_template.cloneNode(true);
    elm.removeAttribute('id');
    return elm;
}

/**
 * This field will contain the packages
 */
var packages = {};

function addPackage(name, value) {
	packages[name] = value;
	value.name = name;
}

function getMapSize(map) {
	if(map) {
		return Object.keys(map).length;
	}

	return 0;
}

function isMapEmpty(map) {
	if(map) return Object.keys(map).length == 0;
	return true;
}
