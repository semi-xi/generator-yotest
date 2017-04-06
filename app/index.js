var generators = require('yeoman-generator'),
    _ = require('yeoman-generator/node_modules/lodash'),
    glob = require('yeoman-generator/node_modules/glob'),
    chalk = require('yeoman-generator/node_modules/chalk'),
    log = console.log,
    fs = require('fs'),
    path = require('path'),
    del = require('del'),
    generatorName = 'gulp',
    win32 = process.platform === 'win32',
    yoName = '';

module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);
        yoName = require('../package.json').name;
        var dirs = glob.sync('+(src)');
        //now _.contains has been abandoned by lodash,use _.includes
        if (_.includes(dirs, 'src')) {
            //是否有node_modules
            var modules = glob.sync('+(node_modules)');
            // log(!_.includes(modules,'node_modules'))
            if(!_.includes(modules,'node_modules')){
                this.createNodeModules();
                log(chalk.bold.green('已建立软连接...退出'));

            } else{
                log(chalk.bold.green('资源已经初始化，退出...'));
            }
            setTimeout(function() {
                process.exit(1);
            }, 200);
        }

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
                style :this.projectAssets
            }
        );
    },
    end: function() {
        // del(['src/**/.gitignore','src/**/.npmignore','src/js/index.js']);
        log(this._sourceRoot)
        var dirs = glob.sync('+(node_modules)');
        if (!_.includes(dirs, 'node_modules')) {
            //创建软连接
            this.createNodeModules();

        }
        log(chalk.bold.green('软连接建立完成...'));
        log(chalk.bold.green('工作流初始化完成...'));
        log(chalk.bold.green('进入工作流...'));
    },
	createNodeModules:function(){
		if(win32){
			require('child_process').exec(`mklink /d .\\node_modules ${process.env.APPDATA}\\npm\\node_modules\\${yoName}\\app\\templates\\node_modules`)
		} else{
			this.spawnCommand('ln', ['-s', `/usr/local/lib/node_modules/${yoName}/app/templates/node_modules`, 'node_modules']);
            this.spawnCommand('gulp');
		}
	}
})
