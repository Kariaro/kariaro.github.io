var trace_div = document.getElementById('docs');
var search_list = document.getElementById('class-search-list');
var td_template = document.getElementById('td-func-template');
var ud_template = document.getElementById('ud-func-template');
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
xmlhttp.setRequestHeader('Cache-Control', 'max-age=3600');
xmlhttp.send(); 

function makePackage(json) {
	let content = json.content;
	let hash = window.location.hash;
	let hash_parent = '';
	if(hash) {
		hash = hash.substring(1);
		let idx = hash.lastIndexOf('.');
		if(idx >= 0) hash_parent = hash.substring(0, idx);
	}
	let exact = false;
	
	Object.keys(content).forEach((key) => {
		makeClass(key, content[key]);
		
		if(!exact) {
			if(key === hash) {
				exact = true;
				select_class(key);
			} else if(key === hash_parent){
				select_class(key);
			}
		}
		
		{
			let elm = document.createElement('li');
			elm.onclick = () => { select_class(key); };
			elm.innerHTML = '<a>' + escapeHtml(key) + '</a>';
			search_list.appendChild(elm);
		}
	});
	
	window.location.hash = '#' + hash;
}

/* Create a class from the top table component */
function makeClass(path, json) {
	let constants = json.constants;
	let tabledata = json.tabledata;
	let userdata = json.userdata;
	
	let td_div = document.createElement('div');
	td_div.id = 'td_' + path;
	td_div.style.display = 'none';
	Object.keys(tabledata).forEach((key) => {
		let element = td_template.cloneNode(true);
		let elm = makeFunction(element, path, key, tabledata[key]);
		td_div.appendChild(elm);
	});
	td_container.appendChild(td_div);
	
	let ud_div = document.createElement('div');
	ud_div.id = 'ud_' + path;
	ud_div.style.display = 'none';
	Object.keys(userdata).forEach((key) => {
		let element = ud_template.cloneNode(true);
		let elm = makeFunction(element, path, key, userdata[key]);
		ud_div.appendChild(elm);
	});
	ud_container.appendChild(ud_div);
}

function makeFunction(element, path, name, json) {
	/* Remove ID template attribute */
	element.removeAttribute('id');
	
	if("description" in json) {
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
	for(let i = 0; i < params.length; i++) {
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
		return '<code class="declparam"><em>' + escapeHtml(name) + '</em></code>';
	} else if(types.length == 1) {
		return '<code class="declparam"><em>' + escapeHtml(types) + '</em></code>';
	}
	
	if(allowMultiple) {
		return '<span class="declparam-table"><em> { </em><code class="declparam"><em>' + escapeHtml(types) + '</em></code><em> }</em></span>';
	}
	
	return '<span class="declparam-table"><em> { </em><code class="declparam"><em>multiple</em></code><em> } </em></span>';
}

function makeDeclparams(params) {
	let result = '';
	for(let i = 0; i < params.length; i++) {
		result += stringifyParam(params[i]);
		if(i + 1 < params.length) result += ', ';
	}
	return result;
}

function replace(node, key, value) {
	let html = node.innerHTML
	html = html.replaceAll(key, value);
	node.innerHTML = html;
}

function escapeHtml(unsafe) {
    return unsafe.toString()
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

function class_list_search(value) {
	var li = search_list.getElementsByTagName('li');
	var filter = value.toUpperCase();
	for(i = 0; i < li.length; i++) {
		a = li[i].getElementsByTagName('a')[0];
		txt = a.textContent || a.innerText;
		if(txt.toUpperCase().indexOf(filter) > -1) {
			li[i].style.display = "";
		} else {
			li[i].style.display = "none";
		}
	}
}

let last_selected_key;
function select_class(key) {
	let last_td = document.getElementById('td_' + last_selected_key);
	let last_ud = document.getElementById('ud_' + last_selected_key);
	if(last_td) last_td.style.display = 'none';
	if(last_ud) last_ud.style.display = 'none';
	let new_td = document.getElementById('td_' + key);
	let new_ud = document.getElementById('ud_' + key);
	last_selected_key = key;
	if(new_td) new_td.style.display = '';
	if(new_ud) new_ud.style.display = '';
}

