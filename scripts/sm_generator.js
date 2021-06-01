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

var packages = {};
var functions = [];

function addPackage(name, value) {
	packages[name] = value;
	value.name = name;
}

function getMapSize(map) {
	if(map) return Object.keys(map).length;
	return 0;
}

function isMapEmpty(map) {
	if(map) return Object.keys(map).length == 0;
	return true;
}

/**
 * TODO: This does weird things on IOS
 * 
 * @param {*} elm 
 */
function copyPragmalink(elm) {
	let key = elm.parentNode.parentNode.parentNode.id;
	const el = document.createElement('textarea');
	el.value = window.location.host + window.location.pathname + '#' + key;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}

function getHashNamespace(hash) {
	let idx = hash.lastIndexOf(':');
	if(idx >= 0) return hash.substring(0, idx);

	idx = hash.lastIndexOf('.');
	if(idx >= 0) return hash.substring(0, idx);

	return hash;
}


function getTemplateBuilder(element) {
	let object = {
		'elm': element,
		'html': element.innerHTML
	};
	object.func = {
		/**
		 * Make sure any calls to this function is escaped.
		 * 
		 * @param {string} key 
		 * @param {string} value 
		 */
		set: function(key, value) {
			if(object.html.replaceAll) {
				object.html = object.html.replaceAll(key, value);
			} else {
				object.html = object.html.replace(new RegExp(key, "g"), value);
			}

			return object.func;
		},
		setOrDefault: function(key, value, def) {
			if(value) return object.set(key, value);
			return object.set(key, def);
		},
		build: function() {
			object.elm.innerHTML = object.html;
			return object.elm;
		}
	};
	return object.func;
}
