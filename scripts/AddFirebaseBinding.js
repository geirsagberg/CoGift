/*!
 * ReactFire is an open-source JavaScript library that allows you to add a
 * realtime data source to your React apps by providing and easy way to let
 * Firebase populate the state of React components.
 *
 * ReactFire 0.4.0
 * https://github.com/firebase/reactfire/
 * License: MIT
 * @author Firebase
 * @author Geir Sagberg <geir.sagberg@gmail.com>
 */
import { Component } from 'react';

function validateFirebaseRef(firebaseRef) {
  var errorMessage, errorCode;
  if (Object.prototype.toString.call(firebaseRef) !== '[object Object]') {
    errorMessage = 'firebaseRef must be an instance of Firebase';
    errorCode = 'INVALID_FIREBASE_REF';
  }

  if (typeof errorMessage !== 'undefined') {
    var error = new Error('ReactFire: ' + errorMessage);
    error.code = errorCode;
    throw error;
  }
}

function validateSetValue(setValue) {
  if(typeof setValue !== 'function') {
    var error = new Error('ReactFire: setValue must be a function!');
    error.code = 'INVALID_SETVALUE_CALLBACK';
    throw error;
  }
}

/* Returns true if the inputted object is a JavaScript array */
function isArray(obj) {
  return (Object.prototype.toString.call(obj) === '[object Array]');
}

/* Converts a Firebase object to a JavaScript array */
function toArray(obj) {
  var out = [];
  if (obj) {
    if (isArray(obj)) {
      out = obj;
    }
    else if (typeof obj === 'object') {
      for (var key of obj) {
        out.push(obj[key]);
      }
    }
  }
  return out;
}

export default SubComponent => class extends Component {
  /********************/
  /*  MIXIN LIFETIME  */
  /********************/
  /* Initializes the Firebase binding refs array */
  componentWillMount() {
    this.firebaseRefs = {};
    this.firebaseListeners = {};
  }

  /* Removes any remaining Firebase bindings */
  componentWillUnmount() {
    for (var firebaseRef of this.firebaseRefs) {
      this.unbind(firebaseRef);
    }
  }

  /*************/
  /*  BINDING  */
  /*************/
  /* Creates a binding between Firebase and the inputted bind variable as an array */
  bindAsArray(firebaseRef, setValue, cancelCallback) {
    this._bind(firebaseRef, setValue, cancelCallback, true);
  }

  /* Creates a binding between Firebase and the inputted bind variable as an object */
  bindAsObject(firebaseRef, setValue, cancelCallback) {
    this._bind(firebaseRef, setValue, cancelCallback, false);
  }

  /* Creates a binding between Firebase and the inputted bind variable as either an array or object */
  _bind(firebaseRef, setValue, cancelCallback, bindAsArray) {
    validateFirebaseRef(firebaseRef);
    validateSetValue(setValue);
    var key = firebaseRef.key();
    this.firebaseRefs[key] = firebaseRef;
    this.firebaseListeners[key] = firebaseRef.on('value', dataSnapshot => {
      let value = dataSnapshot.val();
      if (bindAsArray) {
        value = toArray(value);
      }
      setValue(value);
    }, cancelCallback);
  }

  /* Removes the binding between Firebase and the inputted bind variable */
  unbind(keyOrRef) {
    var key;
    if (typeof keyOrRef !== 'string') {
      if (typeof keyOrRef.key !== 'function') {
        let error = new Error('ReactFire: unexpected value for unbind. Expected firebase ref or key.');
        error.code = 'UNEXPECTED_KEY_TYPE';
        throw error;
      }
      key = keyOrRef.key();
    } else {
      key = keyOrRef;
    }
    if (typeof this.firebaseRefs[key] === 'undefined') {
      let error = new Error('ReactFire: unexpected value for key. "' + key + '" was either never bound or has already been unbound');
      error.code = 'UNBOUND_BIND_VARIABLE';
      throw error;
    }

    this.firebaseRefs[key].off('value', this.firebaseListeners[key]);
    delete this.firebaseRefs[key];
    delete this.firebaseListeners[key];
  }
};
