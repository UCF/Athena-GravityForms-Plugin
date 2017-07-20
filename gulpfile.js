var gulp = require('gulp'),
    configLocal = require('./gulp-config.json'),
    merge = require('merge'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    scsslint = require('gulp-scss-lint'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    readme = require('gulp-readme-to-markdown'),
    tap = require('gulp-tap'),
    css = require('css'),
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
      return filterAthenaCSS(file);
    }))
    .pipe(cleanCSS())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(rename('athena-gf.min.css'))
    .pipe(gulp.dest(config.dist.cssPath))
    .pipe(browserSync.stream());
});

// Removes Athena-specific styles.  Leaves only selectors and media queries
// with selectors that begin with '.gform_wrapper' or 'ui-datepicker'.
//
// NOTE: This function will strip out any at-rules besides @media--if custom
// @import, @keyframe, etc rules ever need to be added to athena-gf.min.css,
// this function will need to be updated!
function filterAthenaCSS(file) {
  var cssObj = css.parse(file.contents.toString());

  if (cssObj) {
    var rules = cssObj.stylesheet.rules,
        filteredRules = [];

    // Loop through every rule. Store valid rules in filteredRules.
    for(var i=0; i<rules.length; i++) {
      var rule = rules[i],
          filteredSelectors = [];

      if (rule.type === 'rule') {
        // Check each selector in the rule for selectors we want to keep.
        // If a selector in the rule's selector list matches, add it to
        // filteredSelectors.
        filteredSelectors = getFilteredSelectors(rule, filteredSelectors);

        // Check the rule's filteredSelectors array; if it's not empty, add
        // the rule to filteredRules.
        if (filteredSelectors.length) {
          rule.selectors = filteredSelectors;
          filteredRules.push(rule);
        }
      }
      else if (rule.type === 'media') {
        var filteredSubnodes = [];

        for (var k=0; k<rule.rules.length; k++) {
          var subnode = rule.rules[k],
              filteredSubnodeSelectors = [];

          if (subnode.type === 'rule') {
            // Check each selector in the rule for selectors we want to keep.
            // If a selector in the rule's selector list matches, add it to
            // filteredSubnodeSelectors.
            filteredSubnodeSelectors = getFilteredSelectors(subnode, filteredSubnodeSelectors);

            // Check the rule's filteredSubnodeSelectors array; if it's not empty, add
            // the rule to filteredSubnodes.
            if (filteredSubnodeSelectors.length) {
              subnode.selectors = filteredSubnodeSelectors;
              filteredSubnodes.push(subnode);
            }
          }
        }

        if (filteredSubnodes.length) {
          rule.rules = filteredSubnodes;
          filteredRules.push(rule);
        }
      }
    }

    // Finally, replace cssObj's old ruleset with our filtered one:
    cssObj.stylesheet.rules = filteredRules;

    // Return a buffer for gulp to continue with
    file.contents = new Buffer(css.stringify(cssObj));
  }
  else {
    console.log('Couldn\'t parse CSS--skipping');
  }
}

// Returns an array of filtered selectors present in a given node.
function getFilteredSelectors(node, filteredSelectors) {
  for (var i=0; i<node.selectors.length; i++) {
    var selector = node.selectors[i];
    if (selector.startsWith('.gform_wrapper') || selector.startsWith('.ui-datepicker')) {
      filteredSelectors.push(selector);
    }
  }
  return filteredSelectors;
}

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
