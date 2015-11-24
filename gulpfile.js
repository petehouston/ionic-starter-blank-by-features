var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var $ = require('gulp-load-plugins')();
var argv = require('yargs').argv;

var paths = {
  sass: ['./scss/**/*.scss'],
  templates: ['./templates'],
  features: ['./www/features']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('make:features', function (done) {
    if (!argv.feature) {
        console.log(
            'Error: ' + gutil.colors.red('must pass -feature- name'),
            '\n $ gulp make:features --feature=FEATURE'
        );
        process.exit(1);
    }
    gulp.src(paths.templates + '/feature.js')
        .pipe($.template({
            module: argv.module || 'app.features.' + argv.feature,
            feature: argv.feature,
            state: argv.state || argv.feature,
            controller: argv.controller || argv.feature,
            title: argv.title || argv.feature
        }))
        .pipe($.rename(argv.feature + '.js'))
        .pipe(gulp.dest(paths.features + '/' + argv.feature));
    gulp.src(paths.templates + '/feature.tpl.html')
        .pipe($.rename(argv.feature + '.tpl.html'))
        .pipe(gulp.dest(paths.features + '/' + argv.feature));

    var target = gulp.src('./www/index.html');
    var source = gulp.src(
        paths.features + '/' + argv.feature + '.js',
        { read: false }
    );
    target
        .pipe($.inject(source, {
            name: 'feature'
        }))
        .pipe(gulp.dest('./www'));

    done();
});
