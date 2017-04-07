var generators = require('yeoman-generator'),
    _ = require('lodash'),
    glob = require('glob'),
    chalk = require('chalk'),
    log = console.log,
    fs = require('fs'),
    path = require('path'),
    del = require('del'),
    generatorName = 'gulp',
    win32 = process.platform === 'win32',
    filePath = process.env[win32 ? 'USERPROFILE' : HOME],
    yeoname = require('../package.json').name,
    modulePath = path.join(filePath, '.' + yeoname, 'node_modules');
//window  不兼容
// function createNodeModules() {
//     log('ccc')
//     if (win32) {
//         require('child_process').exec(`mklink /d .\\node_modules ${modulePath}`)
//     } else {
//         this.spawnCommand('ln', ['-s', modulePath, 'node_modules']);
//     }
// }
module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);
        //是否有node_modules
        var modules = glob.sync('+(node_modules)');
        // log(!_.includes(modules,'node_modules'))
        if (!_.includes(modules, 'node_modules')) {
            if (win32) {
                require('child_process').exec(`mklink /d .\\node_modules ${modulePath}`)
            } else {
                this.spawnCommand('ln', ['-s', modulePath, 'node_modules']);
            }
            log(chalk.bold.green('已建立软连接...'));
        }

        var dirs = glob.sync('+(src)');
        //now _.contains has been abandoned by lodash,use _.includes
        if (_.includes(dirs, 'src')) {
            setTimeout(function() {
                log(chalk.bold.green('资源已经初始化，退出...'));
                process.exit(1);
            }, 200);
        }
        // process.exit(1);
    },
    prompting: function() {
        var done = this.async();
        var questions = [{
                name: 'projectAssets',
                type: 'list',
                message: '请选择模板:',
                choices: [{
                    name: 'PC',
                    value: 'pc',
                    checked: true
                }, {
                    name: 'Mobile',
                    value: 'mobile'
                }]
            },
            {
                type: 'input',
                name: 'projectName',
                message: '输入项目名称',
                default: 'test'
            }
        ]
        return this.prompt(questions).then(
            function(answers) {
                for (var item in answers) {
                    answers.hasOwnProperty(item) && (this[item] = answers[item]);
                }
                done();
            }.bind(this));
    },
    writing: function() {
        this.projectOutput = './dist';
        //拷贝文件
        this.directory(this.projectAssets, 'src');
        this.copy('gulpfile.js', 'gulpfile.js');
        // this.copy('package.json', 'package.json');
        //模板
        // log(this.projectName)
        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath('package.json'), {
                projectName: this.projectName,
                style: this.projectAssets
            }
        );
    },
    end: function() {
        // del(['src/**/.gitignore','src/**/.npmignore','src/js/index.js']);
        var dirs = glob.sync('+(node_modules)');
        if (!_.includes(dirs, 'node_modules')) {
            // 创建软连接
            if (win32) {
                require('child_process').exec(`mklink /d .\\node_modules ${modulePath}`)
            } else {
                this.spawnCommand('ln', ['-s', modulePath, 'node_modules']);
            }
            log(chalk.bold.green('软连接建立完成...'));
        }
        //执行npm install 第1次会强制安装，后面的话会自动判断模块存在的话就不安装
        //但是这样子会出现 网络不好就安装不了的情况
        // this.installDependencies({
        //     bower: false,
        //     npm: true,
        //     skipInstall: false,
        //     callback: () => {
        //         log(chalk.bold.green('软连接建立完成...'));
        //         log(chalk.bold.green('工作流初始化完成...'));
        //         log(chalk.bold.green('进入工作流...'));
        //         this.spawnCommand('gulp');
        //     }
        // });
        //执行cnpm 安装
        var cp = require('child_process').exec('cnpm install');
        // var cp = this.spawnCommand('cnpm install');
        cp.on('close', (code) => {
            log(chalk.bold.green('初始化完成...'));
            log(chalk.bold.green('进入工作流...'));
            // this.spawnCommand('gulp');
        });
        // log(chalk.bold.green('正在初始化...'));
        // cp.stdout.on('data', (data) => {
        //     log(`stdout: ${data}`)
        // })
        // cp.stderr.on('data', (data) => {
        //     console.log(`stderr: ${data}`);
        // })
        // cp.on('close', (code) => {
        //     log(new Date().getTime() - time.getTime())
        //     log(chalk.bold.green('初始化完成...'));
        //     log(chalk.bold.green('进入工作流...'));
        //     // this.spawnCommand('gulp');
        // });
    },

})
