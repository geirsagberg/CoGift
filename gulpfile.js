var gulp = require('gulp');
var util = require('gulp-util');
var del = require('del');
var path = require('path');
var less = require('gulp-less');
var lib = require('bower-files')();
var browserify = require('browserify');
var watchify = require('watchify');
var tsify = require('tsify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var ts = require('gulp-typescript');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash').assign;

var bundlerOptions = {
	debug: true
};

function cleanBowerFiles(done) {
	del('public/lib', done);
}

function copyBowerFiles() {
	return gulp.src(lib.match('**/fonts/**').files)
		.pipe(gulp.dest('public/fonts'));
}

function compileLess() {
	return gulp.src('styles/app.less')
		.pipe(less({
		paths: ['styles', 'bower_components', 'bower_components/bootstrap/less']
	}))
		.pipe(gulp.dest('public/css'));
}

function prepareBundler(bundler) {
	return bundler.add('scripts/app.js')
		// .plugin(require('minifyify'), {map: 'app.map.json'})
		.transform(require('babelify').configure({
			only: ['scripts', 'views']
		}))
		.transform(require('debowerify'));
		// .transform(require('deamdify'))
		// .transform(require('deglobalify'));
}

function processScripts(bundler) {
	return bundler.bundle()
		.on('error', util.log.bind(util, 'Browserify Error'))
		.pipe(source('app.js'))
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

function buildServer() {
	return gulp.src('server.ts')
		.pipe(ts({ module: 'commonjs' })).js
		.pipe(gulp.dest('./'));
}

function startBrowserSync() {
	browserSync.init({
		server: 'public',
		files: 'public/**',
		open: false
	});
}

function startBrowserSyncProxy() {
	browserSync.init({
		files: 'public/**',
		proxy: 'http://localhost:3500',
		open: false
	});
}

function startServer(){
	nodemon({
		script: 'server.js',
		ignore: ['public/', 'node_modules/', 'bower_components/', 'scripts/', 'styles/'],
		tasks: 'server',
		execMap: {
			js: 'node --harmony_arrow_functions'
		}
	});
}


function watchLess() {
	gulp.watch('styles/**', gulp.series(compileLess));
}

gulp.task(cleanBowerFiles);
gulp.task(copyBowerFiles);
gulp.task(compileLess);
gulp.task(compileScripts);
gulp.task(watchScripts);
gulp.task(startServer);
gulp.task(buildServer);
gulp.task('bower', gulp.series(cleanBowerFiles, copyBowerFiles));
gulp.task('build-frontend', gulp.parallel('bower', compileLess, compileScripts));
gulp.task('build', gulp.parallel('build-frontend'));
gulp.task('prepare-watch', gulp.parallel('bower', compileLess));
gulp.task('watch', gulp.series('prepare-watch',
	gulp.parallel(startBrowserSync, watchLess, watchScripts)));
gulp.task('watch-server', gulp.series('build', 
	gulp.parallel(startServer, startBrowserSyncProxy, watchLess, watchScripts)
));
gulp.task('default', gulp.series('build'));