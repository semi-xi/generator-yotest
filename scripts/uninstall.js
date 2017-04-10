var fs = require('fs'),
    path = require('path'),
    del = require('del'),
    win32 = process.platform === 'win32',
    filePath = process.env[win32 ? 'USERPROFILE' : 'HOME'],
    yoFile = path.join(filePath, '.' + process.env.npm_package_name);
 //销毁文件
 console.log('正在删除node_modules文件...')
del([yoFile], {
    force: true
}).then((path)=>{
     // console.log('已删除node_modules文件...')
})
