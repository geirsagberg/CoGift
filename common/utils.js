export function encodeHtml(html) {
	return html.replace('&', '&amp;')
		.replace('"', '&quot;')
		.replace("'", '&#39;')
		.replace('<', '&lt;')
		.replace('>', '&gt;');
}

export function decodeHtml(html) {
	return html.replace('&amp;', '&')
		.replace('&quot;', '"')
		.replace('&#39;', "'")
		.replace('&lt;', '<')
		.replace('&gt;', '>');
}

export function isValidEmail(email) {
	return email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/) !== null;
}

if(!String.prototype.isValidEmail) {
	String.prototype.isValidEmail = function() {
		return isValidEmail(this);
	};
}

