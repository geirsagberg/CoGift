/* eslint-disable no-extend-native */
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

/* Returns true if the inputted object is a JavaScript array */
export function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

/* Converts an object to a JavaScript array */
export function toArray(obj) {
  var out = [];
  if (obj) {
    if (isArray(obj)) {
      out = obj;
    } else if (typeof obj === 'object') {
      for (var key in obj) {
        if(obj.hasOwnProperty(key)){
          out.push(obj[key]);
        }
      }
    }
  }
  return out;
}
