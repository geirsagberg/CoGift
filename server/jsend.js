/**
 * Shortcuts for JSend JSON API (http://labs.omniti.com/labs/jsend)
 * @author Geir Sagberg
 */

export function fail(data) {
  return {
    status: 'fail',
    data
  };
}

export function success(data) {
  return {
    status: 'success',
    data
  };
}

export function error(message, {code, data}) {
  return {
    status: 'error',
    message,
    code,
    data
  };
}

export default {fail, success, error};