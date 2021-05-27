var trace_div = document.getElementById('docs');
var td_template = document.getElementById('td-func-template');
var container = document.getElementById('class-container');

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
	let a = false;
	Object.keys(content).forEach((key) => {
		if(a) return;
		makeClass(key, content[key]);
		console.log(content[key].tabledata);
		a = Object.keys(content[key].tabledata).length > 0;
	});
}

/* Create a class from the top table component */
function makeClass(path, json) {
	let constants = json.constants;
	let tabledata = json.tabledata;
	let userdata = json.userdata;
	let div = document.createElement('div');
	
	Object.keys(tabledata).forEach((key) => {
		let elm = makeFunction(path, key, tabledata[key]);
		div.appendChild(elm);
	});
	
	container.appendChild(div);
}

function makeFunction(path, name, json) {
	let element = td_template.cloneNode(true);
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
		return '<span class="declparam-table"><em> { </em><code class="declparam"><em>' + types + '</em></code><em> }</em></span>';
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
