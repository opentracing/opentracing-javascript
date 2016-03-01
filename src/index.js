'use strict';

import Singleton from './singleton';
import * as Constants from './constants';

let singleton =  new Singleton();

// Merge the constants into the singleton object so they are accessible at the
// package level.
for (let key in Constants) {
    singleton[key] = Constants[key];
}

module.exports = singleton;
