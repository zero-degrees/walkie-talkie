/**
 * Walkie Talkie
 * https://github.com/zero-degrees/walkie-talkie
 *
 * @copyright 2017 Craig Russell
 * @license MIT
 */

'use strict';

var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCss = require('gulp-clean-css'),
	concat = require('gulp-concat');

var input = {
		script: 'walkie-talkie.js',
		styles: 'walkie-talkie.scss'
	},
	output = {
		script: 'walkie-talkie.min.js',
		styles: 'walkie-talkie.min.css'
	};

gulp.task('jshint', function() {
	return gulp.src(input.script)
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('js', ['jshint'], function() {
	return gulp.src(input.script)
		.pipe(uglify({
			preserveComments: 'license'
		}))
		.pipe(concat(output.script))
		.pipe(gulp.dest('./'));
});

gulp.task('sass', function() {
	return gulp.src(input.styles)
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(cleanCss())
		.pipe(concat(output.styles))
		.pipe(gulp.dest('./'));
});

gulp.task('build', ['js', 'sass']);

gulp.task('default', ['build']);