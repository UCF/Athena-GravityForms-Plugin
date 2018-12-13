/* global Buffer */

const fs           = require('fs');
const gulp         = require('gulp');
const merge        = require('merge');
const sass         = require('gulp-sass');
const rename       = require('gulp-rename');
const sassLint     = require('gulp-sass-lint');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS     = require('gulp-clean-css');
const readme       = require('gulp-readme-to-markdown');
const tap          = require('gulp-tap');
const css          = require('css');
const browserSync  = require('browser-sync').create();

let config = {
  src: {
    scssPath: './src/scss'
  },
  dist: {
    cssPath: './static/css'
  },
  packagesPath: './node_modules',
  sync: false,
  syncTarget: 'http://localhost/wordpress/'
};

/* eslint-disable no-sync */
if (fs.existsSync('./gulp-config.json')) {
  const overrides = JSON.parse(fs.readFileSync('./gulp-config.json'));
  config = merge(config, overrides);
}
/* eslint-enable no-sync */


//
// Helper functions
//

// BrowserSync reload function
function serverReload(done) {
  if (config.sync) {
    browserSync.reload();
  }
  done();
}

// BrowserSync serve function
function serverServe(done) {
  if (config.sync) {
    browserSync.init({
      proxy: {
        target: config.syncTarget
      }
    });
  }
  done();
}


//
// CSS
//

// Lint all SCSS files
gulp.task('scss-lint', () => {
  return gulp.src(`${config.src.scssPath}/*.scss`)
    .pipe(sassLint())
    .pipe(sassLint.failOnError());
});

// Compile primary SCSS files
gulp.task('css-main', () => {
  return gulp.src(`${config.src.scssPath}/athena-gf.scss`)
    .pipe(sass({
      includePaths: [config.src.scssPath, config.packagesPath]
    })
      .on('error', sass.logError))
    .pipe(tap((file) => {
      return filterAthenaCSS(file);
    }))
    .pipe(cleanCSS())
    .pipe(autoprefixer({
      // Supported browsers added in package.json ("browserslist")
      cascade: false
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(config.dist.cssPath));
});

// Removes Athena-specific styles.  Leaves only selectors and media queries
// with selectors that begin with '.gform_wrapper' or 'ui-datepicker'.
//
// NOTE: This function will strip out any at-rules besides @media--if custom
// @import, @keyframe, etc rules ever need to be added to athena-gf.min.css,
// this function will need to be updated!
function filterAthenaCSS(file) {
  const cssObj = css.parse(file.contents.toString());

  if (cssObj) {
    const rules = cssObj.stylesheet.rules;
    const filteredRules = [];

    // Loop through every rule. Store valid rules in filteredRules.
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      let filteredSelectors = [];

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
      } else if (rule.type === 'media') {
        const filteredSubnodes = [];

        for (let k = 0; k < rule.rules.length; k++) {
          const subnode = rule.rules[k];
          let filteredSubnodeSelectors = [];

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
    file.contents = Buffer.from(css.stringify(cssObj));
  } else {
    console.log('Couldn\'t parse CSS--skipping'); // eslint-disable-line no-console
  }
}

// Returns an array of filtered selectors present in a given node.
function getFilteredSelectors(node, filteredSelectors) {
  for (let i = 0; i < node.selectors.length; i++) {
    const selector = node.selectors[i];
    if (selector.startsWith('.gform_wrapper') || selector.startsWith('.ui-datepicker')) {
      filteredSelectors.push(selector);
    }
  }
  return filteredSelectors;
}

// All css-related tasks
gulp.task('css', gulp.series('scss-lint', 'css-main'));


//
// Documentation
//

// Create a Github-flavored markdown file from the plugin readme.txt
gulp.task('readme', () => {
  return gulp.src(['readme.txt'])
    .pipe(readme({
      details: false,
      screenshot_ext: [] // eslint-disable-line camelcase
    }))
    .pipe(gulp.dest('.'));
});


//
// Rerun tasks when files change
//
gulp.task('watch', (done) => {
  serverServe(done);

  gulp.watch(`${config.src.scssPath}/**/*.scss`, gulp.series('css', serverReload));
  gulp.watch('./**/*.php', gulp.series(serverReload));
});


//
// Default task
//
gulp.task('default', gulp.series('css', 'readme'));
