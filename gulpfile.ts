/// <reference path="typings/tsd.d.ts" />
var gulp = require('gulp');
var util = require('gulp-util');
var del = require('del');
var path = require('path');
var less = require('gulp-less');
var lib = require('bower-files')();
import browserify = require('browserify');
var watchify = require('watchify');
var tsify = require('tsify');
var source = require('vinyl-source-stream');
import ts = require('gulp-typescript');
var browserSync = require('browser-sync').create();
var debowerify = require('debowerify');
var deamdify = require('deamdify');
var reload = browserSync.reload;

var bundlerOptions = {
	debug: true
}

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
	return bundler.add('scripts/app.ts')
		.plugin(tsify)
		.transform(debowerify)
		.transform(deamdify);
}

function processScripts(bundler) {
	return bundler.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest('public/js'));
}

function compileScripts() {
	var bundler = prepareBundler(browserify(bundlerOptions));
	return processScripts(bundler);
}

function watchScripts() {
	var bundler = prepareBundler(watchify(browserify(watchify.args), bundlerOptions));
	function rebundle() {
		return processScripts(bundler);
	}
	bundler.on('update', rebundle);
	bundler.on('log', util.log);
	return rebundle();
}

function server() {
	return gulp.src('server.ts')
		.pipe(ts({ module: 'commonjs' })).js
		.pipe(gulp.dest('./'));
}

function startBrowserSync() {
	browserSync.init({
		server: 'public',
		files: 'public/**'
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
gulp.task('bower', gulp.series(cleanBowerFiles, copyBowerFiles));
gulp.task('build:frontend', gulp.parallel('bower', compileLess, compileScripts));
gulp.task('build', gulp.parallel('build:frontend', server))
gulp.task('watch', gulp.series('build:frontend',
	gulp.parallel(startBrowserSync, watchLess, watchScripts)));
gulp.task('default', gulp.series('build'));