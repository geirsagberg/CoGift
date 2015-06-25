import gulp from 'gulp';
import util from 'gulp-util';
import less from 'gulp-less';
import browserify from 'browserify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import nodemon from 'gulp-nodemon';
import { assign } from 'lodash';
import LessNpmImport from 'less-plugin-npm-import';
import LessCleanCss from 'less-plugin-clean-css';
import LessAutoPrefix from 'less-plugin-autoprefix';
import notify from 'gulp-notify';
import compress from 'compression';
import gulpif from 'gulp-if';
import del from 'del';
var browserSync = require('browser-sync').create();

var isProduction = process.env.NODE_ENV === 'production';

var bundlerOptions = {
  debug: true // Must be true for minifyify to work
};

const assets = ['html/**', 'favicons/**'];

function clean(done) {
  del('public', done);
}

function compileLess() {
  return gulp.src('styles/app.less')
    .pipe(gulpif(isProduction, sourcemaps.init()))
    .pipe(less({
      paths: ['styles'],
      plugins: [new LessNpmImport(), new LessAutoPrefix(), new LessCleanCss()]
    }))
    .pipe(gulpif(isProduction, sourcemaps.write('maps')))
    .pipe(gulp.dest('public/css'));
}

function prepareBundler(bundler) {
  return bundler.add('scripts/index.js')
    .plugin(require('minifyify'), {
      map: !isProduction && 'index.map.json',
      output: 'public/js/index.map.json'
    })
    .transform(require('babelify').configure({
      only: ['scripts', 'views', 'common']
    }))
    .transform(require('debowerify'));
}

function notifyError(description) {
  return function() {
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
    .on('error', notifyError('Browserify'))
    .pipe(source('index.js'))
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

function copyStatics() {
  return gulp.src(assets)
    .pipe(gulp.dest('public'));
}

var browserSyncFiles = ['public/**', '!public/**/*.map'];

function startBrowserSyncProxy() {
  browserSync.init({
    files: browserSyncFiles,
    proxy: {
      target: 'http://localhost:3500',
      middleware: [compress()]
    },
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

function watchLess() {
  gulp.watch('styles/*.less', compileLess);
}

function watchStatics() {
  gulp.watch(assets, copyStatics);
}

gulp.task(clean);
gulp.task(compileLess);
gulp.task(compileScripts);
gulp.task(watchScripts);
gulp.task(startServer);
gulp.task('watchServer', gulp.series(
  gulp.parallel(compileLess, copyStatics),
  gulp.parallel(startServer, startBrowserSyncProxy, watchLess, watchScripts, watchStatics)));
gulp.task('brackets', gulp.parallel(watchLess, watchScripts));

const build = gulp.series(clean, gulp.parallel(compileLess, compileScripts, copyStatics));
gulp.task('build', build);
gulp.task('default', build);
