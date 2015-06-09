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
