var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var del = require('del');

gulp.task('clean', function(cb) {
    del(['./dist/*', cb]);
});

gulp.task('build-lib', function() {
    return gulp.src('src/lib/**/*.js')
        .pipe(babel({
            presets: ['es2015', 'stage-1']
        }))
        .pipe(gulp.dest('dist/lib/'));
});

gulp.task('build-bin', function() {
    return gulp.src('src/bin/**/*.js')
        .pipe(babel({
            presets: ['es2015', 'stage-1']
        }))
        .pipe(gulp.dest('dist/bin/'));
});

gulp.task('build', ['build-lib', 'build-bin']);
