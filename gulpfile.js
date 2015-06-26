var gulp = require('gulp')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , react = require('gulp-react')
  , htmlreplace = require('gulp-html-replace')
  , path
;

// Configuration ===============================================================

path = {
  HTML: 'public/src/index.html',
  ALL: ['public/src/js/*.js',
    'public/src/js/**/*.js',
    'public/src/index.html'
  ],
  JS: ['public/src/js/*.js',
    'public/src/js/**/*.js'
  ],
  MINIFIED_OUT: 'build.min.js',
  DEST_SRC: 'public/dist/src',
  DEST_BUILD: 'public/dist/build',
  DEST: 'public/dist'
};

// Development Tasks ===========================================================

gulp.task('transform', function () {
  gulp.src(path.JS)
    .pipe(react())
    .pipe(gulp.dest(path.DEST_SRC))
  ;
});

gulp.task('copy', function () {
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST))
  ;
});

gulp.task('watch', function () {
  gulp.watch(path.ALL, ['transform', 'copy']);
});

gulp.task('default', ['watch']);

// Production Tasks ============================================================

gulp.task('build', function () {
  gulp.src(path.JS)
    .pipe(react())
    .pipe(concat(path.MINIFIED_OUT))
    .pipe(uglify(path.MINIFIED_OUT))
    .pipe(gulp.dest(path.DEST_BUILD))
  ;
});

gulp.task('replaceHTML', function () {
  gulp.src(path.HTML)
    .pipe(htmlreplace({ 'js': 'build/' + path.MINIFIED_OUT }))
    .pipe(gulp.dest(path.DEST))
  ;
});

gulp.task('production', ['replaceHTML', 'build']);