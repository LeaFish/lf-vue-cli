
/**
 * 引入依赖
 */

var gulp = require('gulp'),
  clean = require('gulp-clean');          //清空

/**
 * 文件地址寄存
 */

var build = './copy';

var files = [
  '.gitignore','.babelrc','.editorconfig','.postcssrc.js','gulpfile.js','index.html',
  'package.json','package-lock.json','README.md','.eslintignore','.editorconfig','.eslintrc.js','.gitattributes'
];

var dirs = ['static','src','config','build','test'];

/**
 * 任务分发
 */

gulp.task('build',function(){

  files.forEach(item => gulp.src(item).pipe(gulp.dest(build)));

  dirs.forEach(item => gulp.src(item + '/**/*').pipe(gulp.dest(build + '/' + item)));

});

gulp.task('clean',function(){
  gulp.src(build)
    .pipe(clean());
});


