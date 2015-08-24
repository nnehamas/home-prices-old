'use strict';

//=========
// MODULES
//=========
var gulp = require('gulp'),
    fs = require('fs'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    nunjucksRender = require('gulp-nunjucks-render'),
    copy = require('gulp-copy'),
    jshint = require('gulp-jshint'),
    reload = browserSync.reload,
    shell = require('gulp-shell');

//========
// FILES  
//========

var src = {
    app: 'app/',
    scss: 'app/scss/*.scss',
    css:  'app/css',
    js: 'app/js/*.js',
    jsLibs: 'app/js/libs/*.js',
    html: 'app/*.html',
    indexTemplate: 'app/templates/index.html',
    templates: 'app/templates/*.html',
    includes: 'app/templates/includes/*.html',
    data: ['app/js/libs/data/*.csv','app/js/libs/data/*.json', 'app/js/libs/data/*.geojson']
};

//===========
// TASK LIST
//===========

// Compile SCSS into CSS
gulp.task('sass', function() {
    return gulp.src(src.scss)
        .pipe(sass())
        .pipe(gulp.dest(src.css))
        .pipe(reload({stream: true}));
});

// Plug info from Google Sheets and render templates
gulp.task('render', function () {

    // Pull in nunjuck and vinyl-map modules
    var nj = require('nunjucks'),
        map = require('vinyl-map'),
        data = JSON.parse(fs.readFileSync('data.json', 'utf8')),

        nunjuckified = map(function(code){
           return nj.renderString(code.toString(), data);
        }),
        
        env = nj.configure('app', {watch: false});

    nunjucksRender.nunjucks.configure(['app/templates/']);
    
    return gulp.src(src.indexTemplate)
        .pipe(nunjuckified)
        .pipe(nunjucksRender())
        .pipe(gulp.dest(src.app));
});

// JSHint
gulp.task('jshint', function (){
    gulp.src([src.js, src.jsLibs])
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('jshint-stylish'));
});

// Static server + watch scss/html/js files
gulp.task('serve', ['sass', 'render'], function() {

    // Start browserSync
    browserSync({
        server: './app'
    });

    // Watch SCSS, which injects into CSS
    gulp.watch(src.scss, ['sass']);

    // Watch HTML and data files + reload on change
    gulp.watch([src.html, src.data]).on('change', reload);

    // Watch JS files with JSHint and reload on change
    gulp.watch([src.js, src.jsLibs], ['jshint']).on('change', reload);

    // Watch the HTML templates and reload on change
    gulp.watch([src.templates, src.includes], ['render']).on('change', reload);

});

// Copy files from /app to /build
gulp.task('copy', function() {
    
    // Grab file paths
    var buildSrc = {
        html: 'app/*.html',
        css: 'app/css/*.css',
        cssLibs: 'app/css/libs/**/*.css',
        js: 'app/js/*.js',
        jsLibs: 'app/js/libs/**/*.js',
        img: 'app/img/*.jpg',
        png: 'app/img/*.png',
        dataCSV: 'app/js/libs/data/*.csv', 
        dataJSON:'app/js/libs/data/*.json',
        dataGeoJSON:'app/js/libs/data/*.geojson'
    };

    // Group them into files var
    var files = [
        buildSrc.html, 
        buildSrc.css, 
        buildSrc.cssLibs,
        buildSrc.js,
        buildSrc.img,
        buildSrc.png, 
        buildSrc.jsLibs,
        buildSrc.dataCSV,
        buildSrc.dataJSON,
        buildSrc.dataGeoJSON
    ];

    return gulp.src(files)
        .pipe(copy('build/'));
});

// Download Google Sheet data 
// and update data.json
gulp.task('fetch', shell.task([
  'npm run fetch/spreadsheet',
]));

//====================
// COMMAND LINE TASKS  
//====================

// Run server for development
gulp.task('default', ['fetch', 'serve']);

// Build all files into 
// deployable 'build' folder
gulp.task('build', ['copy']);