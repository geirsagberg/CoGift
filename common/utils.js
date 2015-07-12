/* eslint-disable no-extend-native */
export function encodeHtml(html) {
	return String(html).replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

export function decodeHtml(html) {
	return String(html).replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
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
