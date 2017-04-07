#!/usr/bin/env node

var path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    win32 = process.platform === 'win32',
    filePath = process.env[win32 ? 'USERPROFILE' : 'HOME'],
    nodeModulePath = path.join(filePath, '.' + process.env.npm_package_name, 'node_modules'),
    configPath = path.join(filePath, '.' + process.env.npm_package_name, 'config.json');

//不能跨2级创建目录
// fs.mkdir(nodeModulePath,function(err){
//     if(err){
//         throw err;
//     }
//     console.log('node_modules目录创建完毕')
// })
//创建node_module
//path cb
mkdirp.sync(nodeModulePath, function(err) {
    if (err) {
        throw err;
    }
})
console.log('node_modules目录创建完毕')
//创建config.json
// path data config cb
fs.writeFileSync(configPath, JSON.stringify({}, null, 4), {}, function(err) {
    if (err) {
        throw err
    }
})
console.log('config.json创建完毕');
