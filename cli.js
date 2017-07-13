#!/usr/bin/env node
'use strict';
const Password = require('./lib/password');

// Set argument
const service = process.argv[2] || 'default';
const username = process.argv[3] || 'default';

// Instance class
const password = new Password(service, username);

// Call result to clipboard
password.get();
