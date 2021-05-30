var trace_div = document.getElementById('docs');
var search_list = document.getElementById('class-search-list');
var td_container = document.getElementById('td-container');
var ud_container = document.getElementById('ud-container');

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
	if(this.readyState == 4 && this.status == 200) {
		var json = JSON.parse(this.responseText);
		makePackage(json);
	}
};
xmlhttp.open('GET', 'traces/api.0.5.1_658.json', true);
//xmlhttp.setRequestHeader('Cache-Control', 'max-age=3600');
xmlhttp.send();

function makePackage(json) {
	let content = json.content;
	let keys = Object.keys(content);
	
	for(let i in keys) {
		let key = keys[i];
		let obj = makeClass(key, content[key]);

		/* Skip all empty elements */
		if(isMapEmpty(obj)) continue;

		let elm = document.createElement('li');
		elm.addEventListener('mousedown', () => { select_class(key); });
		elm.innerText = key;
		search_list.appendChild(elm);
		obj.list = elm;
		addPackage(key, obj);
	}
	
	let search_elements = Array.prototype.slice.call(search_list.children, 0);
	search_elements.sort((a, b) => {
		let as = a.innerText;
		let bs = b.innerText;
		return as.localeCompare(bs);
	});

	/* Clear the elements to then feed the sorted elements back into the div */
	search_list.innerHTML = '';
	for(let i in search_elements) {
		search_list.appendChild(search_elements[i]);
	}

	/* Search for the text that is already present in the search bar */
	class_list_search(document.getElementById('class-search').value);

	//console.log(packages);

	/*
	let hash = window.location.hash;
	let hash_parent = '';
	if(hash) {
		hash = hash.substring(1);
		let idx = hash.lastIndexOf('.');
		if(idx >= 0) hash_parent = hash.substring(0, idx);
	}
	let exact = false;
	window.location.hash = '#' + hash;
	*/
}

/* Create a class from the top table component */
function makeClass(path, json) {
	let constants = json.constants;
	let tabledata = json.tabledata;
	let userdata = json.userdata;
	
	let result = {};

	/* Add global functions */ {
		let keys = Object.keys(tabledata);

		if(keys.length > 0) {
			let td_div = document.createElement('div');
			td_div.id = 'td_' + path;
			td_div.style.display = 'none';
			td_container.appendChild(td_div);

			for(let i in keys) {
				let key = keys[i];
				let element = createTabledata();
				makeFunction(element, path, key, tabledata[key]);
				td_div.appendChild(element);
			}

			result.tabledata = td_div;
		}
	}
	
	/* Add local functions */ {
		let keys = Object.keys(userdata);

		if(keys.length > 0) {
			let ud_div = document.createElement('div');
			ud_div.id = 'ud_' + path;
			ud_div.style.display = 'none';
			ud_container.appendChild(ud_div);

			for(let i in keys) {
				let key = keys[i];
				let element = createUserdata();
				makeFunction(element, path, key, userdata[key]);
				ud_div.appendChild(element);
			}

			result.userdata = ud_div;
		}
	}

	/* Add constants */ {
		/* TODO */
	}

	return result;
}

function makeFunction(element, path, name, json) {
	if('description' in json) {
		replace(element, '{DESCRIPTION}', escapeHtml(json.description));
	} else {
		replace(element, '{DESCRIPTION}', '');
	}
	
	replace(element, '{DECLSANDBOX}', escapeHtml(json.sandbox));
	replace(element, '{DECLPARAMS}', makeDeclparams(json.params));
	replace(element, '{DECLNAME}', escapeHtml(path + '.' + name));
	replace(element, '{LINK}', escapeHtml(path + '.' + name));
	replace(element, '{PARAMETERS}', makeParameters(json.params));
	replace(element, '{HAS_PARAMETERS}', (json.params.length == 0) ? 'hide-element':'');
	replace(element, '{RETURNS}', escapeHtml(json.returns));
	
	return element;
}

function makeParameters(params) {
	if(params.length == 0) return '';
	
	let result = '<ul class="parameters">';
	for(let i in params) {
		let param = params[i];
		let name = param.name;
		if(!name) {
			if(param.type.length == 1) {
				name = param.type;
			} else {
				name = 'any';
			}
		}
		
		result += '<li><span><strong>' + escapeHtml(name) + '</strong> ( ' + stringifyParam(param, true) + ' )</span></li>'
	}
	
	result += '</ul>';
	return result;
}

function stringifyParam(param, allowMultiple) {
	let name = param.name;
	let types = param.type;
	
	if(name) {
		return '<code class="declparam">' + escapeHtml(name) + '</code>';
	} else if(types.length == 1) {
		return '<code class="declparam">' + escapeHtml(types) + '</code>';
	}
	
	if(allowMultiple) {
		return '<span class="declparam-table"><code class="declparam">' + escapeHtml(types) + '</code></span>';
	}
	
	return '<span class="declparam-table"><code class="declparam">multiple</code></span>';
}

function makeDeclparams(params) {
	let result = '';
	for(let i = 0; i < params.length; i++) {
		result += stringifyParam(params[i]);
		//if(i + 1 < params.length) result += ', ';
	}
	return result;
}

function class_list_search(value) {
	var li = search_list.getElementsByTagName('li');
	var filter = value.toUpperCase();
	for(i = 0; i < li.length; i++) {
		let txt = li[i].innerText;
		if(txt.toUpperCase().indexOf(filter) > -1) {
			li[i].style.display = '';
		} else {
			li[i].style.display = 'none';
		}
	}
}

let last_selected_key;
function select_class(key) {
	let obj = packages[last_selected_key];
	if(obj) {
		if(obj.list) obj.list.style.backgroundColor = '';
		if(obj.tabledata) obj.tabledata.style.display = 'none';
		if(obj.constants) obj.constants.style.display = 'none';
		if(obj.userdata) obj.userdata.style.display = 'none';
	}

	obj = packages[key];
	if(obj) {
		if(obj.list) obj.list.style.backgroundColor = '#222';
		if(obj.tabledata) obj.tabledata.style.display = '';
		if(obj.constants) obj.constants.style.display = '';
		if(obj.userdata) obj.userdata.style.display = '';
	}

	last_selected_key = key;
}

