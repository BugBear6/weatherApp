var gulp = require('gulp'), 
		sourcemaps = require('gulp-sourcemaps'),
		sass = require('gulp-sass'),
		minifyhtml = require('gulp-htmlmin'),
    uglify = require('gulp-uglify');

	function errorLog(e){
		console.log(e);
		this.emit('end');
	}

gulp.task('sass', function(){
  return gulp.src('./sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass( {outputStyle : 'compressed'}).on('error', errorLog))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('../app/css/'));
});

gulp.task('minifyhtml', function() {
  return gulp.src('./*.html')
    .pipe(minifyhtml({collapseWhitespace: true}))
    .pipe(gulp.dest('../app/'));
});

gulp.task('compress', function() {
    return gulp.src('./js/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('../app/js'));        
});

gulp.task('watch', function(){
	gulp.watch('./sass/**/*.scss', ['sass']);
	gulp.watch('./js/**/*.js', ['compress']);
	gulp.watch('./*.html', ['minifyhtml']);
});

gulp.task('default', ['sass', 'minifyhtml', 'compress', 'watch']);