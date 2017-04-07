var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    rev = require('gulp-rev-append'), //加版本号 rev()
    q = require('q'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    sourcemaps = require('gulp-sourcemaps');
var env = false ; // 是否正式环境
// gulp.src(['./src/js/**/*.js'], {
//         base: 'src'
//     })
//     .pipe(plugins.rename({
//         dirname: "main/text/ciao",
//         basename: "aloha",
//         prefix: "bonjour-",
//         suffix: "-hola",
//         extname: ".md"
//         // ./dist/js/main/text/ciao/bonjour-aloha-hola.md
//     }))
//     .pipe(gulp.dest('dist'))
//压缩
// gulp.task('uglify',function(){
//     gulp.src(['./src/*.scss'])
//         .pipe(concat('index.css'))
// })
gulp.task('server', ['sass','less','js'],function() {
    browserSync.init({
        open:'external',
        server: {
            baseDir: "./src",
            directory:true
        }
    });
    gulp.watch('./src/scss/**/*.scss',['sass']);
    gulp.watch('./src/scss/**/*.less',['less']);
    gulp.watch('./src/js/**/*.js',['js']);
    gulp.watch('./src/**/*.html').on('change',reload);
});
//合并
gulp.task('sass',function(){
    return gulp.src(['./src/scss/**/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error',function(error){
            console.error(error.toString());
            this.emit('end')
        })
        .pipe(concat('main.css'))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./src/css'))
        .pipe(reload({stream:true}))
})
gulp.task('less',function(){
    return gulp.src(['./src/**/*.less'])
        .pipe(sourcemaps.init())
        .pipe(less())
        .on('error',function(error){
            console.error(error.toString());
            this.emit('end')
        })
        .pipe(concat('main.css'))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./src/css'))
        .pipe(reload({stream:true}))
})
gulp.task('js',function(){
    // reload({stream:true})
    //先引入文件内的防止变量错误
    return gulp.src(['./src/js/*/**/*.js','./src/js/*.js'])
        // .pipe(concat('index.js'))
        // .pipe(uglify())
        // .pipe(gulp.dest('./dist/js'))
        .pipe(reload({stream:true}))
})
gulp.task('concat',['sass','js'])
gulp.task('default',['server'] ,function() {

})

gulp.task('build',['concat'],function(){

})
