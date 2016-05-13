var gulp=require('gulp');
var uglify=require('gulp-uglify'); // For minified JS.
var rename=require('gulp-rename'); // add .min  suffix.
var minify = require('gulp-clean-css'); // For minified CSS.
var concat =require('gulp-concat');

// Minify css files from styles folder.
gulp.task('css-uglify',function(){
	gulp.src(['styles/*.css','!styles/*.min.css'])
	//.pipe(rename({suffix:'.min'}))
	.pipe(minify({debug:true},function(details){
		//console.log(details.name.replace('.min','')+' : '+details.stats.originalSize)
		//console.log(details.name+' : '+details.stats.minifiedSize)
	}).on('error',function(e){
		console.log(e)
	}))
	.pipe(concat('style.min.css'))
	.pipe(gulp.dest('styles'))
});

// Minify JS files of the project.
// NOTE: controller files are not minified.
gulp.task('script-uglify',function(){
	gulp.src(['libs/*.js','!libs/*.min.js'])
	.pipe(rename({suffix:'.min'}))
	.pipe(uglify().on('error',function(e){
		console.log(e)
	}))
	.pipe(gulp.dest('libs'));
})