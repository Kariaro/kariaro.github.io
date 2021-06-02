import React from 'react';

/*

var trace_div = document.getElementById('docs');
var search_list = document.getElementById('class-search-list');
var td_container = document.getElementById('td-container');
var ud_container = document.getElementById('ud-container');

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
	if(this.readyState == 4 && this.status == 200) {
		try {
			makePackage(JSON.parse(this.responseText));
		} catch(error) {
			Utils.showErrorDiv(error);
		}
	}
};
xmlhttp.open('GET', 'traces/api.0.5.1_658.combined.json', true);
xmlhttp.send();
*/

/*
function makePackage(json) {
	let content = json.content;
	let keys = Object.keys(content);
	
	for(let i in keys) {
		let key = keys[i];
		let obj = makeClass(key, content[key]);

		// Skip all empty elements
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

	// Clear the elements to then feed the sorted elements back into the div
	search_list.innerHTML = '';
	for(let i in search_elements) {
		search_list.appendChild(search_elements[i]);
	}

	// Search for the text that is already present in the search
	class_list_search(document.getElementById('class-search').value);

	if(window.location.hash) {
		let hash = window.location.hash.substring(1);
		let value = getHashNamespace(hash);
		select_class(value);
		window.location.hash = '#';
		window.location.hash = '#' + hash.toLowerCase();
	}
}

// Create a class from the top table component
function makeClass(path, json) {
	let constants = json.constants;
	let tabledata = json.tabledata;
	let userdata = json.userdata;
	
	let result = {};

	{ // Add global functions
		let keys = Object.keys(tabledata);

		if(keys.length > 0) {
			let td_div = document.createElement('div');
			td_div.id = 'td_' + path;
			td_div.style.display = 'none';
			td_container.appendChild(td_div);

			for(let i in keys) {
				let key = keys[i];
				let element = createTabledata();
				makeFunction(element, path, false, key, tabledata[key]);
				td_div.appendChild(element);
			}

			result.tabledata = td_div;
		}
	}
	
	{ // Add local functions
		let keys = Object.keys(userdata);

		if(keys.length > 0) {
			let ud_div = document.createElement('div');
			ud_div.id = 'ud_' + path;
			ud_div.style.display = 'none';
			ud_container.appendChild(ud_div);

			for(let i in keys) {
				let key = keys[i];
				let element = createUserdata();
				makeFunction(element, path, true, key, userdata[key]);
				ud_div.appendChild(element);
			}

			result.userdata = ud_div;
		}
	}

	{ // Add constants
		// TODO
	}

	return result;
}

function makeFunction(element, path, is_userdata, name, json) {
	if(is_userdata) {
		if(json.params) {
			if(json.params.length > 0) {
				json.params[0].name = 'self';
			} else {
				json.params.push({ 'name': 'self', 'type': [ 'unknown' ] });
			}
		} else {
			json.params = [{ 'name': 'self', 'type': [ 'unknown' ] }];
		}
	}
	
	let decl_name = Utils.escapeHtml(path + (is_userdata ? ':':'.') + name);
	element.id = decl_name.toLowerCase();
	let decl_desc = '';
	if('description' in json) {
		if(marked) {
			decl_desc = marked(json.description);
		} else {
			decl_desc = Utils.escapeHtml(json.description);
		}
	}

	getTemplateBuilder(element)
		.set('{DECLSANDBOX}', Utils.escapeHtml(json.sandbox))
		.set('{DESCRIPTION}', decl_desc)
		.set('{DECLPARAMS}', makeDeclparams(json.params))
		.set('{DECLNAME}', decl_name)
		.set('{PARAMETERS}', makeParameters(json.params))
		.set('{RETURNS}', makeParameters(json.returns))
		.set('{HAS_PARAMETERS}', (json.params.length == 0) ? 'hide-element':'')
		.set('{HAS_RETURNS}', (json.returns.length == 0) ? 'hide-element':'')
		.set('{RETURNS}', Utils.escapeHtml(json.returns))
		.build();
	functions.push({ 'name': name, 'elm': element });
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

		let docs = '';
		if(param.description) {
			if(marked) {
				docs = marked(param.description);
			} else {
				docs = Utils.escapeHtml(param.description);
			}
		}

		result += '<li><span><strong class="parameters-strong">' + Utils.escapeHtml(name) + ':</strong>' + stringifyParam(param) + '</span><span>' + docs + '</span></li>'
	}
	
	result += '</ul>';
	return result;
}

function stringifyParam(param, allowName) {
	let types = param.type;

	if(param.name && allowName) {
		return '<code class="declparam">' + Utils.escapeHtml(param.name) + '</code>';
	}

	if(types.length == 1) {
		return '<code class="declparam">' + Utils.escapeHtml(types) + '</code>';
	}
	
	return '<span class="declparam-table"><code class="declparam">' + Utils.escapeHtml(types) + '</code></span>';
}

function makeDeclparams(params) {
	let result = '';
	for(let i in params) {
		result += stringifyParam(params[i], true);
	}
	return result;
}

var last_func_state = false;
function class_list_search(value) {
	var filter = value.toUpperCase();

	let found = false;
	let list = search_list.childNodes;
	for(let i in list) {
		let li = list[i];

		let txt = li.innerText;
		if(txt) {
			if(txt.toUpperCase().indexOf(filter) > -1) {
				li.style.display = '';
				found = true;
			} else {
				li.style.display = 'none';
			}
		}
	}

	if(last_func_state != found) {
		for(let i = 0; i < functions.length; i++) {
			functions[i].elm.style.display = '';
			functions[i].elm.parentNode.style.display = 'none';
		}
		
		last_func_state = found;
	}

	if(!found) {
		filter = filter.trim();

		for(let i = 0; i < packages.length; i++) {
			let obj = packages[i];
			if(obj.tabledata) obj.tabledata.style.display = '';
			if(obj.constants) obj.constants.style.display = '';
			if(obj.userdata) obj.userdata.style.display = '';
		}

		for(let i = 0; i < functions.length; i++) {
			let obj = functions[i];
			let txt = obj.name;
			if(txt) {
				if(txt.toUpperCase().indexOf(filter) > -1) {
					obj.elm.style.display = '';
					obj.elm.parentNode.style.display = '';
				} else {
					obj.elm.style.display = 'none';
				}
			}
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

		ud_container.style.display = obj.userdata ? '':'none';
		td_container.style.display = obj.tabledata ? '':'none';
	}

	last_selected_key = key;
}
*/

function DocsFunc(props) {
	return (
		<div>
			{props}
		</div>
	);
}

export default DocsFunc;
