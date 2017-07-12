#!/usr/bin/env node
'use strict';
const Password = require('./lib/password')

// set argument
let service = process.argv[2] || 'default';
let username = process.argv[3] || 'default';

// instance class
let password = new Password(service, username);

// call result to clipboard
password.get();
