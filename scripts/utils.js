/**
 * This method escapes a string such that it can be written into html elements without causing xss
 * 
 * @param {*} unsafe 
 * @returns 
 */
 function escapeHtml(unsafe) {
	if(unsafe) {
		return unsafe.toString()
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;")
			.replace(/`/g, "&#096;");
	}

	return '';
}

function showErrorDiv(error, hideIssue) {
	console.log(error);
	
	let erdiv = document.createElement('div');
	erdiv.id = 'error_div';
	erdiv.style.backgroundColor = '#733';
	erdiv.style.padding = '20px';
	erdiv.style.color = '#fff';
	erdiv.style.width = '100%';
	erdiv.style.position = 'fixed';
	erdiv.style.bottom = '0px';
	erdiv.innerHTML = (hideIssue ? '':'<p>Error generating page. Please report this error: <a class="pagelink" href="https://github.com/Kariaro/kariaro.github.io/issues" target="blank">[GitHub Issues]</a></p>')
					+ '<pre style="border-left:4px solid #433;padding:10px">' + Utils.escapeHtml(error) + '</pre>';
	document.body.appendChild(erdiv);
	window.location.hash = '#error_div';
}

var Utils = {
	escapeHtml: escapeHtml,
	showErrorDiv: showErrorDiv,
};

/**
 * Check if classes are defined
 */
{
	try {
		eval('class _{};');
	} catch(error) {
		Utils.showErrorDiv(
			'Class syntax is not supported by this browser\n' +
			'This page requires a more modern browser to function correctly',
			true
		);
	}
}
