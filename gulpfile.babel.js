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
import autoprefixer from 'gulp-autoprefixer';
import notify from 'gulp-notify';
import compress from 'compression';
import gulpif from 'gulp-if';
import del from 'del';
import changed from 'gulp-changed';
var browserSync = require('browser-sync').create();

var isProduction = process.env.NODE_ENV === 'production';

util.log(`Production: ${isProduction}`);

var bundlerOptions = {
  debug: true // Must be true for minifyify to work
};

const ASSETS_FOLDERS = ['html/**/*.*', 'favicons/**/*.*'];
const DEST_FOLDER = 'public';
const DEST_CSS_FOLDER = 'public/css';

function clean(done) {
  del('public', done);
}

function compileLess() {
  return gulp.src('styles/app.less')
    .pipe(gulpif(!isProduction, sourcemaps.init()))
    .pipe(less({
      paths: ['styles'],
      plugins: [new LessNpmImport(), new LessCleanCss()]
    }))
    .pipe(autoprefixer())
    .pipe(gulpif(!isProduction, sourcemaps.write('maps')))
    .pipe(gulp.dest('public/css'));
}

function prepareBundler(bundler) {
  bundler.add('scripts/index.js')
    .transform(require('babelify').configure({
      only: ['scripts', 'views', 'common']
    }))
    .transform(require('debowerify'));
  if (isProduction) {
    bundler.plugin(require('minifyify'), {
      map: !isProduction && 'index.map.json',
      output: 'public/js/index.map.json'
    });
  }
  return bundler;
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

function copyFonts() {
  return gulp.src('icomoon/fonts/**', { base: 'icomoon' })
    .pipe(changed(DEST_CSS_FOLDER))
    .pipe(gulp.dest(DEST_CSS_FOLDER));
}

function copyStatics() {
  return gulp.src(ASSETS_FOLDERS)
    .pipe(changed(DEST_FOLDER))
    .pipe(gulp.dest(DEST_FOLDER));
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
  gulp.watch(ASSETS_FOLDERS, copyStatics);
}

gulp.task(clean);
gulp.task(compileLess);
gulp.task(compileScripts);
gulp.task(watchScripts);
gulp.task(startServer);
gulp.task(copyStatics);
gulp.task('watchServer', gulp.series(copyStatics, copyFonts, compileLess,
  gulp.parallel(startServer, startBrowserSyncProxy, watchLess, watchScripts, watchStatics)));
gulp.task('brackets', gulp.parallel(watchLess, watchScripts));

const build = gulp.series(clean, gulp.parallel(compileLess, compileScripts, copyStatics, copyFonts));
gulp.task('build', build);
gulp.task('default', build);
