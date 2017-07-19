var gulp = require('gulp'),
    configLocal = require('./gulp-config.json'),
    merge = require('merge'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    scsslint = require('gulp-scss-lint'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    readme = require('gulp-readme-to-markdown'),
    purifyCSS = require('purify-css'),
    tap = require('gulp-tap'),
    browserSync = require('browser-sync').create();

var configDefault = {
    src: {
      scssPath: './src/scss'
    },
    dist: {
      cssPath: './static/css'
    },
    packagesPath: './node_modules'
  },
  config = merge(configDefault, configLocal);


//
// CSS
//

// Lint all scss files
gulp.task('scss-lint', function() {
  return gulp.src(config.src.scssPath + '/*.scss')
    .pipe(scsslint());
});

// Compile + bless primary scss files
gulp.task('css-main', function() {
  return gulp.src(config.src.scssPath + '/athena-gf.scss')
    .pipe(sass({
      includePaths: [config.src.scssPath, config.packagesPath]
    })
      .on('error', sass.logError))
    .pipe(tap(function(file) {
      return purifyCSS('', file.contents.toString(), {
        info: true,
        whitelist: ['*gform*', '*ui-datepicker*']
      }, function(output){
        file.contents = new Buffer(output);
      });
    }))
    // TODO: re-enable cleanCSS
    // TODO: try to filter out html, body selectors from Athena
    // .pipe(cleanCSS({
    //   level: {
    //     1: {
    //       specialComments: ''
    //     }
    //   }
    // }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(rename('athena-gf.min.css'))
    .pipe(gulp.dest(config.dist.cssPath))
    .pipe(browserSync.stream());
});

// All css-related tasks
gulp.task('css', ['scss-lint', 'css-main']);


//
// Readme
//

// Create a Github-flavored markdown file from the plugin readme.txt
gulp.task('readme', function() {
  return gulp.src(['readme.txt'])
    .pipe(readme({
      details: false,
      screenshot_ext: [],
    }))
    .pipe(gulp.dest('.'));
});


// Rerun tasks when files change
gulp.task('watch', function() {
  if (config.sync) {
    browserSync.init({
        proxy: {
          target: config.target
        }
    });
  }

  gulp.watch(config.src.scssPath + '/**/*.scss', ['css']);
  gulp.watch('./**/*.php').on('change', browserSync.reload);
  gulp.watch('readme.txt', ['readme']);
});

// Default task
gulp.task('default', ['css', 'readme']);
