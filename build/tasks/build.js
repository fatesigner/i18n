/**
 * build
 * copy src files to output path
 */

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');

require('./build-cjs');
require('./build-esm');
require('./build-examples');
require('./build-umd');
require('./clean');

gulp.task(
  'build',
  gulp.series('clean', gulp.parallel('build-cjs', 'build-esm', 'build-umd', 'build-examples'), async function () {
    const env = require('../env')();

    // Copy npm publish files to output
    await new Promise((resolve) => {
      gulp
        .src(['README.md'].map((x) => path.join(env.rootPath, x)))
        .pipe(gulp.dest(env.outputPath))
        .on('end', resolve);
    });

    // Write package.json file to output
    const pkg = require('../../package.json');
    if (pkg.scripts) {
      pkg.scripts = Object.keys(pkg.scripts).reduce((prev, key) => {
        if (key !== 'prepare' || pkg.scripts[key].indexOf('husky install') < 0) {
          prev[key] = pkg.scripts[key];
        }
        return prev;
      }, {});
    }
    fs.writeFileSync(path.join(env.outputPath, 'package.json'), JSON.stringify(pkg, null, 2), { encoding: 'utf8' });
  })
);
