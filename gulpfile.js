var gulp = require('gulp'),
    less = require('gulp-less'), //less
    imagemin = require('gulp-imagemin'), //图片压缩
    minifycss = require('gulp-minify-css'), //css压缩
    jshint = require('gulp-jshint'), //js检查
    uglify = require('gulp-uglify'), //js压缩
    rename = require('gulp-rename'), //重命名
    concat = require('gulp-concat'), //合并文件
    clean = require('gulp-clean'), //清空文件夹
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    //cache = require('gulp-cache'),
    //tinypng = require('gulp-tinypng'), //tinypng
    livereload = require('gulp-livereload'); //livereload

var paths = {
    html: 'src/html/*.html',
    js: 'src/js/*.js',
    less: 'src/less/*.less',
    css: ['dist/css/*.css', '!dist/css/*min.css'],
    img: 'src/img/**/*'
};

gulp.task('cleanHtml', function() {
    return gulp.src('dist/html')
        .pipe(clean());
});

gulp.task('html', ['cleanHtml'], function() {
    return gulp.src(paths.html)
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(livereload())
        .pipe(gulp.dest('dist/html'))
        .pipe(livereload());
});

gulp.task('cleanCss', function() {
    return gulp.src('dist/css')
        .pipe(clean());
});

gulp.task('less', ['cleanCss'], function() {
    return gulp.src(paths.less)
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(less())
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload());
});

gulp.task('cssprefixer', ['less'], function() {
    return gulp.src(paths.css)
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload());
});

gulp.task('css', ['less', 'cssprefixer'], function() {
    return gulp.src(paths.css)
        .pipe(minifycss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload());
});



gulp.task('cleanImg', function() {
    return gulp.src('dist/img')
        .pipe(clean());
});

gulp.task('img', ['cleanImg'], function() {
    return gulp.src(paths.img)
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
        .pipe(livereload());
});

gulp.task('cleanJs', function() {
    return gulp.src('dist/js')
        .pipe(clean());
});

gulp.task('js', ['cleanJs'], function() {
    return gulp.src(paths.js)
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/js'))
        .pipe(livereload());
});


gulp.task('clean', function() {
    return gulp.src(['dist/css', 'dist/js', 'dist/img'])
        .pipe(clean());
});

gulp.task('default', ['clean'], function() {
    gulp.start('html', 'css', 'img', 'js');
});

gulp.task('watch', function() {
    livereload.listen();

    //监听html
    gulp.watch(paths.html, function(event) {
        gulp.run('html');
    });

    //监听css
    gulp.watch(paths.less, function(event) {
        gulp.run('css');
    });

    //监听js
    gulp.watch(paths.js, function(event) {
        gulp.run('js');
    });

    //监听图片
    var imgWatcher = gulp.watch(paths.img, function(event) {
        gulp.run('img');
    });

    //监听图片删除
    imgWatcher.on('change', function(event) {
        if (event.type == 'deleted') {
            gulp.run('img');
        }
    });
});
