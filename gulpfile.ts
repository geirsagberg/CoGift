/// <reference path="typings/tsd.d.ts" />
var gulp = require('gulp');
var del = require('del');
var path = require('path');
var less = require('gulp-less');
var lib = require('bower-files')();
import browserify = require('browserify');
var tsify = require('tsify');
var source = require('vinyl-source-stream');

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
		paths: ['bower_components', 'styles']
	}))
    .pipe(gulp.dest('public/css'));
}

function compileScripts() {
	var bundle = browserify('scripts/app.ts')
		.plugin('tsify')
		.bundle();
	
	return bundle
		.pipe(source('app.js'))
		.pipe(gulp.dest('public/js'));
}

gulp.task(cleanBowerFiles);
gulp.task(copyBowerFiles);
gulp.task(compileLess);
gulp.task('bower', gulp.series(cleanBowerFiles, copyBowerFiles));
gulp.task('build', gulp.parallel('bower', compileLess, compileScripts));
gulp.task('default', gulp.series('build'));