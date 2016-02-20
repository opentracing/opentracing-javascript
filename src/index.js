'use strict';

import Singleton from './singleton';

let singleton =  new Singleton();

// Add in constants to the singleton object
singleton.FORMAT_SPLIT_BINARY = 'split_binary';
singleton.FORMAT_SPLIT_TEXT   = 'split_text';

module.exports = singleton;
