var gulp = require('gulp');
var util = require('gulp-util');
// var del = require('del');
var less = require('gulp-less');
var lib = require('bower-files')();
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
// var buffer = require('vinyl-buffer');
// var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
import {assign, unique} from 'lodash';
var NpmImportPlugin = require('less-plugin-npm-import');
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';

var bundlerOptions = {
  debug: true
};

// function cleanBowerFiles(done) {
// 	del('public/lib', done);
// }

// function copyBowerFiles() {
// 	return gulp.src(lib.match('**/fonts/**').files)
// 		.pipe(gulp.dest('public/fonts'));
// }

function getBowerStylePaths(){
  return unique(lib.ext(['css', 'less']).files.map(f => f.slice(0, f.lastIndexOf('/'))));
}

function compileLess() {
  return gulp.src('styles/app.less')
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: ['styles', ...getBowerStylePaths()],
      plugins: [new NpmImportPlugin()]
    }))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('public/css'));
}

function prepareBundler(bundler) {
  return bundler.add('scripts/index.js')
    //.plugin(require('minifyify'), {map: 'index.map.json', output: 'public/js/index.map.json'})
    .transform(require('babelify').configure({
      only: ['scripts', 'views', 'common']
    }))
    .transform(require('debowerify'));
}

function notifyError (description) {
  return function () {
    var args = [].slice.call(arguments);
    notify.onError({
      title: description + ' error',
      message: '<%= error.message %>'
    }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task
  };
}

function processScripts(bundler) {
  return bundler.bundle()
    // .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    //.on('error', util.log.bind(util, 'Browserify Error'))
    .on('error', notifyError('Browserify'))
    .pipe(source('index.js'))
    // .pipe(buffer())
    // .pipe(sourcemaps.init({loadMaps: true}))
    // .pipe(uglify())
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/js'));
}

function compileScripts() {
  var bundler = prepareBundler(browserify(bundlerOptions));
  return processScripts(bundler);
}

function watchScripts() {
  var options = assign({}, watchify.args, bundlerOptions);
  var bundler = prepareBundler(watchify(browserify(options)));

  function rebundle() {
    return processScripts(bundler);
  }
  bundler.on('update', rebundle);
  bundler.on('log', util.log);
  return rebundle();
}

var browserSyncFiles = ['public/**', '!public/**/*.map'];

function startBrowserSync() {
  browserSync.init({
    server: 'public',
    files: browserSyncFiles,
    open: false
  });
}

function startBrowserSyncProxy() {
  browserSync.init({
    files: browserSyncFiles,
    proxy: 'http://localhost:3500',
    open: false
  });
}

function startServer() {
  nodemon({
    script: 'server/server.js',
    ignore: ['public/', 'node_modules/', 'bower_components/', 'scripts/', 'styles/'],
    execMap: {
      js: 'npm run babel-node --'
    }
  });
}

const watchLess = gulp.series(compileLess, function watchLess() {
  gulp.watch('styles/*.less', compileLess);
});

// gulp.task(cleanBowerFiles);
// gulp.task(copyBowerFiles);
// gulp.task('bower', gulp.series(cleanBowerFiles, copyBowerFiles));

gulp.task(compileLess);
gulp.task(compileScripts);
gulp.task('watchLess', watchLess);
gulp.task(watchScripts);
gulp.task(startServer);
const build = gulp.parallel(compileLess, compileScripts);
gulp.task('watch', gulp.parallel(startBrowserSync, watchLess, watchScripts));
gulp.task('watchServer', gulp.parallel(startServer, startBrowserSyncProxy, watchLess, watchScripts) );
gulp.task('brackets', gulp.parallel(watchLess, watchScripts));
gulp.task('build', build);
gulp.task('default', build);
