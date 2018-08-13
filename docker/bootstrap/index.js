#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const envs = require('./envs.js');

console.log(envs);

// TODO: 1, get service url from etcd. 2, remove source map.
